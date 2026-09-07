import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/landing/HeroSection'
import { IndustriesSection } from '@/components/landing/IndustriesSection'
import { TechnologySection } from '@/components/landing/TechnologySection'
import { ContactSection } from '@/components/landing/ContactSection'
import { ProductsSection } from '@/components/landing/ProductsSection'

export function LandingPage() {
  const contactRef = useRef<HTMLDivElement>(null)

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background animated-bg text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/halo-logo-symbol-transparent.png?v=20260908"
              alt="HALO Africa logo"
              className="brand-logo size-11 scale-125 object-contain"
            />
            <span className="text-base font-bold tracking-tight">HALO AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#industries" className="hover:text-foreground transition-colors">Industries</a>
            <a href="#products" className="hover:text-foreground transition-colors">Products</a>
            <a href="#technology" className="hover:text-foreground transition-colors">Technology</a>
            <button onClick={scrollToContact} className="hover:text-foreground transition-colors">Contact</button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <Link to="/auth">
                Get Started <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection onContactClick={scrollToContact} />
      <IndustriesSection />
      <ProductsSection />
      <TechnologySection />
      <div ref={contactRef}>
        <ContactSection />
      </div>

      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img
              src="/halo-logo-symbol-transparent.png?v=20260908"
              alt="HALO Africa logo"
              className="brand-logo size-5 object-contain"
            />
            <span>© {new Date().getFullYear()} HALO AI Technologies PLC. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="https://haloafrica.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">haloafrica.org</a>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>

      <div className="orb w-96 h-96 bg-halo-600 -top-20 -right-20 fixed pointer-events-none" />
      <div className="orb w-64 h-64 bg-violet-800 top-1/2 -left-32 fixed pointer-events-none" />
    </div>
  )
}