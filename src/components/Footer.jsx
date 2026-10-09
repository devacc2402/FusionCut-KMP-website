import { APP } from '../data.js'
import { Brand } from './ui.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-ink-700/50 px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/fusioncut-logo.jpg" alt="" className="size-7 rounded-lg" />
          <Brand className="text-[14px]" />
          <span className="font-mono text-[11px] text-fg-mute">v{APP.version}</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-fg-dim">
          <a href="#why" className="transition-colors hover:text-fg">
            Why FusionCut KMP
          </a>
          <a href="#features" className="transition-colors hover:text-fg">
            Features
          </a>
          <a href="#engine" className="transition-colors hover:text-fg">
            Engine
          </a>
          <a href="#faq" className="transition-colors hover:text-fg">
            FAQ
          </a>
          <a href="#download" className="transition-colors hover:text-fg">
            Download
          </a>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-ink-700/40 pt-6 text-center">
        <p className="font-mono text-[11px] leading-relaxed text-fg-mute">
          Built with Kotlin Multiplatform, Compose Multiplatform and a hand-written C++
          render engine.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-[12px] leading-relaxed text-pretty text-fg-mute">
          <span className="font-semibold text-neon-amber">
            FusionCut KMP was an experiment
          </span>{' '}
          and is not recommended for use. It is provided as-is, with no
          guarantees, no support and no ongoing development.
        </p>
      </div>
    </footer>
  )
}