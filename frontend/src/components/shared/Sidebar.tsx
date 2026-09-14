'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, GitBranch, Search, MessageSquare,
  ShieldAlert, FileText, Globe, Zap, CheckSquare,
  BarChart3, ClipboardList, Activity, Play, FolderOpen,
  Cpu, Brain, TrendingUp, Sliders, BookOpen
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Executive Briefing', href: '/briefing', icon: BookOpen, badge: 'NEW' },
      { label: 'Demo Flow', href: '/demo', icon: Play, badge: 'DEMO' },
    ],
  },
  {
    title: 'PROCUREMENT',
    items: [
      { label: 'Pipeline', href: '/procurement', icon: GitBranch },
      { label: 'Case Management', href: '/cases', icon: FolderOpen },
      { label: 'Suppliers', href: '/suppliers', icon: Search },
      { label: 'Negotiations', href: '/negotiations', icon: MessageSquare },
      { label: 'Contracts', href: '/contracts', icon: FileText },
      { label: 'Approvals', href: '/approvals', icon: CheckSquare },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { label: 'Risk & Compliance', href: '/risk', icon: ShieldAlert },
      { label: 'Supply Chain', href: '/supply-chain', icon: Globe },
      { label: 'Disruption Center', href: '/disruption', icon: Zap },
      { label: 'Market Intelligence', href: '/intelligence', icon: TrendingUp },
      { label: 'Scenario Simulator', href: '/intelligence#simulator', icon: Sliders },
    ],
  },
  {
    title: 'AI & AUTOMATION',
    items: [
      { label: 'AI Explainability', href: '/explainability', icon: Brain },
      { label: 'UiPath RPA', href: '/rpa', icon: Cpu },
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { label: 'Audit & Logs', href: '/audit', icon: ClipboardList },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] flex flex-col z-40"
      style={{ background: 'var(--brand-carbon-light)', borderRight: '1px solid var(--brand-border)' }}>

      {/* Logo */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--brand-border)' }}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-dark) 100%)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#111010" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 12l9-5M12 12v10M12 12L3 7" stroke="#111010" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold leading-none" style={{ color: 'var(--brand-text)' }}>SupplyGuardian</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--brand-gold)', fontWeight: 600 }}>AI</div>
          </div>
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Autonomous Procurement OS</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
        {NAV_SECTIONS.map(section => (
          <div key={section.title}>
            <div className="px-2 mb-1" style={{ fontSize: '9px', fontWeight: 700, color: 'var(--brand-text-dim)', letterSpacing: '0.1em' }}>
              {section.title}
            </div>
            {section.items.map(item => {
              const Icon = item.icon
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href.split('#')[0] + '/'))
                || pathname === item.href.split('#')[0]
              return (
                <Link key={item.href} href={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}
                  style={{ marginBottom: '1px' }}>
                  <Icon size={13} />
                  <span className="flex-1 text-xs">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-bold px-1 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'rgba(201,168,76,0.2)', color: 'var(--brand-gold)', fontSize: '8px' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Supply Chain Health */}
      <div className="p-3" style={{ borderTop: '1px solid var(--brand-border)' }}>
        <div className="sg-card" style={{ padding: '10px' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--brand-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Supply Chain Health
            </span>
            <Activity size={11} style={{ color: 'var(--brand-text-dim)' }} />
          </div>
          {/* Sparkline wave */}
          <div className="mb-1.5" style={{ height: '28px' }}>
            <svg width="100%" height="28" viewBox="0 0 160 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8DC54A" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#8DC54A" stopOpacity="0.05"/>
                </linearGradient>
              </defs>
              <path
                d="M0,22 C10,20 15,18 25,14 C35,10 40,16 50,12 C60,8 65,15 75,10 C85,5 90,12 100,8 C110,4 120,10 130,6 C140,2 150,7 160,4"
                fill="none"
                stroke="#8DC54A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,22 C10,20 15,18 25,14 C35,10 40,16 50,12 C60,8 65,15 75,10 C85,5 90,12 100,8 C110,4 120,10 130,6 C140,2 150,7 160,4 L160,28 L0,28 Z"
                fill="url(#sparkGrad)"
              />
            </svg>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand-green)' }}>Healthy</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-text)' }}>
              92<span style={{ fontSize: '10px', fontWeight: 400, color: 'var(--brand-text-muted)' }}>/100</span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

