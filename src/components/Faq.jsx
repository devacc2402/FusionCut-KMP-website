import { useState } from 'react'
import { FAQ } from '../data.js'
import { Glow, Section, SectionHead } from './ui.jsx'

function Item({ item, open, onToggle }) {
  return (
    <div
      className={`panel overflow-hidden transition-colors ${open ? 'border-neon-cyan/35' : ''}`}
    >
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
        >
          <span className="text-[15px] font-medium text-balance">{item.q}</span>
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-lg border border-ink-700 transition-transform duration-300 ${
              open ? 'rotate-45' : ''
            }`}
            style={open ? { color: 'var(--color-neon-cyan)' } : undefined}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </h3>
      {open && (
        <div className="px-6 pb-6">
          <p className="border-t border-ink-700/50 pt-4 text-[14.5px] leading-relaxed text-pretty text-fg-dim">
            {item.a}
          </p>
        </div>
      )}
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <Section id="faq" className="border-t border-ink-700/40">
      <Glow color="var(--color-neon-cyan)" className="top-1/4 -left-32 size-[26rem]" />

      <SectionHead eyebrow="Questions" title="The things people ask first" />

      <div className="mx-auto mt-14 grid max-w-3xl gap-3">
        {FAQ.map((item, i) => (
          <Item
            key={item.q}
            item={item}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </Section>
  )
}