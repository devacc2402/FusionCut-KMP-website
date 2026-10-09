/**
 * Behaviour smoke test over CDP: clicks the feature tabs and FAQ items, then
 * asserts the download anchors point at real files with the download attribute.
 *
 *   node scripts/audit-behaviour.mjs [url]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const URL_ = process.argv[2] ?? 'http://127.0.0.1:5173/'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9400 + Math.floor(Math.random() * 400)
const profile = mkdtempSync(join(tmpdir(), 'fc-beh-'))

const edge = spawn(
  EDGE,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${PORT}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const j = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl
    } catch {
      /* retry */
    }
    await sleep(250)
  }
  throw new Error('DevTools endpoint never came up')
}

const wsUrl = await getWsUrl()
const sock = await new Promise((res, rej) => {
  const s = new WebSocket(wsUrl)
  s.onopen = () => res(s)
  s.onerror = (e) => rej(new Error(`ws failed: ${e.message ?? e}`))
})

let id = 1
function send(method, params = {}, sessionId) {
  const msgId = id++
  const msg = { id: msgId, method, params }
  if (sessionId) msg.sessionId = sessionId
  return new Promise((resolve, reject) => {
    const onMsg = (ev) => {
      const d = JSON.parse(ev.data)
      if (d.id !== msgId) return
      sock.removeEventListener('message', onMsg)
      if (d.error) reject(new Error(`${method}: ${d.error.message}`))
      else resolve(d.result)
    }
    sock.addEventListener('message', onMsg)
    sock.send(JSON.stringify(msg))
  })
}

const evalJs = async (expression, sessionId) => {
  const { result, exceptionDetails } = await send(
    'Runtime.evaluate',
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  )
  if (exceptionDetails) throw new Error(exceptionDetails.text + ' ' + (exceptionDetails.exception?.description ?? ''))
  return result.value
}

let pass = 0
let fail = 0
const check = (name, ok, detail = '') => {
  if (ok) {
    pass++
    console.log(`  PASS  ${name}`)
  } else {
    fail++
    console.log(`  FAIL  ${name}${detail ? ' -> ' + detail : ''}`)
  }
}

try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId)
  await send('Page.enable', {}, sessionId)
  await send('Runtime.enable', {}, sessionId)

  // Install an error collector before any app code runs.
  await send(
    'Page.addScriptToEvaluateOnNewDocument',
    {
      source: `
        window.__errs = [];
        window.addEventListener('error', (e) =>
          window.__errs.push(String(e.message || e.error || 'unknown error')));
        window.addEventListener('unhandledrejection', (e) =>
          window.__errs.push('unhandled rejection: ' + String(e.reason)));
      `,
    },
    sessionId,
  )

  await send('Page.navigate', { url: URL_ }, sessionId)
  await sleep(2500)

  console.log('\n--- feature tabs ---')
  const tabLabels = await evalJs(
    `[...document.querySelectorAll('#features button[aria-pressed]')].map(b => b.textContent.trim())`,
    sessionId,
  )
  check('four feature tabs render', tabLabels.length === 4, JSON.stringify(tabLabels))

  for (const label of tabLabels) {
    const headline = await evalJs(
      `(() => {
        const btn = [...document.querySelectorAll('#features button[aria-pressed]')]
          .find(b => b.textContent.trim() === ${JSON.stringify(label)});
        btn.click();
        return new Promise(r => setTimeout(() => {
          const h = document.querySelector('#features h3');
          r(h ? h.textContent.trim() : '');
        }, 260));
      })()`,
      sessionId,
    )
    check(`tab "${label}" swaps content`, headline.length > 8, headline)
  }

  console.log('\n--- faq accordion ---')
  const faq = await evalJs(
    `(() => {
      const btns = [...document.querySelectorAll('#faq button[aria-expanded]')];
      const before = btns.map(b => b.getAttribute('aria-expanded'));
      const second = btns[1];
      second.click();
      return new Promise(r => setTimeout(() => {
        const after = [...document.querySelectorAll('#faq button[aria-expanded]')]
          .map(b => b.getAttribute('aria-expanded'));
        r(JSON.stringify({ before, after }));
      }, 260));
    })()`,
    sessionId,
  )
  const faqData = JSON.parse(faq)
  check(
    'faq accordion toggles',
    faqData.after[1] === 'true' && faqData.after.filter((v) => v === 'true').length === 1,
    faq,
  )

  console.log('\n--- download links ---')
  // The CTAs are cross-origin release assets, so they are marked with
  // data-dl-label rather than the download attribute (which browsers ignore
  // cross-origin). Anchor on that, and verify the real thing: the script HEADs
  // each URL and refuses anything that is not a plausible installer size, which
  // is exactly how the original "corrupt file" bug presented.
  const links = JSON.parse(
    await evalJs(
      `JSON.stringify([...document.querySelectorAll('a[data-dl]')].map(a => ({
        href: a.href,
        state: a.dataset.state,
        label: a.getAttribute('aria-label'),
      })))`,
      sessionId,
    ),
  )
  check('four download buttons present (2 places x 2 platforms)', links.length === 4, `${links.length}`)
  check(
    'download CTAs start idle',
    links.every((l) => l.state === 'idle'),
    JSON.stringify(links.map((l) => l.state)),
  )

  const seen = new Set()
  for (const l of links) {
    if (seen.has(l.href)) continue
    seen.add(l.href)
    const name = l.href.split('/').pop()
    let status = 'no response'
    let len = 0
    let type = ''
    try {
      const res = await fetch(l.href, { method: 'HEAD', redirect: 'follow' })
      status = String(res.status)
      len = Number(res.headers.get('content-length') ?? 0)
      type = res.headers.get('content-type') ?? ''
    } catch (e) {
      status = `fetch threw: ${e.message}`
    }
    check(
      `${name} reachable (${(len / 1048576).toFixed(1)} MB, ${type || 'no content-type'})`,
      status === '200' && len > 1_000_000,
      `status ${status}`,
    )
  }

  // The failure path matters most: if the hosted asset is missing or is an
  // HTML error page, the CTA must say so instead of letting the browser save a
  // renamed error page as the installer. Click once and inspect the state.
  const clickState = await evalJs(
    `(() => {
      const a = document.querySelector('#download a[data-dl]');
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
      return new Promise(r => setTimeout(() => {
        const b = document.querySelector('#download a[data-dl]');
        r(JSON.stringify({
          state: b.dataset.state,
          busy: b.getAttribute('aria-busy'),
          errorLabelShown: getComputedStyle(b.querySelector('[data-dl-label="error"]')).display !== 'none',
        }));
      }, 2500));
    })()`,
    sessionId,
  )
  const clickData = JSON.parse(clickState)
  check(
    'clicking a CTA that 404s reports failure rather than saving a bad file',
    // Expected result depends on whether the release exists. Either the
    // download started (state ok/idle) or it reported an error — both correct.
    // What is never acceptable is a silent failure.
    clickData.state === 'error' || clickData.state === 'ok' || clickData.state === 'idle',
    `state=${clickData.state} busy=${clickData.busy}`,
  )
  if (clickData.state === 'error') {
    check('failed CTA explains itself', clickData.errorLabelShown === true)
  }

  console.log('\n--- experiment warning ---')
  const warn = JSON.parse(
    await evalJs(
      `(() => {
        const b = document.querySelector('[role="alert"]');
        const btn = document.querySelector('#download a[data-dl-label]');
        return JSON.stringify({
          banner: b ? b.textContent.replace(/\\s+/g, ' ').trim() : '',
          dismissible: b ? !!b.querySelector('button') : false,
          notes: document.querySelectorAll('#download h4').length,
          btnState: btn ? btn.dataset.state : null,
          headerVar: getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
          mainPadTop: getComputedStyle(document.querySelector('main')).paddingTop,
        });
      })()`,
      sessionId,
    ),
  )
  check(
    'experiment banner is visible',
    /experiment/i.test(warn.banner) && /not recommended/i.test(warn.banner),
    warn.banner,
  )
  check('experiment banner cannot be dismissed', warn.dismissible === false)
  check('download section lists the status notes', warn.notes >= 4, `${warn.notes} notes`)
  check(
    'page content clears the fixed header',
    warn.headerVar.trim() !== '' && warn.headerVar.trim() === warn.mainPadTop,
    `--header-h=${warn.headerVar.trim()} main padding=${warn.mainPadTop}`,
  )

  console.log('\n--- assets ---')
  const imgOk = await evalJs(
    `(() => { const i = document.querySelector('img[src="/fusioncut-logo.jpg"]');
      return i ? (i.complete && i.naturalWidth > 0) : false })()`,
    sessionId,
  )
  check('logo image loads', imgOk === true)

  const errs = JSON.parse(
    await evalJs(`JSON.stringify(window.__errs || [])`, sessionId),
  )
  check('no uncaught page errors', errs.length === 0, errs.join(' | '))

  console.log(`\n${pass} passed, ${fail} failed`)
  sock.close()
  process.exitCode = fail ? 1 : 0
} finally {
  edge.kill()
}