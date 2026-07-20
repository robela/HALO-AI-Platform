import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  Captions,
  HandMetal,
  Smartphone,
  Globe,
  Accessibility,
  Zap,
  HeartHandshake,
  GraduationCap,
  Building2,
  Landmark,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: Mic,          title: 'Real-Time Speech Recognition', description: 'Powered by OpenAI Whisper — converts spoken language to text instantly across multilingual environments.', color: 'from-violet-500 to-purple-600' },
  { icon: Captions,     title: 'Live Captioning',               description: 'Displays captions in real time during meetings, clinic consultations, classes, and public events.', color: 'from-halo-500 to-cyan-600' },
  { icon: HandMetal,    title: 'Text-to-Sign Language',         description: 'Converts text to sign-language animations or video sequences — ASL, Ethiopian Sign Language, and more.', color: 'from-emerald-500 to-green-600' },
  { icon: Smartphone,   title: 'Mobile-First PWA',              description: 'Responsive Progressive Web App — works on Android, iOS, and any modern browser. Lightweight and fast.', color: 'from-rose-500 to-pink-600' },
  { icon: Globe,        title: 'Multilingual Support',          description: 'English, Amharic, and additional African languages. Language detection is automatic.', color: 'from-amber-500 to-orange-600' },
  { icon: Accessibility, title: 'Accessibility-First UX',      description: 'High-contrast interface, large-text options, simple navigation, and touch-friendly controls.', color: 'from-fuchsia-500 to-pink-600' },
]

const useCases = [
  { icon: HeartHandshake, label: 'Healthcare',      description: 'Doctor–patient communication without an interpreter.', color: 'from-rose-500 to-pink-600' },
  { icon: GraduationCap, label: 'Education',         description: 'Inclusive classrooms for Deaf and Hard-of-Hearing students.', color: 'from-violet-500 to-purple-600' },
  { icon: Building2,     label: 'Workplaces',        description: 'Barrier-free meetings and onboarding for all employees.', color: 'from-halo-500 to-cyan-600' },
  { icon: Landmark,      label: 'Public Services',   description: 'Government counters, banks, and transport hubs — accessible to all.', color: 'from-emerald-500 to-green-600' },
]

const stack = [
  { layer: 'Frontend',      items: ['React', 'TypeScript', 'Tailwind CSS', 'PWA'] },
  { layer: 'Backend',       items: ['Python', 'FastAPI', 'WebSocket Streaming', 'REST APIs'] },
  { layer: 'Speech AI',     items: ['OpenAI Whisper', 'Fine-tuned ASR', 'Language Detection'] },
  { layer: 'Sign Language', items: ['Avatar Rendering', 'Video Generation', 'NLP normalisation'] },
  { layer: 'Infra',         items: ['Docker', 'Azure', 'GitHub Actions', 'CI/CD'] },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export function SignBridgePage() {
  return (
    <div className="min-h-screen bg-background animated-bg text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-halo-500 to-violet-600 shadow-glow-sm">
              <Zap className="size-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">HALO AI</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="size-4" /> Back
            </Link>
          </Button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-halo-600/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3 mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-400">
              <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
              IBM AI Builders Challenge · 2026
            </div>

            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <HandMetal className="size-8 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
          >
            <span className="text-foreground">SignBridge</span>{' '}
            <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A mobile-first accessibility platform that converts spoken language into real-time text
            captions and sign-language representations — breaking communication barriers for
            Deaf and Hard-of-Hearing individuals across Africa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="gradient" size="xl" asChild>
              <Link to="/auth">
                Try SignBridge <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/#products">
                <ArrowLeft className="size-5" /> All Products
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-violet-400 mb-3 uppercase tracking-widest">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">Communicate</span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map(({ icon: Icon, title, description, color }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-violet-500/30"
              >
                <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                  <Icon className="size-6 text-white" />
                </div>
                <h3 className="text-base font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Architecture diagram ── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium text-violet-400 mb-3 uppercase tracking-widest">Architecture</p>
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card/60 p-8"
          >
            <div className="flex flex-col items-center gap-3 text-sm font-mono text-muted-foreground">
              {[
                { label: 'User Speech', sub: 'Microphone input' },
                null,
                { label: 'Speech Recognition', sub: 'Whisper ASR', highlight: true },
                null,
                { label: 'Text Processing', sub: 'NLP · Language Detection' },
                null,
              ].map((node, i) =>
                node === null ? (
                  <div key={i} className="h-6 w-px bg-border" />
                ) : (
                  <div
                    key={node.label}
                    className={`w-full max-w-xs text-center rounded-xl border px-6 py-3 ${
                      node.highlight
                        ? 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className="font-semibold text-foreground">{node.label}</div>
                    <div className="text-xs mt-0.5 opacity-70">{node.sub}</div>
                  </div>
                )
              )}

              {/* Split */}
              <div className="flex w-full max-w-xs items-center justify-center gap-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground px-2">splits into</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex gap-6 w-full max-w-sm justify-center">
                {[
                  { label: 'Live Captions', color: 'border-halo-500/40 bg-halo-500/10 text-halo-300' },
                  { label: 'Sign Language Engine', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
                ].map(({ label, color }) => (
                  <div key={label} className={`flex-1 text-center rounded-xl border px-3 py-3 text-xs font-semibold ${color}`}>
                    {label}
                  </div>
                ))}
              </div>

              <div className="h-6 w-px bg-border" />
              <div className="w-full max-w-xs text-center rounded-xl border border-border bg-muted/30 px-6 py-3">
                <div className="font-semibold text-foreground">Mobile Client</div>
                <div className="text-xs mt-0.5 opacity-70">PWA · Android · iOS</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-violet-400 mb-3 uppercase tracking-widest">Impact</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Where <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">SignBridge</span> Makes a Difference
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {useCases.map(({ icon: Icon, label, description, color }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300"
              >
                <div className={`mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                  <Icon className="size-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">{label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium text-violet-400 mb-3 uppercase tracking-widest">Stack</p>
            <h2 className="text-3xl md:text-4xl font-bold">Technology</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {stack.map(({ layer, items }) => (
              <motion.div
                key={layer}
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-border bg-card/60 px-6 py-4"
              >
                <span className="w-36 shrink-0 text-sm font-semibold text-muted-foreground">{layer}</span>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-lg">
              <ShieldCheck className="size-7 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Ready to <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">Bridge the Gap</span>?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
              SignBridge AI is being built as a microservice on the HALO AI Platform.
              Sign up to join the early access programme.
            </p>
            <Button variant="gradient" size="xl" asChild>
              <Link to="/auth">
                Get Early Access <ArrowRight className="size-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-halo-400" />
            <span>© 2026 HALO AI Technologies PLC · SignBridge AI</span>
          </div>
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="size-3" /> Back to HALO AI
          </Link>
        </div>
      </footer>

      <div className="orb w-96 h-96 bg-violet-700 -top-20 -right-20 fixed pointer-events-none" />
      <div className="orb w-64 h-64 bg-purple-800 top-1/2 -left-32 fixed pointer-events-none" />
    </div>
  )
}
