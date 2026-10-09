import { useEffect, useState } from 'react'
import { APP } from '../data.js'
import { Brand } from './ui.jsx'

const LINKS = [
  { href: '#why', label: 'Why FusionCut KMP' },
  { href: '#features', label: 'Features' },
  { href: '#engine', label: 'Engine' },
  { href: '#faq', label: 'FAQ' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    // The sticky wrapper (banner + nav) lives in App.jsx, so this header only
    // owns its own background/border state.
    <header
      className={`transition-all duration-300 ${
        solid
          ? 'border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <img
            src="/fusioncut-logo.jpg"
            alt=""
            className="size-8 rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
          <Brand className="text-[15px]" />
          <span className="hidden rounded border border-ink-700 bg-ink-900 px-1.5 py-0.5 font-mono text-[10px] text-fg-mute sm:inline">
            v{APP.version}
          </span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[13.5px] text-fg-dim transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#download"
          className="rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-[13px] font-semibold text-neon-cyan transition-all hover:border-neon-cyan/70 hover:bg-neon-cyan/18"
        >
          Download
        </a>
      </nav>
    </header>
  )
}