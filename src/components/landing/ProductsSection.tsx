import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, HandMetal, Mic, Captions, Smartphone, Globe, Accessibility, Building2, Bot, ShieldCheck, Workflow } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EAIOS_APP_URL = 'https://app.haloafrica.ai'

const features = [
  {
    icon: Mic,
    title: 'Real-Time Speech-to-Text',
    description: 'Converts spoken language into text instantly using OpenAI Whisper.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Captions,
    title: 'Live Captioning',
    description: 'Displays captions in real time — ideal for clinics, classrooms, and meetings.',
    color: 'from-halo-500 to-cyan-600',
  },
  {
    icon: HandMetal,
    title: 'Text-to-Sign Language',
    description: 'Converts text into sign-language animations for Deaf users.',
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Responsive PWA — works on Android, iOS, and any modern browser.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Supports English, Amharic, and additional languages on demand.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Accessibility,
    title: 'Accessibility UX',
    description: 'High-contrast, large-text, touch-friendly controls for all users.',
    color: 'from-fuchsia-500 to-pink-600',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export function ProductsSection() {
  return (
    <section id="products" className="py-24 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-halo-400 mb-3 uppercase tracking-widest">Products</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Building for <span className="text-gradient">Inclusive Africa</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Beyond voice intelligence — HALO AI is expanding into accessibility technology
            to ensure no one is left behind.
          </p>
        </motion.div>

        {/* SignBridge AI product card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-600/5 p-8 md:p-12 mb-10 overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-halo-600/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row gap-10 items-start">
            {/* Left — copy */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400 mb-4">
                <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
                IBM AI Builders Challenge · 2026
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                  <HandMetal className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">SignBridge AI</h3>
                  <p className="text-sm text-muted-foreground">Breaking Communication Barriers</p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
                A mobile-first accessibility platform for Deaf and Hard-of-Hearing individuals.
                SignBridge converts spoken language into real-time text captions and sign-language
                representations — enabling inclusive communication in healthcare, education,
                workplaces, and public services.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {['Speech Recognition', 'Sign Language', 'Live Captions', 'Multilingual', 'PWA', 'Offline-ready'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button variant="gradient" size="lg" asChild>
                <Link to="/signbridge">
                  Explore SignBridge AI <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Right — feature grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[380px]"
            >
              {features.map(({ icon: Icon, title, description, color }) => (
                <motion.div
                  key={title}
                  variants={cardVariants}
                  className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4"
                >
                  <div className={`mb-3 inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ${color}`}>
                    <Icon className="size-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl border border-halo-500/20 bg-gradient-to-br from-halo-500/5 to-cyan-600/5 p-8 md:p-12 mb-10 overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-halo-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-halo-500/30 bg-halo-500/10 px-3 py-1 text-xs font-medium text-halo-400 mb-4">
                <span className="size-1.5 rounded-full bg-halo-400 animate-pulse" />
                Enterprise AI Operating System
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-halo-500 to-cyan-600 shadow-lg">
                  <Building2 className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">EAIOS</h3>
                  <p className="text-sm text-muted-foreground">Enterprise AI Operating System</p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
                A multi-tenant enterprise platform for orchestrating AI agents, document intelligence,
                knowledge workflows, and governance-ready automation across organizations.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {['AI Agents', 'RAG Workflows', 'Document Intelligence', 'Multi-Tenant', 'Audit Trails', 'Admin Console'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="gradient" size="lg" asChild>
                  <a href={EAIOS_APP_URL} target="_blank" rel="noopener noreferrer">
                    Launch EAIOS <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#impact">View Use Cases</a>
                </Button>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[380px]"
            >
              {[
                {
                  icon: Bot,
                  title: 'Agentic Automation',
                  description: 'Coordinate AI agents for validation, translation, retrieval, and task execution.',
                  color: 'from-halo-500 to-cyan-600',
                },
                {
                  icon: Workflow,
                  title: 'Workflow Orchestration',
                  description: 'Run approval flows, document pipelines, and AI-assisted operations in one platform.',
                  color: 'from-cyan-500 to-sky-600',
                },
                {
                  icon: ShieldCheck,
                  title: 'Governance Ready',
                  description: 'Built for role-based access, auditability, and enterprise-grade operational controls.',
                  color: 'from-emerald-500 to-teal-600',
                },
                {
                  icon: Building2,
                  title: 'Multi-Tenant Core',
                  description: 'Serve multiple organizations from a unified product with isolated data and access controls.',
                  color: 'from-violet-500 to-indigo-600',
                },
              ].map(({ icon: Icon, title, description, color }) => (
                <motion.div
                  key={title}
                  variants={cardVariants}
                  className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4"
                >
                  <div className={`mb-3 inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ${color}`}>
                    <Icon className="size-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* "More coming soon" teaser */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground"
        >
          More products coming soon — built on the HALO AI microservices platform.
        </motion.p>
      </div>
    </section>
  )
}
