import { APP, STATS } from '../data.js'
import DownloadButtons from './DownloadButtons.jsx'
import { Glow, Pill } from './ui.jsx'

/* --- decorative layers that mirror the real app editor ------------- */

const TRACKS = [
  { label: 'TEXT', accent: 'var(--color-neon-amber)', left: '38%', width: '26%' },
  { label: 'VIDEO', accent: 'var(--color-neon-magenta)', left: '4%', width: '52%' },
  { label: 'SHAPE', accent: 'var(--color-neon-cyan)', left: '18%', width: '22%' },
  { label: 'AUDIO', accent: 'var(--color-neon-cyan)', left: '4%', width: '78%' },
]

/** Miniature reconstruction of the FusionCut timeline: fixed centre playhead. */
function TimelineMock() {
  return (
    <div className="panel overflow-hidden">
      {/* preview strip */}
      <div className="flex items-center gap-3 border-b border-ink-700/60 bg-ink-950/40 px-3 py-2.5">
        <div className="relative flex aspect-video w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-neon-cyan/25 via-ink-850 to-neon-emerald/20">
          <span className="font-mono text-[8px] tracking-widest text-neon-cyan/80">
            PREVIEW
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan to-neon-emerald text-ink-950">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4.5v15l13-7.5-13-7.5Z" />
            </svg>
          </span>
          <span className="font-mono text-[10px] text-fg-mute">00:04.12 / 00:12.00</span>
        </div>
        <span className="ml-auto hidden h-1 w-24 overflow-hidden rounded-full bg-ink-800 sm:block">
          <span className="block h-full w-2/3 bg-gradient-to-r from-neon-emerald to-neon-cyan" />
        </span>
      </div>

      {/* tracks */}
      <div className="relative grid-lines px-3 py-3">
        <div className="space-y-1.5">
          {TRACKS.map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              <span
                className="w-11 shrink-0 text-right font-mono text-[8px] tracking-wider"
                style={{ color: t.accent }}
              >
                {t.label}
              </span>
              <div className="relative h-4 flex-1 overflow-hidden rounded bg-track/80">
                <span
                  className="absolute inset-y-0 rounded-[3px] opacity-85"
                  style={{
                    left: t.left,
                    width: t.width,
                    background: `linear-gradient(90deg, color-mix(in oklab, ${t.accent} 45%, transparent), color-mix(in oklab, ${t.accent} 16%, transparent))`,
                    borderLeft: `2px solid ${t.accent}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* centre playhead */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-px"
          style={{
            background:
              'linear-gradient(to bottom, transparent, var(--color-playhead) 18%, var(--color-playhead) 82%, transparent)',
          }}
        />
        <span
          aria-hidden="true"
          className="absolute top-1 size-2 -translate-x-1/2 rotate-45"
          style={{ left: '50%', background: 'var(--color-playhead)' }}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-20">
      {/* ambient background */}
      <Glow color="var(--color-neon-cyan)" className="-top-40 -left-32 size-[34rem] animate-drift" />
      <Glow color="var(--color-neon-emerald)" className="-right-24 top-24 size-[28rem] animate-drift [animation-delay:-8s]" />
      <Glow color="var(--color-neon-magenta)" className="top-[38rem] left-1/3 size-[26rem] animate-drift [animation-delay:-14s]" />
      <div
        aria-hidden="true"
        className="grid-lines absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* copy */}
        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Pill color="var(--color-neon-emerald)">v{APP.version} · now available</Pill>
            <Pill>Windows + Android</Pill>
          </div>

          <h1 className="text-[2.6rem] font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-[4.1rem]">
            Motion graphics,
            <br />
            <span className="bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-cyan bg-clip-text text-transparent">
              rendered natively.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-pretty text-fg-dim">
            {APP.blurb}
          </p>

          <div className="mt-10 max-w-2xl">
            <DownloadButtons />
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-fg-mute">
            <span>Free &amp; local-first</span>
            <span className="text-ink-700">|</span>
            <span>No account needed</span>
            <span className="text-ink-700">|</span>
            <span>Nothing to install first</span>
          </p>
        </div>

        {/* visual */}
        <div className="relative min-w-0">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-neon-cyan/12 via-transparent to-neon-emerald/12 blur-2xl"
          />
          <div className="relative">
            <div className="panel p-3 shadow-[0_40px_90px_-40px_rgba(0,240,255,0.35)]">
              <TimelineMock />
            </div>

            {/* floating spec chips */}
            <div className="panel absolute -top-5 -right-3 hidden items-center gap-2 px-3 py-2 sm:flex">
              <span className="size-1.5 animate-pulse-glow rounded-full bg-neon-emerald" />
              <span className="font-mono text-[10px] text-fg-dim">60 FPS · 2560×1080</span>
            </div>
            <div className="panel absolute -bottom-5 -left-3 hidden items-center gap-2 px-3 py-2 sm:flex">
              <span className="size-1.5 animate-pulse-glow rounded-full bg-neon-cyan" />
              <span className="font-mono text-[10px] text-fg-dim">AVX2 · Media Foundation</span>
            </div>
          </div>
        </div>
      </div>

      {/* stat strip */}
      <div className="relative mx-auto mt-20 max-w-6xl">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-700/40 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink-950/85 px-5 py-6 text-center">
              <div className="bg-gradient-to-b from-fg to-fg-dim bg-clip-text text-4xl font-bold text-transparent">
                {s.value}
              </div>
              <div className="mt-1.5 text-[13px] font-medium text-fg">{s.label}</div>
              <div className="mt-1 font-mono text-[10px] leading-relaxed text-fg-mute">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}