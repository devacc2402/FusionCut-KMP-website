import { useLayoutEffect, useRef } from 'react'
import ExperimentBanner from './components/ExperimentBanner.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import WhySpecial from './components/WhySpecial.jsx'
import Features from './components/Features.jsx'
import Engine from './components/Engine.jsx'
import Faq from './components/Faq.jsx'
import Download from './components/Download.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const headerRef = useRef(null)

  // The fixed header is the experiment banner stacked on the nav, and the
  // banner wraps to two or three lines on narrow screens. Measure it and feed
  // the height back into --header-h so main is never overlapped, whatever the
  // banner text does. ResizeObserver covers font loading and viewport changes.
  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return

    const publish = () => {
      document.documentElement.style.setProperty(
        '--header-h',
        `${el.offsetHeight}px`,
      )
    }

    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950">
      <div ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        <ExperimentBanner />
        <Nav />
      </div>
      <main className="bannerOffset">
        <Hero />
        <WhySpecial />
        <Features />
        <Engine />
        <Faq />
        <Download />
      </main>
      <Footer />
    </div>
  )
}