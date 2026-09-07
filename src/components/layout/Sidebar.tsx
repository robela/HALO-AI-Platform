import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquare,
  Mic,
  BookOpen,
  Phone,
  Settings,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/app/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/app/chat',       label: 'Chat',        icon: MessageSquare },
  { to: '/app/voice',      label: 'Voice',       icon: Mic },
  { to: '/app/knowledge',  label: 'Knowledge',   icon: BookOpen },
  { to: '/app/ivr',        label: 'IVR',         icon: Phone },
  { to: '/app/settings',   label: 'Settings',    icon: Settings },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-transparent">
          <img
            src="/halo-logo-symbol-transparent.png?v=20260908"
            alt="HALO Africa logo"
            className="brand-logo size-9 object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-foreground">HALO AI</p>
          <p className="text-[10px] text-muted-foreground">Light · Guidance · Trust · Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 pt-4">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(to)
          return (
            <NavLink key={to} to={to}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/15 text-primary shadow-glow-sm border border-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <a
          href="https://haloafrica.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="size-3" />
          haloafrica.org
        </a>
        <p className="mt-1 px-3 text-[10px] text-muted-foreground/60">v1.0.0 · Enterprise</p>
      </div>
    </aside>
  )
}
