/**
 * Screenshot helper with real device emulation.
 *
 * Unlike `msedge --headless --screenshot --window-size=N`, which lays the page
 * out at a different width than it captures, this sets the layout viewport via
 * CDP Emulation.setDeviceMetricsOverride and captures a full-page PNG. That
 * makes the output trustworthy at phone widths.
 *
 *   node scripts/shoot.mjs <url> <out.png> <width> <height> [fullPage]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [, , URL_ = 'http://127.0.0.1:5173/', OUT = 'shot.png', W = '390', H = '844', FULL = 'true', SCROLL_TO = ''] =
  process.argv

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9700 + Math.floor(Math.random() * 400)
const profile = mkdtempSync(join(tmpdir(), 'fc-shot-'))

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

try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })

  await send(
    'Emulation.setDeviceMetricsOverride',
    {
      width: Number(W),
      height: Number(H),
      deviceScaleFactor: 1,
      mobile: Number(W) < 700,
    },
    sessionId,
  )

  await send('Page.enable', {}, sessionId)
  await send('Page.navigate', { url: URL_ }, sessionId)
  await sleep(2600)

  // Scroll explicitly — smooth-scroll CSS makes bare hash jumps unreliable here.
  if (SCROLL_TO) {
    await send(
      'Runtime.evaluate',
      {
        expression: `(() => {
          const el = document.querySelector(${JSON.stringify(SCROLL_TO)});
          if (!el) return 'not found';
          const y = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: 'instant' });
          return 'scrolled to ' + Math.round(y);
        })()`,
        returnByValue: true,
      },
      sessionId,
    )
    await sleep(900)
  }

  if (FULL === 'true') {
    const { cssContentSize } = await send('Page.getLayoutMetrics', {}, sessionId)
    await send(
      'Emulation.setDeviceMetricsOverride',
      {
        width: Number(W),
        height: Math.min(Math.ceil(cssContentSize.height), 16000),
        deviceScaleFactor: 1,
        mobile: Number(W) < 700,
      },
      sessionId,
    )
    await sleep(700)
  }

  const { data } = await send(
    'Page.captureScreenshot',
    { format: 'png', captureBeyondViewport: FULL === 'true' },
    sessionId,
  )
  writeFileSync(OUT, Buffer.from(data, 'base64'))
  console.log(`wrote ${OUT} (${Number(W)}px wide)`)
  sock.close()
} finally {
  edge.kill()
}