import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface CounterProps {
  target: number
  suffix: string
  duration?: number
}

function AnimatedCounter({ target, suffix, duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setCount(Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

const stats = [
  { value: 50, suffix: '+', label: 'African Languages', description: 'Supported natively across ASR/TTS engines' },
  { value: 10, suffix: 'M+', label: 'Voice Interactions', description: 'Processed monthly across deployments' },
  { value: 99, suffix: '.2%', label: 'ASR Accuracy', description: 'Word error rate on benchmark datasets' },
  { value: 200, suffix: 'ms', label: 'Avg Response Time', description: 'End-to-end voice pipeline latency' },
  { value: 15, suffix: '+', label: 'Enterprise Clients', description: 'Across healthcare, banking & telecom' },
  { value: 99, suffix: '.9%', label: 'SLA Uptime', description: 'Guaranteed availability for enterprise tier' },
]

export function ImpactSection() {
  return (
    <section id="impact" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-halo-950/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-halo-400 mb-3 uppercase tracking-widest">Impact</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real Numbers, <span className="text-gradient">Real Impact</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Measured outcomes from production deployments across Africa's enterprise landscape.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map(({ value, suffix, label, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative rounded-2xl border border-border bg-card/60 p-6 text-center hover:border-halo-500/40 transition-all duration-300 group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-halo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-3xl md:text-4xl font-black text-gradient mb-2">
                <AnimatedCounter target={value} suffix={suffix} />
              </div>
              <p className="font-semibold text-sm mb-1">{label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
