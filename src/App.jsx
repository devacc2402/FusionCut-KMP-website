import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import WhySpecial from './components/WhySpecial.jsx'
import Features from './components/Features.jsx'
import Engine from './components/Engine.jsx'
import Faq from './components/Faq.jsx'
import Download from './components/Download.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950">
      <Nav />
      <main>
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