import { WHY } from '../data.js'
import { ICONS } from './Icons.jsx'
import { accent, Glow, Pill, Section, SectionHead } from './ui.jsx'

export default function WhySpecial() {
  return (
    <Section id="why">
      <Glow color="var(--color-neon-magenta)" className="top-1/3 -right-40 size-[30rem]" />

      <SectionHead
        eyebrow="What makes it different"
        title="Most editors are a wrapper around someone else's engine. This one isn't."
        lede="FusionCut is built from the compositor up — which is why it starts instantly, stays local, and behaves the same on a laptop and a phone."
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY.map((w) => {
          const c = accent(w.accent)
          const Icon = ICONS[w.icon]
          return (
            <article key={w.title} className="panel panel-hover group relative overflow-hidden p-7">
              {/* corner glow on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ backgroundColor: `color-mix(in oklab, ${c} 30%, transparent)` }}
              />

              <span
                className="relative flex size-11 items-center justify-center rounded-xl border"
                style={{
                  color: c,
                  borderColor: `color-mix(in oklab, ${c} 32%, transparent)`,
                  backgroundColor: `color-mix(in oklab, ${c} 10%, transparent)`,
                }}
              >
                <Icon width={21} height={21} />
              </span>

              <h3 className="relative mt-5 text-[17px] leading-snug font-semibold text-balance">
                {w.title}
              </h3>
              <p className="relative mt-3 text-[14.5px] leading-relaxed text-pretty text-fg-dim">
                {w.body}
              </p>

              <div className="relative mt-5">
                <Pill color={c}>{w.tag}</Pill>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}