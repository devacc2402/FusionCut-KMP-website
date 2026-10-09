import { EXPERIMENT_WARNING } from '../data.js'

/**
 * Site-wide experiment warning.
 *
 * Rendered above the nav on every page view, always visible, never
 * dismissible. It is not `fixed` itself — it sits inside the fixed header
 * wrapper in App.jsx, so the nav automatically stacks below it no matter
 * how tall the banner text wraps on a narrow screen. Page content is pushed
 * clear of that wrapper by the `bannerOffset` utility on <main>.
 *
 * No animation and no dismiss button on purpose: this is the one thing on
 * the page that must never be missed or blinked out of the way.
 */
export default function ExperimentBanner() {
  return (
    <div
      role="alert"
      className="border-b border-neon-amber/40 bg-neon-amber/12"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-5 py-2.5 sm:items-center sm:px-8">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold sm:mt-0"
          style={{
            backgroundColor: 'color-mix(in oklab, var(--color-neon-amber) 22%, transparent)',
            color: 'var(--color-neon-amber)',
          }}
        >
          !
        </span>

        <p className="min-w-0 flex-1 text-[12.5px] leading-snug text-pretty sm:text-[13px]">
          <span className="font-semibold text-neon-amber">
            Experimental project.
          </span>{' '}
          <span className="text-fg-dim">{EXPERIMENT_WARNING.banner}</span>
        </p>

        <a
          href="#why"
          className="hidden shrink-0 font-mono text-[11px] whitespace-nowrap text-neon-amber/80 underline-offset-4 transition-colors hover:text-neon-amber hover:underline md:block"
        >
          Read why
        </a>
      </div>
    </div>
  )
}