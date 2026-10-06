import { ENGINE, STACK } from '../data.js'
import { Glow, Section, SectionHead } from './ui.jsx'

/* Layer-stack diagram: Kotlin → JNI → C++ → OS codecs. */
function StackDiagram() {
  const rows = [
    { label: 'Compose Multiplatform UI', sub: 'one Kotlin codebase', c: 'var(--color-neon-cyan)' },
    { label: 'JVM / Android bridge', sub: 'JNI + Room + SQLite', c: 'var(--color-neon-emerald)' },
    { label: 'Fusion Engine · C++', sub: 'AVX2 · multithreaded compositor', c: 'var(--color-neon-magenta)' },
    { label: 'OS hardware codecs', sub: 'Media Foundation · MediaCodec', c: 'var(--color-neon-amber)' },
  ]

  return (
    <div className="panel p-6">
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: `color-mix(in oklab, ${r.c} 28%, transparent)`,
                backgroundColor: `color-mix(in oklab, ${r.c} 8%, transparent)`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: r.c, boxShadow: `0 0 10px ${r.c}` }}
                />
                <span className="text-[14px] font-semibold">{r.label}</span>
              </div>
              <div className="mt-1 pl-3.5 font-mono text-[11px] text-fg-mute">{r.sub}</div>
            </div>
            {i < rows.length - 1 && (
              <div className="flex justify-center py-0.5">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
                  <path
                    d="M7 0v11m0 0-3.5-3.5M7 11l3.5-3.5"
                    stroke="var(--color-ink-700)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-ink-700/60 pt-5 text-center font-mono text-[11px] text-fg-mute">
        no FFmpeg · no subprocess · no download
      </p>
    </div>
  )
}

export default function Engine() {
  return (
    <Section id="engine">
      <Glow color="var(--color-neon-violet)" className="-top-24 right-1/4 size-[28rem]" />

      <SectionHead
        eyebrow="Under the hood"
        title="A compositor written from scratch, talking straight to the hardware"
        lede="FusionCut's preview and its exported video are produced by the same native code path — so what you scrub is what you render."
      />

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <StackDiagram />
        </div>

        <div className="min-w-0">
          <div className="grid gap-5 sm:grid-cols-2">
            {ENGINE.map((e, i) => (
              <div key={e.title} className="panel panel-hover p-6">
                <span className="font-mono text-[11px] text-neon-cyan">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2.5 text-[15.5px] font-semibold">{e.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-fg-dim">{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* spec table */}
      <div className="panel mt-16 overflow-hidden">
        <div className="border-b border-ink-700/60 px-7 py-4">
          <h3 className="text-[15px] font-semibold tracking-tight">Under the hood · full spec</h3>
        </div>
        <dl className="grid sm:grid-cols-2">
          {STACK.map((s, i) => (
            <div
              key={s.k}
              className={`flex items-center justify-between gap-4 border-ink-700/40 px-7 py-3.5 ${
                i < STACK.length - 1 ? 'border-b' : ''
              } ${i % 2 === 0 ? 'sm:border-r' : ''}`}
              style={{ borderColor: 'color-mix(in oklab, var(--color-ink-700) 55%, transparent)' }}
            >
              <dt className="text-[13.5px] text-fg-mute">{s.k}</dt>
              <dd className="text-right font-mono text-[12.5px] text-fg">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}