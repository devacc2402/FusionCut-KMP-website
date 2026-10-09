import { Check } from './Icons.jsx'

/* Accent name -> concrete neon colour. Mirrors the app's per-layer palette. */
export const ACCENTS = {
  cyan: 'var(--color-neon-cyan)',
  emerald: 'var(--color-neon-emerald)',
  magenta: 'var(--color-neon-magenta)',
  amber: 'var(--color-neon-amber)',
  violet: 'var(--color-neon-violet)',
  blue: 'var(--color-neon-blue)',
}

export const accent = (name) => ACCENTS[name] ?? ACCENTS.cyan

/**
 * The wordmark: "FusionCut" plus the "KMP" suffix, with "Cut" in neon cyan.
 * Lives here so the nav and the footer can never drift apart.
 */
export function Brand({ className = '' }) {
  return (
    <span className={`font-semibold tracking-tight ${className}`}>
      Fusion<span className="text-neon-cyan">Cut</span>
      <span className="ml-1 font-mono text-[0.78em] font-medium text-fg-mute">
        KMP
      </span>
    </span>
  )
}

/** Small pill used for versions, tech tags and metadata. */
export function Pill({ children, color, className = '' }) {
  const c = color ?? 'var(--color-fg-dim)'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide whitespace-nowrap ${className}`}
      style={{
        color: c,
        borderColor: `color-mix(in oklab, ${c} 32%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${c} 9%, transparent)`,
      }}
    >
      {children}
    </span>
  )
}

/** Section heading block with an optional eyebrow and lede. */
export function SectionHead({ eyebrow, title, lede, center = true }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <div
          className={`mb-4 flex items-center gap-3 ${center ? 'justify-center' : ''}`}
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-neon-cyan/60" />
          <Pill color="var(--color-neon-cyan)">{eyebrow}</Pill>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-neon-cyan/60" />
        </div>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {lede && (
        <p className="mt-5 text-base leading-relaxed text-pretty text-fg-dim sm:text-lg">
          {lede}
        </p>
      )}
    </div>
  )
}

/** Section wrapper providing consistent vertical rhythm. */
export function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative px-5 py-20 sm:px-8 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

/** Checkmark bullet. */
export function Bullet({ children, color = 'var(--color-neon-cyan)' }) {
  return (
    <li className="flex gap-3">
      <span
        className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)`,
          color,
        }}
      >
        <Check width={11} height={11} strokeWidth={3} />
      </span>
      <span className="text-[15px] leading-relaxed text-fg-dim">{children}</span>
    </li>
  )
}

/** Ambient coloured blob used to give sections depth. */
export function Glow({ color, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-[110px] ${className}`}
      style={{ backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)` }}
    />
  )
}