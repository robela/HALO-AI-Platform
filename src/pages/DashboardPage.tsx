import { motion } from 'framer-motion'
import {
  MessageSquare, Mic, BookOpen, Phone,
  TrendingUp, TrendingDown, Activity, Users,
  CheckCircle, AlertCircle, Circle, Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatDistanceToNow } from 'date-fns'

const metricCards = [
  {
    title: 'Chat Sessions',
    value: '2,847',
    change: +12.5,
    icon: MessageSquare,
    color: 'text-halo-400',
    bg: 'bg-halo-500/10 border-halo-500/20',
  },
  {
    title: 'Voice Queries',
    value: '18,302',
    change: +24.1,
    icon: Mic,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    title: 'Knowledge Queries',
    value: '9,154',
    change: -3.2,
    icon: BookOpen,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    title: 'IVR Calls',
    value: '43,217',
    change: +7.8,
    icon: Phone,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
  },
]

const activityData = [
  { time: '00:00', chat: 120, voice: 80, ivr: 200 },
  { time: '04:00', chat: 60,  voice: 30,  ivr: 100 },
  { time: '08:00', chat: 400, voice: 280, ivr: 600 },
  { time: '12:00', chat: 800, voice: 620, ivr: 1100 },
  { time: '16:00', chat: 750, voice: 560, ivr: 980 },
  { time: '20:00', chat: 500, voice: 380, ivr: 740 },
  { time: '24:00', chat: 200, voice: 140, ivr: 320 },
]

const systemHealth = [
  { service: 'Chat API',       status: 'healthy',  latency: 45,  uptime: 99.9 },
  { service: 'Voice ASR',      status: 'healthy',  latency: 182, uptime: 99.7 },
  { service: 'TTS Engine',     status: 'degraded', latency: 340, uptime: 98.2 },
  { service: 'Knowledge RAG',  status: 'healthy',  latency: 280, uptime: 99.8 },
  { service: 'IVR Gateway',    status: 'healthy',  latency: 95,  uptime: 99.5 },
]

const recentActivity = [
  { id: '1', type: 'chat' as const,      desc: 'New conversation started by user@bank.et',         time: new Date(Date.now() - 2 * 60 * 1000) },
  { id: '2', type: 'voice' as const,     desc: 'Amharic transcription completed (94% confidence)',  time: new Date(Date.now() - 8 * 60 * 1000) },
  { id: '3', type: 'knowledge' as const, desc: 'Document "Q3 Report.pdf" indexed (1,240 chunks)',   time: new Date(Date.now() - 15 * 60 * 1000) },
  { id: '4', type: 'ivr' as const,       desc: 'IVR call routed to customer support queue',         time: new Date(Date.now() - 22 * 60 * 1000) },
  { id: '5', type: 'chat' as const,      desc: 'Conversation exported (JSON format)',               time: new Date(Date.now() - 35 * 60 * 1000) },
]

const statusIcons = {
  healthy:  <CheckCircle className="size-4 text-emerald-400" />,
  degraded: <AlertCircle className="size-4 text-amber-400" />,
  down:     <Circle className="size-4 text-rose-400" />,
}

const activityColors = {
  chat: 'bg-halo-500/20 text-halo-400',
  voice: 'bg-violet-500/20 text-violet-400',
  knowledge: 'bg-emerald-500/20 text-emerald-400',
  ivr: 'bg-orange-500/20 text-orange-400',
  system: 'bg-rose-500/20 text-rose-400',
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ title, value, change, icon: Icon, color, bg }, i) => (
          <motion.div key={title} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex size-10 items-center justify-center rounded-xl border ${bg}`}>
                    <Icon className={`size-5 ${color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {change >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {Math.abs(change)}%
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">{value}</p>
                <p className="text-xs text-muted-foreground">{title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Platform Activity (24h)</CardTitle>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-halo-400" /> Chat</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-violet-400" /> Voice</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-orange-400" /> IVR</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="chatGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea2e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea2e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="voiceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ivrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="chat"  stroke="#0ea2e9" fill="url(#chatGrad)"  strokeWidth={2} />
                  <Area type="monotone" dataKey="voice" stroke="#8b5cf6" fill="url(#voiceGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="ivr"   stroke="#f97316" fill="url(#ivrGrad)"   strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Health */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="size-4 text-halo-400" /> System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth.map(({ service, status, latency, uptime }) => (
                <div key={service}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {statusIcons[status as keyof typeof statusIcons]}
                      <span className="text-sm font-medium">{service}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{latency}ms</span>
                  </div>
                  <Progress value={uptime} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground mt-1">{uptime}% uptime</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="size-4 text-halo-400" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map(({ id, type, desc, time }) => (
              <div key={id} className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent/50 transition-colors">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${activityColors[type]}`}>
                  {type}
                </span>
                <span className="flex-1 text-sm text-muted-foreground">{desc}</span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="size-3" />
                  {formatDistanceToNow(time, { addSuffix: true })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
