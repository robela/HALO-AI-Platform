import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Mic, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onContactClick: () => void
}

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
}

export function HeroSection({ onContactClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-halo-500/30 bg-halo-500/10 px-4 py-1.5 text-xs font-medium text-halo-400">
            <Sparkles className="size-3" />
            AI-Powered Voice Intelligence for Africa
            <Sparkles className="size-3" />
          </div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            Halo &mdash; <span className="text-halo-400/80">Light</span> &middot; <span className="text-halo-400/80">Guidance</span> &middot; <span className="text-halo-400/80">Trust</span> &middot; <span className="text-halo-400/80">Intelligence</span>
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
        >
          <span className="text-foreground">Voice Intelligence</span>
          <br />
          <span className="text-gradient">for Africa</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          HALO AI Technologies PLC builds enterprise-grade conversational AI, multilingual ASR/TTS,
          intelligent IVR systems, and RAG-powered knowledge platforms tailored for African markets.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button variant="gradient" size="xl" asChild>
            <Link to="/auth">
              Launch Platform <ArrowRight className="size-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" onClick={onContactClick}>
            <Play className="size-5" /> Watch Demo
          </Button>
        </motion.div>

        {/* Floating voice orb */}
        <motion.div
          variants={floatVariants}
          initial="initial"
          animate="animate"
          className="relative mx-auto w-40 h-40 md:w-56 md:h-56 mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-halo-500/30 to-violet-600/30 blur-2xl animate-pulse-slow" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-halo-500/20 to-violet-600/20 blur-xl" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-halo-500/30 bg-gradient-to-br from-halo-500/10 to-violet-600/10 backdrop-blur-sm shadow-glow-lg">
            <Mic className="size-16 md:size-20 text-halo-300" />
          </div>
          {/* Ripple rings */}
          {[0, 0.3, 0.6].map((delay, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
              transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border border-halo-500/30"
            />
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '50+', label: 'African Languages' },
            { value: '99.2%', label: 'ASR Accuracy' },
            { value: '10M+', label: 'Voice Interactions' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gradient">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
