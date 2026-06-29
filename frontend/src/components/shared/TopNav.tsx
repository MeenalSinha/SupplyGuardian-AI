'use client'

import { useState } from 'react'
import { Bell, Settings, ChevronDown, Search, Bot } from 'lucide-react'
import Link from 'next/link'

const navLinks = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Procurement', href: '/procurement' },
  { label: 'Suppliers', href: '/suppliers' },
  { label: 'Risk Center', href: '/risk' },
  { label: 'Contracts', href: '/contracts' },
  { label: 'Analytics', href: '/analytics' },
]

const notifications = [
  { id: 1, type: 'alert', message: 'Factory fire detected - Shenzhen supplier', time: '2m ago' },
  { id: 2, type: 'approval', message: 'Contract approval required - VoltX Energy', time: '8m ago' },
  { id: 3, type: 'risk', message: 'Sanctions match flagged - Global Parts Ltd.', time: '15m ago' },
]

export default function TopNav({ activeTab = 'Home' }: { activeTab?: string }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showChat, setShowChat] = useState(false)

  return (
    <header className="fixed top-0 left-[200px] right-0 h-14 z-30 flex items-center px-6 gap-4"
      style={{ background: 'rgba(17, 16, 16, 0.95)', borderBottom: '1px solid var(--brand-border)', backdropFilter: 'blur(8px)' }}>
      
      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: activeTab === link.label ? 'var(--brand-surface-light)' : 'transparent',
              color: activeTab === link.label ? 'var(--brand-text)' : 'var(--brand-text-muted)',
              border: activeTab === link.label ? '1px solid var(--brand-border-light)' : '1px solid transparent',
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* AI Assistant */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: 'rgba(201, 168, 76, 0.1)',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            color: 'var(--brand-gold)',
          }}
        >
          <Bot size={13} />
          AI Assistant
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}
          >
            <Bell size={14} style={{ color: 'var(--brand-text-muted)' }} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: 'var(--brand-red)', color: 'white', fontSize: '9px' }}>
              3
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-10 w-72 rounded-xl shadow-xl z-50"
              style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--brand-border)' }}>
                <span className="text-sm font-semibold">Notifications</span>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className="px-4 py-3 flex gap-3 items-start hover:bg-brand-surface-light transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid rgba(51,49,40,0.5)' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: n.type === 'alert' ? 'var(--brand-red)' : n.type === 'approval' ? 'var(--brand-gold)' : 'var(--brand-amber)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--brand-text)' }}>{n.message}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}>
          <Settings size={14} style={{ color: 'var(--brand-text-muted)' }} />
        </button>

        {/* User */}
        <button className="flex items-center gap-2.5 px-2 py-1 rounded-full transition-colors"
          style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--brand-gold)', color: 'var(--brand-carbon)' }}>
            J
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold leading-none" style={{ color: 'var(--brand-text)' }}>J. Doe</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>Procurement Director</div>
          </div>
          <ChevronDown size={12} style={{ color: 'var(--brand-text-dim)' }} />
        </button>
      </div>
    </header>
  )
}
