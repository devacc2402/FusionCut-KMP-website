/**
 * Headless layout audit over the Chrome DevTools Protocol.
 * Launches Edge with a mobile-sized *viewport* (not just a window), then reports
 * documentElement.scrollWidth vs clientWidth and names any element that pokes
 * out past the viewport. Zero dependencies — uses Node's global WebSocket.
 *
 *   node scripts/audit-layout.mjs [url] [width] [height]
 */
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const URL_ = process.argv[2] ?? 'http://127.0.0.1:5173/'
const WIDTH = Number(process.argv[3] ?? 390)
const HEIGHT = Number(process.argv[4] ?? 844)
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9222 + Math.floor(Math.random() * 500)

const profile = mkdtempSync(join(tmpdir(), 'fc-audit-'))

const edge = spawn(EDGE, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${PORT}`,
  'about:blank',
], { stdio: 'ignore' })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Poll until the DevTools HTTP endpoint answers. */
async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      const json = await res.json()
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl
    } catch {
      /* not up yet */
    }
    await sleep(250)
  }
  throw new Error('Edge DevTools endpoint never came up')
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    ws.onopen = () => resolve(ws)
    ws.onerror = (e) => reject(new Error(`ws error: ${e.message ?? e}`))
  })
}

let nextId = 1
function send(ws, method, params = {}, sessionId) {
  const id = nextId++
  const msg = { id, method, params }
  if (sessionId) msg.sessionId = sessionId
  return new Promise((resolve, reject) => {
    const onMsg = (ev) => {
      const data = JSON.parse(ev.data)
      if (data.id !== id) return
      ws.removeEventListener('message', onMsg)
      if (data.error) reject(new Error(`${method}: ${data.error.message}`))
      else resolve(data.result)
    }
    ws.addEventListener('message', onMsg)
    ws.send(JSON.stringify(msg))
  })
}

try {
  const ws = await connect(await getWsUrl())

  const { targetId } = await send(ws, 'Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send(ws, 'Target.attachToTarget', { targetId, flatten: true })

  // Real mobile emulation: sets the layout viewport, not the OS window.
  await send(ws, 'Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: true,
  }, sessionId)

  await send(ws, 'Page.enable', {}, sessionId)
  await send(ws, 'Page.navigate', { url: URL_ }, sessionId)
  await sleep(2500)

  const probe = `(() => {
    const de = document.documentElement
    const vw = de.clientWidth
    const offenders = []
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      if (r.right > vw + 1 || r.left < -1) {
        // only report if this element is the outermost cause
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed') continue
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
        })
      }
    }
    // keep only the deepest few, to avoid ancestor noise
    return JSON.stringify({
      scrollWidth: de.scrollWidth,
      clientWidth: vw,
      scrollHeight: de.scrollHeight,
      horizontalOverflow: de.scrollWidth > vw,
      offenders: offenders.slice(0, 12),
    })
  })()`

  const { result } = await send(ws, 'Runtime.evaluate', {
    expression: probe,
    returnByValue: true,
  }, sessionId)

  const data = JSON.parse(result.value)

  console.log(`viewport      ${WIDTH}x${HEIGHT}`)
  console.log(`clientWidth   ${data.clientWidth}`)
  console.log(`scrollWidth   ${data.scrollWidth}`)
  console.log(`pageHeight    ${data.scrollHeight}`)
  console.log(`overflow-x    ${data.horizontalOverflow ? 'YES (bug)' : 'none'}`)
  if (data.offenders.length) {
    console.log('\nelements past the right edge:')
    for (const o of data.offenders) {
      console.log(`  <${o.tag}> [${o.left}..${o.right}]  ${o.cls}`)
    }
  }

  ws.close()
} finally {
  edge.kill()
}