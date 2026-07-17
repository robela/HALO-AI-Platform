import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void
          renderButton: (el: HTMLElement, config: object) => void
          prompt: () => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

type Mode = 'login' | 'register'

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth, isAuthenticated } = useAuthStore()
  const from = (location.state as { from?: string })?.from ?? '/app/dashboard'

  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const googleBtnRef = useRef<HTMLDivElement>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  // Load Google Identity Services script
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const scriptId = 'google-gsi'
    if (document.getElementById(scriptId)) {
      initGoogleButton()
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initGoogleButton
    document.head.appendChild(script)
  }, [mode]) // re-init when mode changes so button renders in new DOM position

  function initGoogleButton() {
    if (!window.google || !googleBtnRef.current || !GOOGLE_CLIENT_ID) return

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    })

    googleBtnRef.current.innerHTML = ''
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'filled_black',
      size: 'large',
      width: googleBtnRef.current.offsetWidth || 360,
      text: mode === 'register' ? 'signup_with' : 'signin_with',
      shape: 'rectangular',
    })
  }

  function extractError(err: unknown): string {
    if (axios.isAxiosError(err)) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        return detail.map((d: { msg: string }) => d.msg.replace('Value error, ', '')).join('; ')
      }
      if (typeof detail === 'string') return detail
      return err.response?.data?.message ?? err.message
    }
    return err instanceof Error ? err.message : 'An error occurred'
  }

  async function handleGoogleCallback(response: { credential: string }) {
    setIsLoading(true)
    setError(null)
    try {
      const result = await authService.googleLogin({ credential: response.credential })
      setAuth(result.user, result.access_token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(extractError(err))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Client-side validation
    if (mode === 'register' && !form.name.trim()) {
      return setError('Name is required')
    }
    if (!form.email.trim()) {
      return setError('Email is required')
    }
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters')
    }

    setIsLoading(true)

    try {
      const result =
        mode === 'login'
          ? await authService.login({ email: form.email, password: form.password })
          : await authService.register({ name: form.name.trim(), email: form.email.trim(), password: form.password })

      setAuth(result.user, result.access_token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(extractError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const field = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="min-h-screen bg-background animated-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-halo-600 -top-20 -right-20 fixed" />
      <div className="orb w-64 h-64 bg-violet-800 bottom-0 -left-32 fixed" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Back to landing */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>

        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-halo-500 to-violet-600 shadow-glow-sm">
              <Zap className="size-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold">HALO AI</p>
              <p className="text-[10px] text-muted-foreground">Light · Guidance · Trust · Intelligence</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-lg border border-border bg-muted p-1 mb-6">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null) }}
                className={cn(
                  'flex-1 rounded-md py-1.5 text-sm font-medium transition-all',
                  mode === m
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive mb-4"
              >
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => field('name', e.target.value)}
                      className="pl-9"
                      required={mode === 'register'}
                      autoComplete="name"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => field('email', e.target.value)}
                className="pl-9"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'Password (min 8 chars)' : 'Password'}
                value={form.password}
                onChange={(e) => field('password', e.target.value)}
                className="pl-9 pr-10"
                required
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <Button type="submit" variant="gradient" className="w-full" size="lg" loading={isLoading}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          {GOOGLE_CLIENT_ID && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <div ref={googleBtnRef} className="w-full flex justify-center" />
            </>
          )}

          {!GOOGLE_CLIENT_ID && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Add <code className="text-halo-400">VITE_GOOGLE_CLIENT_ID</code> to <code className="text-halo-400">.env</code> to enable Google Sign-In.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
