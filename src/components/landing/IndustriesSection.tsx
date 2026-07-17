import { motion } from 'framer-motion'
import { Heart, Building2, Wifi, Landmark } from 'lucide-react'

const industries = [
  {
    icon: Heart,
    title: 'Healthcare',
    description: 'Multilingual patient intake, appointment scheduling, and medical query handling in local languages.',
    color: 'from-rose-500 to-pink-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]',
    features: ['Patient triage automation', 'Appointment reminders', 'Medical transcription'],
  },
  {
    icon: Building2,
    title: 'Banking & Finance',
    description: 'Voice-enabled banking services, fraud detection alerts, and multilingual customer support.',
    color: 'from-halo-500 to-cyan-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(14,162,233,0.3)]',
    features: ['Account balance queries', 'Transaction alerts', 'Loan application support'],
  },
  {
    icon: Wifi,
    title: 'Telecommunications',
    description: 'Intelligent IVR systems, churn prediction, and automated technical support in regional languages.',
    color: 'from-violet-500 to-purple-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
    features: ['Self-service portals', 'Billing inquiries', 'Network issue resolution'],
  },
  {
    icon: Landmark,
    title: 'Government',
    description: 'Citizen services automation, document processing, and multilingual public information systems.',
    color: 'from-emerald-500 to-green-600',
    glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    features: ['Permit applications', 'Public announcements', 'Service inquiries'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export function IndustriesSection() {
  return (
    <section id="industries" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-halo-400 mb-3 uppercase tracking-widest">Industries</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for Africa's <span className="text-gradient">Largest Sectors</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Purpose-built AI solutions designed for the unique linguistic and operational
            challenges across Africa's most critical industries.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {industries.map(({ icon: Icon, title, description, color, glow, features }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className={`group relative rounded-2xl border border-border bg-card p-6 cursor-default transition-all duration-300 ${glow}`}
            >
              <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                <Icon className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
              <ul className="space-y-1.5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={`size-1.5 rounded-full bg-gradient-to-r ${color}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
