import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, Menu, X, LayoutDashboard, MessageSquare, Mic, BookOpen, Phone, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

const navItems = [
  { to: '/app/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/app/chat',       label: 'Chat',        icon: MessageSquare },
  { to: '/app/voice',      label: 'Voice',       icon: Mic },
  { to: '/app/knowledge',  label: 'Knowledge',   icon: BookOpen },
  { to: '/app/ivr',        label: 'IVR',         icon: Phone },
  { to: '/app/settings',   label: 'Settings',    icon: Settings },
]

const PAGE_TITLES: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/chat': 'Chat',
  '/app/voice': 'Voice Studio',
  '/app/knowledge': 'Knowledge Base',
  '/app/ivr': 'IVR Manager',
  '/app/settings': 'Settings',
}

export function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const currentTitle = Object.entries(PAGE_TITLES).find(([key]) =>
    location.pathname.startsWith(key),
  )?.[1] ?? 'HALO AI'

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'HA'

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-card/50 backdrop-blur-xl px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          <img
            src="/halo-logo-symbol-transparent.png?v=20260908"
            alt="HALO Africa logo"
            className="brand-logo size-7 object-contain"
          />
          <h1 className="text-base font-semibold text-foreground">{currentTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <Search className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-halo-400" />
          </Button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent transition-colors"
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="size-7 rounded-full object-cover" />
              ) : (
                <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-halo-500 to-violet-600 text-xs font-bold text-white">
                  {initials}
                </div>
              )}
              <span className="hidden sm:block text-xs font-medium max-w-[100px] truncate">
                {user?.name ?? 'User'}
              </span>
              <ChevronDown className={cn('size-3 text-muted-foreground transition-transform', userMenuOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-popover shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <LogOut className="size-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border md:hidden"
            >
              <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
                <div className="flex size-9 items-center justify-center overflow-hidden rounded-xl bg-transparent">
                  <img
                    src="/halo-logo-symbol-transparent.png?v=20260908"
                    alt="HALO Africa logo"
                    className="brand-logo size-9 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold">HALO AI</p>
                  <p className="text-[10px] text-muted-foreground">Light · Guidance · Trust</p>
                </div>
              </div>
              <nav className="space-y-1 p-3 pt-4">
                {navItems.map(({ to, label, icon: Icon }) => {
                  const isActive = location.pathname.startsWith(to)
                  return (
                    <NavLink key={to} to={to} onClick={() => setMobileMenuOpen(false)}>
                      <div
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                          isActive
                            ? 'bg-primary/15 text-primary border border-primary/20'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                      >
                        <Icon className="size-4" />
                        {label}
                      </div>
                    </NavLink>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
