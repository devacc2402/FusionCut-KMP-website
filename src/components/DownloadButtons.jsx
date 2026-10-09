import { DOWNLOADS } from '../data.js'
import { Android, Windows } from './Icons.jsx'

/**
 * Smallest believable size for either installer. The APK alone is 16.6 MB, so
 * anything under this is certainly not one of our files — it is an error page
 * being dressed up as an installer.
 */
const MIN_PLAUSIBLE_BYTES = 1_000_000

/** True when the href points at another origin. */
function isExternal(href) {
  if (typeof window === 'undefined') return false
  try {
    return new URL(href, window.location.href).origin !== window.location.origin
  } catch {
    return false
  }
}

/**
 * A single download CTA.
 *
 * The installers live on GitHub Releases, not in `public/downloads/`, because
 * the MSI is 107 MB and git rejects any blob over 100 MB. That makes the href
 * cross-origin, which matters in two ways:
 *
 *  - The `download` attribute is IGNORED cross-origin, so it is applied only
 *    for same-origin hrefs. GitHub answers release assets with
 *    `Content-Disposition: attachment` and the right filename, so the browser
 *    still saves them properly either way.
 *  - Without the attribute, a missing or erroring file would render in the tab
 *    and look like a broken website. So the click is intercepted, the asset is
 *    probed with HEAD, and navigation only happens once we know a real
 *    installer is behind the link. That is the fix for the "the download is
 *    corrupted" symptom: previously the host's HTML response was saved under
 *    the name `FusionCut-1.1.0.msi`, which Windows refuses to open.
 *
 * Modified clicks (new tab, middle click, ctrl/cmd/shift) are left alone so
 * the normal browser affordances still work.
 */
function DownloadButton({ target, variant = 'primary', className = '' }) {
  const isWindows = target === 'windows'
  const d = DOWNLOADS[target]
  const Glyph = isWindows ? Windows : Android
  const external = isExternal(d.file)

  const skins = {
    primary: {
      bg: 'from-neon-cyan/22 to-neon-emerald/16',
      border: 'border-neon-cyan/45',
      text: 'text-fg',
      ring: 'group-hover:shadow-[0_0_44px_-8px_rgba(0,240,255,0.55)]',
      chip: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/35',
    },
    android: {
      bg: 'from-neon-emerald/20 to-neon-cyan/12',
      border: 'border-neon-emerald/45',
      text: 'text-fg',
      ring: 'group-hover:shadow-[0_0_44px_-8px_rgba(0,229,153,0.5)]',
      chip: 'bg-neon-emerald/15 text-neon-emerald border-neon-emerald/35',
    },
  }
  const skin = skins[variant]

  const startDownload = () => {
    const a = document.createElement('a')
    a.href = d.file
    if (!external) a.download = d.filename
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleClick = async (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

    e.preventDefault()

    const button = e.currentTarget
    button.dataset.state = 'checking'
    button.setAttribute('aria-busy', 'true')

    const reset = (ms) =>
      setTimeout(() => {
        if (!button.isConnected) return
        delete button.dataset.state
        button.removeAttribute('aria-busy')
        button.removeAttribute('aria-label')
      }, ms)

    try {
      // HEAD is cheap: it confirms reachability and size without pulling
      // 107 MB just to discover the link is broken. GitHub redirects release
      // assets to objects.githubusercontent.com, so follow the redirect and
      // inspect the final response.
      const res = await fetch(d.file, { method: 'HEAD', redirect: 'follow' })

      if (!res.ok) throw new Error(`server replied HTTP ${res.status}`)

      const raw = res.headers.get('content-length')
      const len = raw == null ? null : Number(raw)

      if (len != null && len < MIN_PLAUSIBLE_BYTES) {
        throw new Error(
          `the server sent ${len} bytes instead of an installer`,
        )
      }

      button.dataset.state = 'ok'
      startDownload()
      reset(1200)
    } catch (err) {
      button.dataset.state = 'error'
      button.setAttribute(
        'aria-label',
        `${d.label} could not be started: ${err.message}`,
      )
      reset(6000)
    }
  }

  return (
    <a
      href={d.file}
      onClick={handleClick}
      data-dl={target}
      data-state="idle"
      aria-label={`${d.label} — ${d.size}, ${d.platform}`}
      className={`group relative flex items-center gap-4 rounded-2xl border ${skin.border} bg-gradient-to-br ${skin.bg} p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-neon-cyan/70 ${skin.ring} focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:outline-none data-[state=checking]:pointer-events-none data-[state=checking]:opacity-70 data-[state=error]:border-neon-amber/70 ${className}`}
    >
      {/* sheen sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
      >
        <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/8 opacity-0 transition-opacity duration-300 group-hover:animate-sweep group-hover:opacity-100" />
      </span>

      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${skin.chip}`}
      >
        <Glyph />
      </span>

      <span className="min-w-0 flex-1 text-left">
        <span className={`block text-[15px] leading-tight font-semibold ${skin.text}`}>
          {d.label}
        </span>
        <span className="mt-1 block truncate font-mono text-[11px] text-fg-mute">
          {/* swapped by the .dl-label rules in index.css, no JS re-render */}
          <span data-dl-label="idle">{`${d.size} · ${d.platform}`}</span>
          <span data-dl-label="checking" className="text-neon-cyan">
            Checking file…
          </span>
          <span data-dl-label="error" className="text-neon-amber">
            Download failed — click to retry
          </span>
        </span>
      </span>
    </a>
  )
}

/** The paired Windows + Android CTA used in the hero and the download section. */
export default function DownloadButtons({ layout = 'grid', className = '' }) {
  if (layout === 'stack') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <DownloadButton target="windows" />
        <DownloadButton target="android" variant="android" />
      </div>
    )
  }

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      <DownloadButton target="windows" />
      <DownloadButton target="android" variant="android" />
    </div>
  )
}

export { DownloadButton }