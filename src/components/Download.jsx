import {
  APP,
  DOWNLOADS,
  EXPERIMENT_WARNING,
  RELEASES_PAGE,
  STATUS_NOTES,
} from '../data.js'
import DownloadButtons from './DownloadButtons.jsx'
import { Glow, Pill, Section } from './ui.jsx'

/**
 * One of the "before you install" disclosures. `danger` is reserved for the
 * experiment warning, which has to read louder than the SmartScreen and
 * platform notes sitting next to it.
 */
function Note({ n }) {
  const colors = {
    // The experiment warning reuses amber but pushes it harder: thicker
    // border, stronger fill. It has to outrank the notes beside it.
    danger: 'var(--color-neon-amber)',
    warn: 'var(--color-neon-amber)',
    info: 'var(--color-neon-cyan)',
  }
  const c = colors[n.tone] ?? colors.info
  const danger = n.tone === 'danger'
  const glyph = n.tone === 'info' ? 'i' : '!'

  return (
    <div
      className={`rounded-xl border p-5 ${danger ? 'sm:p-6' : ''}`}
      style={{
        borderColor: `color-mix(in oklab, ${c} ${danger ? 38 : 26}%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${c} ${danger ? 9 : 6}%, transparent)`,
      }}
    >
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
          style={{
            backgroundColor: `color-mix(in oklab, ${c} 18%, transparent)`,
            color: c,
          }}
        >
          {glyph}
        </span>
        <div className="min-w-0">
          <h4
            className={`text-balance font-semibold ${danger ? 'text-[16px] sm:text-[17px]' : 'text-[14px]'}`}
          >
            {n.title}
          </h4>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-pretty text-fg-dim">
            {n.body}
          </p>

          {danger && (
            <ul className="mt-4 space-y-1.5">
              {EXPERIMENT_WARNING.points.map((p) => (
                <li
                  key={p}
                  className="flex gap-2.5 text-[13px] leading-relaxed text-fg-dim"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] size-1 shrink-0 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
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
        <Pill color="var(--color-neon-amber)">v{APP.version} · experimental</Pill>

        <h2 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Cut something today
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-fg-dim">
          If you still want to try it, here are both builds. Same code on both
          platforms, and it installs in under a minute.
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

        {/*
          The installers are release assets, so anyone can verify a download
          landed intact. The checksums below are the ones I computed from the
          exact files in this repo.
        */}
        <details className="mx-auto mt-5 max-w-2xl text-left">
          <summary className="cursor-pointer text-center font-mono text-[11px] text-fg-mute transition-colors hover:text-fg-dim">
            Verify your download (SHA-256)
          </summary>
          <dl className="mt-4 grid gap-2 rounded-xl border border-ink-700/60 bg-ink-950/40 p-4 font-mono text-[11px]">
            {[DOWNLOADS.windows, DOWNLOADS.android].map((d) => (
              <div key={d.filename} className="grid gap-1 sm:grid-cols-[auto_1fr] sm:gap-3">
                <dt className="text-fg-mute">{d.filename}</dt>
                <dd className="break-all text-fg-dim">
                  <code>{d.sha256}</code>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-center font-mono text-[11px] text-fg-mute">
            Run{' '}
            <code className="text-fg-dim">
              certutil -hashfile FusionCut-KMP-1.1.0.msi SHA256
            </code>{' '}
            after downloading. A mismatch means a truncated or substituted file.
          </p>
        </details>

        {/* honest status disclosures */}
        <div className="mx-auto mt-14 grid max-w-3xl gap-3 text-left">
          <p className="text-center font-mono text-[11px] tracking-wide text-fg-mute uppercase">
            Before you install
          </p>
          {STATUS_NOTES.map((n) => (
            <Note key={n.title} n={n} />
          ))}
        </div>

        <p className="mt-10 font-mono text-[11px] text-fg-mute">
          All releases and older versions:{' '}
          <a
            href={RELEASES_PAGE}
            rel="noopener"
            className="text-neon-cyan/80 underline-offset-4 transition-colors hover:text-neon-cyan hover:underline"
          >
            GitHub releases
          </a>
        </p>
      </div>
    </Section>
  )
}