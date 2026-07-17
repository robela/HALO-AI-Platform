import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Wifi, WifiOff, Activity, Loader2 } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ivrService } from '@/services/ivrService'
import { formatDuration } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { IntegrationStatus } from '@/types'

const callStatusConfig = {
  answered:    { icon: <CheckCircle className="size-3" />, variant: 'success' as const },
  missed:      { icon: <XCircle className="size-3" />,    variant: 'destructive' as const },
  voicemail:   { icon: <Phone className="size-3" />,      variant: 'secondary' as const },
  transferred: { icon: <Activity className="size-3" />,   variant: 'warning' as const },
  failed:      { icon: <AlertCircle className="size-3" />,variant: 'destructive' as const },
}

const integrationStatusConfig: Record<IntegrationStatus, { icon: React.ReactNode; label: string; variant: 'success' | 'destructive' | 'warning' | 'secondary' }> = {
  connected:    { icon: <Wifi className="size-4 text-emerald-400" />,    label: 'Connected',    variant: 'success' },
  disconnected: { icon: <WifiOff className="size-4 text-rose-400" />,   label: 'Disconnected', variant: 'destructive' },
  degraded:     { icon: <AlertCircle className="size-4 text-amber-400" />,label: 'Degraded',   variant: 'warning' },
  unknown:      { icon: <AlertCircle className="size-4 text-muted-foreground" />, label: 'Unknown', variant: 'secondary' },
}

// Mock chart data for when API is unavailable
const mockChartData = Array.from({ length: 12 }, (_, i) => ({
  time: `${i * 2}:00`,
  calls: Math.floor(Math.random() * 200 + 50),
  answered: Math.floor(Math.random() * 150 + 30),
}))

export function IVRPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')

  const { data: metrics } = useQuery({
    queryKey: ['ivr-metrics'],
    queryFn: ivrService.getMetrics,
  })

  const { data: callsData, isLoading: callsLoading } = useQuery({
    queryKey: ['ivr-calls'],
    queryFn: () => ivrService.getCallLogs(1, 20),
  })

  const { data: integrations } = useQuery({
    queryKey: ['ivr-integrations'],
    queryFn: ivrService.getIntegrations,
  })

  const { data: analyticsData } = useQuery({
    queryKey: ['ivr-analytics', timeRange],
    queryFn: () => ivrService.getCallAnalytics(timeRange),
  })

  const testMutation = useMutation({
    mutationFn: (id: string) => ivrService.testIntegration(id),
  })

  const metricValues = [
    { title: 'Total Calls',      value: metrics?.totalCalls.toLocaleString() ?? '—',     icon: Phone,       color: 'text-halo-400' },
    { title: 'Answer Rate',      value: metrics ? `${((metrics.answeredCalls / metrics.totalCalls) * 100).toFixed(1)}%` : '—', icon: CheckCircle, color: 'text-emerald-400' },
    { title: 'Avg Duration',     value: metrics ? formatDuration(metrics.averageDuration) : '—', icon: Clock, color: 'text-violet-400' },
    { title: 'Satisfaction',     value: metrics ? `${metrics.satisfactionScore.toFixed(1)}/5` : '—', icon: TrendingUp, color: 'text-orange-400' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricValues.map(({ title, value, icon: Icon, color }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="card-hover">
              <CardContent className="p-5">
                <Icon className={`size-5 ${color} mb-3`} />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Call Logs</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Call Volume</CardTitle>
                <div className="flex gap-2">
                  {(['24h', '7d', '30d'] as const).map((r) => (
                    <Button
                      key={r}
                      variant={timeRange === r ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTimeRange(r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData ?? mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="calls"    fill="#0ea2e9" radius={[4, 4, 0, 0]} opacity={0.7} />
                  <Bar dataKey="answered" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Call Logs */}
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Calls</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {callsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : !callsData?.items.length ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Phone className="size-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No call records available</p>
                </div>
              ) : (
                <ScrollArea className="max-h-96">
                  <div className="divide-y divide-border">
                    {callsData.items.map((call) => (
                      <div key={call.id} className="flex items-center gap-4 px-6 py-3 hover:bg-accent/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{call.caller}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-sm text-muted-foreground">{call.callee}</span>
                          </div>
                          {call.intent && (
                            <p className="text-xs text-muted-foreground mt-0.5">{call.intent}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-muted-foreground">{formatDuration(call.duration)}</span>
                          <Badge variant={callStatusConfig[call.status].variant} className="gap-1 text-[10px]">
                            {callStatusConfig[call.status].icon}
                            {call.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(call.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {(integrations ?? []).map((integration) => {
              const config = integrationStatusConfig[integration.status]
              return (
                <Card key={integration.id} className="card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{integration.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{integration.type}</p>
                      </div>
                      <Badge variant={config.variant} className="gap-1">
                        {config.icon}
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-3">{integration.endpoint}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => testMutation.mutate(integration.id)}
                      loading={testMutation.isPending && testMutation.variables === integration.id}
                    >
                      Test Connection
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
            {!integrations?.length && (
              <div className="sm:col-span-2 flex flex-col items-center justify-center py-16 text-center">
                <Wifi className="size-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No integrations configured</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
