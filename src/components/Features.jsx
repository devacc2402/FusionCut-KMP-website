import { useState } from 'react'
import { FEATURES, ASPECTS, FORMATS } from '../data.js'
import { ICONS } from './Icons.jsx'
import { accent, Bullet, Glow, Section, SectionHead } from './ui.jsx'

const TAB_ICONS = { Timeline: 'timeline', Layers: 'layers', Inspector: 'sliders', Export: 'download' }

export default function Features() {
  const [active, setActive] = useState(0)
  const f = FEATURES[active]
  const c = accent(f.accent)
  const Icon = ICONS[TAB_ICONS[f.tab]]

  return (
    <Section id="features" className="border-y border-ink-700/40 bg-ink-900/25">
      <Glow color="var(--color-neon-emerald)" className="-top-32 -left-40 size-[30rem]" />

      <SectionHead
        eyebrow="Inside the editor"
        title="Everything a motion piece actually needs"
        lede="Four working surfaces. No bloat, no plugin ecosystem to learn before you can finish a cut."
      />

      {/* tabs */}
      <div className="mt-14 flex flex-wrap justify-center gap-2">
        {FEATURES.map((item, i) => {
          const on = i === active
          const tc = accent(item.accent)
          return (
            <button
              key={item.tab}
              onClick={() => setActive(i)}
              aria-pressed={on}
              className={`rounded-xl border px-5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                on
                  ? 'text-fg shadow-lg'
                  : 'border-ink-700/70 bg-ink-900/50 text-fg-dim hover:border-ink-700 hover:text-fg'
              }`}
              style={
                on
                  ? {
                      borderColor: `color-mix(in oklab, ${tc} 50%, transparent)`,
                      backgroundColor: `color-mix(in oklab, ${tc} 12%, transparent)`,
                    }
                  : undefined
              }
            >
              {item.tab}
            </button>
          )
        })}
      </div>

      {/* panel */}
      <div key={f.tab} className="panel mt-8 grid gap-10 p-8 sm:p-10 lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0">
          <span
            className="flex size-12 items-center justify-center rounded-xl border"
            style={{
              color: c,
              borderColor: `color-mix(in oklab, ${c} 32%, transparent)`,
              backgroundColor: `color-mix(in oklab, ${c} 10%, transparent)`,
            }}
          >
            <Icon width={23} height={23} />
          </span>

          <h3 className="mt-6 text-2xl leading-tight font-bold text-balance sm:text-[1.75rem]">
            {f.headline}
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-pretty text-fg-dim">{f.body}</p>
        </div>

        <ul className="grid min-w-0 content-start gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
          {f.bullets.map((b) => (
            <Bullet key={b} color={c}>
              {b}
            </Bullet>
          ))}
        </ul>
      </div>

      {/* aspect ratios */}
      <div className="mt-20">
        <h3 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Six canvases, so you never letterbox by hand
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-center text-[15px] text-pretty text-fg-dim">
          Pick the aspect when you create the project. The preview, the timeline and the
          export all follow it.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {ASPECTS.map((a) => (
            <div key={a.ratio} className="panel panel-hover px-4 py-5 text-center">
              {/* mini frame preview at the right ratio */}
              <div className="mx-auto flex h-11 items-center justify-center">
                <div
                  className="rounded border border-neon-cyan/45 bg-neon-cyan/8"
                  style={{
                    aspectRatio: a.ratio.replace(':', ' / '),
                    width:
                      a.ratio === '1:1'
                        ? '38px'
                        : a.ratio === '4:5'
                          ? '32px'
                          : a.ratio === '4:3'
                            ? '46px'
                            : a.ratio === '21:9'
                              ? '54px'
                              : '48px',
                    maxHeight: '40px',
                  }}
                />
              </div>
              <div className="mt-3.5 text-[15px] font-semibold">{a.ratio}</div>
              <div className="mt-0.5 font-mono text-[10px] text-fg-mute">{a.res}</div>
              <div className="mt-1.5 text-[11px] text-fg-dim">{a.use}</div>
            </div>
          ))}
        </div>
      </div>

      {/* formats */}
      <div className="mt-20">
        <h3 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Bring what you already have
        </h3>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {FORMATS.map((fm) => {
            const fc = accent(fm.accent)
            return (
              <div key={fm.kind} className="panel panel-hover p-7">
                <div className="flex items-center gap-3">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: fc, boxShadow: `0 0 14px ${fc}` }}
                  />
                  <h4 className="text-[16px] font-semibold">{fm.kind}</h4>
                </div>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {fm.exts.map((e) => (
                    <span
                      key={e}
                      className="rounded-md border border-ink-700/70 bg-ink-950/60 px-2 py-1 font-mono text-[11px] text-fg-dim"
                    >
                      .{e}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-[13px] text-fg-mute">{fm.note}</p>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}