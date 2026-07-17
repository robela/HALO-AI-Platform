import { motion } from 'framer-motion'
import { Mic, Brain, Database, Phone, Zap, Globe } from 'lucide-react'

const technologies = [
  {
    icon: Mic,
    title: 'ASR / STT Engine',
    description: 'State-of-the-art Automatic Speech Recognition fine-tuned on 50+ African languages with dialect awareness.',
    specs: ['< 200ms latency', '99.2% WER accuracy', 'Streaming support'],
    color: 'text-halo-400',
    bg: 'bg-halo-500/10 border-halo-500/20',
  },
  {
    icon: Globe,
    title: 'TTS Synthesis',
    description: 'Neural Text-to-Speech with natural, expressive African voice personas across multiple languages.',
    specs: ['50+ voice personas', 'SSML support', 'Emotion control'],
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon: Brain,
    title: 'LLM Integration',
    description: 'Seamless integration with leading foundation models including GPT-4, Claude, and custom fine-tuned models.',
    specs: ['Multi-model routing', 'Context management', 'RAG-augmented'],
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    icon: Database,
    title: 'RAG Knowledge',
    description: 'Retrieval-Augmented Generation pipeline for enterprise document intelligence with citation tracking.',
    specs: ['PDF/DOCX ingestion', 'Semantic search', 'Citation tracing'],
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: Phone,
    title: 'IVR Platform',
    description: 'Cloud-native Interactive Voice Response system with conversational AI and legacy PSTN integration.',
    specs: ['SIP/PSTN bridge', 'Call analytics', 'Visual IVR editor'],
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    icon: Zap,
    title: 'Real-time APIs',
    description: 'Enterprise-grade REST and WebSocket APIs with streaming, webhooks, and 99.9% SLA uptime guarantee.',
    specs: ['REST + WebSocket', '<50ms p99', 'Auto-scaling'],
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
]

export function TechnologySection() {
  return (
    <section id="technology" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-halo-950/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-halo-400 mb-3 uppercase tracking-widest">Technology</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Full AI Stack, <span className="text-gradient">Fully Integrated</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A unified platform combining every component you need to build and deploy
            voice-first AI applications at enterprise scale.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {technologies.map(({ icon: Icon, title, description, specs, color, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl border ${bg} p-6 transition-all duration-300`}
            >
              <div className={`mb-4 ${color}`}>
                <Icon className="size-7" />
              </div>
              <h3 className="text-base font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
              <div className="flex flex-wrap gap-2">
                {specs.map((spec) => (
                  <span key={spec} className={`text-xs rounded-full px-2.5 py-1 border ${bg} ${color}`}>
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
