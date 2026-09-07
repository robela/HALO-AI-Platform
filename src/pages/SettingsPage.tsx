import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Server, User, Building2, Palette, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettingsStore } from '@/stores/settingsStore'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-foreground">{children}</label>
}

export function SettingsPage() {
  const { apiEndpoints, preferences, organization, updateApiEndpoints, updatePreferences, updateOrganization, resetToDefaults } = useSettingsStore()

  const [endpointForm, setEndpointForm] = useState({ ...apiEndpoints })
  const [saved, setSaved] = useState(false)

  const handleSaveEndpoints = () => {
    updateApiEndpoints(endpointForm)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-2">
      <Tabs defaultValue="api">
        <TabsList className="mb-4">
          <TabsTrigger value="api"><Server className="size-3.5 mr-1.5" /> API Endpoints</TabsTrigger>
          <TabsTrigger value="preferences"><User className="size-3.5 mr-1.5" /> Preferences</TabsTrigger>
          <TabsTrigger value="organization"><Building2 className="size-3.5 mr-1.5" /> Organization</TabsTrigger>
          <TabsTrigger value="theme"><Palette className="size-3.5 mr-1.5" /> Theme</TabsTrigger>
        </TabsList>

        {/* API Endpoints */}
        <TabsContent value="api">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>API Endpoint Configuration</CardTitle>
                <CardDescription>Configure the base URLs for each HALO AI service.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {([
                  { key: 'chatApi',      label: 'Chat API',       placeholder: 'https://api.haloafrica.org/v1' },
                  { key: 'voiceApi',     label: 'Voice API',      placeholder: 'https://voice.haloafrica.org/v1' },
                  { key: 'knowledgeApi', label: 'Knowledge API',  placeholder: 'https://knowledge.haloafrica.org/v1' },
                  { key: 'ivrApi',       label: 'IVR API',        placeholder: 'https://ivr.haloafrica.org/v1' },
                ] as const).map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <SectionLabel>{label}</SectionLabel>
                    <Input
                      value={endpointForm[key]}
                      onChange={(e) => setEndpointForm({ ...endpointForm, [key]: e.target.value })}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <Button variant="gradient" onClick={handleSaveEndpoints}>
                    <Save className="size-4" /> {saved ? 'Saved!' : 'Save Endpoints'}
                  </Button>
                  <Button variant="outline" onClick={resetToDefaults}>
                    <RotateCcw className="size-4" /> Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>Customize your platform experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {([
                  { key: 'streamingEnabled', label: 'Enable streaming responses',     desc: 'Receive AI responses token-by-token in real time' },
                  { key: 'notifications',    label: 'Push notifications',             desc: 'Receive alerts for system events and updates' },
                  { key: 'soundEnabled',     label: 'Sound effects',                  desc: 'Play audio cues for voice interactions' },
                  { key: 'autoSave',         label: 'Auto-save conversations',        desc: 'Automatically persist chat history to local storage' },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <Switch
                      checked={preferences[key]}
                      onCheckedChange={(checked) => updatePreferences({ [key]: checked })}
                    />
                  </div>
                ))}

                <div className="space-y-1.5">
                  <SectionLabel>Interface Language</SectionLabel>
                  <Select value={preferences.language} onValueChange={(v) => updatePreferences({ language: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                      <SelectItem value="fr">Français (French)</SelectItem>
                      <SelectItem value="sw">Kiswahili (Swahili)</SelectItem>
                      <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Organization */}
        <TabsContent value="organization">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Manage your organization's settings and branding.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {([
                  { key: 'name',         label: 'Organization Name', placeholder: 'HALO AI Technologies PLC' },
                  { key: 'website',      label: 'Website',           placeholder: 'https://haloafrica.org' },
                  { key: 'contactEmail', label: 'Contact Email',     placeholder: 'contact@haloafrica.org' },
                  { key: 'industry',     label: 'Industry',          placeholder: 'Technology' },
                  { key: 'country',      label: 'Country',           placeholder: 'Ethiopia' },
                ] as const).map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <SectionLabel>{label}</SectionLabel>
                    <Input
                      value={organization[key]}
                      onChange={(e) => updateOrganization({ [key]: e.target.value })}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <SectionLabel>Plan Type</SectionLabel>
                  <Select value={organization.planType} onValueChange={(v) => updateOrganization({ planType: v as typeof organization.planType })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="gradient" onClick={() => { /* Save org */ }}>
                  <Save className="size-4" /> Save Organization
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Theme */}
        <TabsContent value="theme">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize the appearance of the HALO AI Platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <SectionLabel>Color Mode</SectionLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {(['dark', 'light', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => updatePreferences({ theme: t })}
                        className={`rounded-xl border p-4 text-sm font-medium capitalize transition-all ${
                          preferences.theme === t
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-halo-500/40'
                        }`}
                      >
                        {t === 'dark' ? '🌙 Dark' : t === 'light' ? '☀️ Light' : '💻 System'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground">
                    The platform uses a premium dark AI theme by default. Light mode is coming soon.
                    All color tokens are CSS variables and can be customized in <code className="text-halo-400">index.css</code>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
