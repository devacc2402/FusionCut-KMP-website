import { APP, DOWNLOADS, STATUS_NOTES } from '../data.js'
import DownloadButtons from './DownloadButtons.jsx'
import { Glow, Pill, Section } from './ui.jsx'

function Note({ n }) {
  const warn = n.tone === 'warn'
  const c = warn ? 'var(--color-neon-amber)' : 'var(--color-neon-cyan)'
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        borderColor: `color-mix(in oklab, ${c} 26%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${c} 6%, transparent)`,
      }}
    >
      <div className="flex gap-3">
        <span
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
          style={{
            backgroundColor: `color-mix(in oklab, ${c} 18%, transparent)`,
            color: c,
          }}
        >
          !
        </span>
        <div>
          <h4 className="text-[14px] font-semibold">{n.title}</h4>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-pretty text-fg-dim">{n.body}</p>
        </div>
      </div>
    </div>
  )
}

export default function Download() {
  return (
    <Section id="download" className="border-t border-ink-700/40 bg-ink-900/25">
      <Glow color="var(--color-neon-cyan)" className="-top-40 left-1/4 size-[32rem] animate-drift" />
      <Glow color="var(--color-neon-emerald)" className="-bottom-32 right-1/4 size-[26rem] animate-drift [animation-delay:-9s]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Pill color="var(--color-neon-cyan)">v{APP.version}</Pill>

        <h2 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Cut something today
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-fg-dim">
          Free, local-first, and the same build on both platforms. Pick yours and start
          editing in under a minute.
        </p>

        <div className="mx-auto mt-11 max-w-2xl text-left">
          <DownloadButtons />
        </div>

        <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] text-fg-mute">
          <li>{DOWNLOADS.windows.filename}</li>
          <li className="text-ink-700">·</li>
          <li>{DOWNLOADS.windows.size}</li>
          <li className="text-ink-700">·</li>
          <li>{DOWNLOADS.android.filename}</li>
          <li className="text-ink-700">·</li>
          <li>{DOWNLOADS.android.size}</li>
        </ul>

        {/* honest status disclosures */}
        <div className="mx-auto mt-14 grid max-w-3xl gap-3 text-left">
          <p className="text-center font-mono text-[11px] tracking-wide text-fg-mute uppercase">
            Before you install
          </p>
          {STATUS_NOTES.map((n) => (
            <Note key={n.title} n={n} />
          ))}
        </div>
      </div>
    </Section>
  )
}