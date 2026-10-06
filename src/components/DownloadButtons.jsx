import { DOWNLOADS } from '../data.js'
import { Android, Windows } from './Icons.jsx'

/**
 * A single download CTA.
 *
 * `download` + the explicit filename makes the browser save the file under a
 * predictable name instead of navigating to it. Both files are served from
 * /public/downloads, so they are same-origin and the attribute is honoured.
 */
function DownloadButton({ target, variant = 'primary', className = '' }) {
  const isWindows = target === 'windows'
  const d = DOWNLOADS[target]
  const Glyph = isWindows ? Windows : Android

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

  return (
    <a
      href={d.file}
      download={d.filename}
      className={`group relative flex items-center gap-4 rounded-2xl border ${skin.border} bg-gradient-to-br ${skin.bg} p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-neon-cyan/70 ${skin.ring} focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:outline-none ${className}`}
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
          {d.size} · {d.platform}
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