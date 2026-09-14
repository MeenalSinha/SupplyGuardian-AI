'use client'

import { useState } from 'react'
import { TrendingUp, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react'
import {
  BarChart, Bar, XAxis, ResponsiveContainer, Cell
} from 'recharts'

const savingsData = [
  { month: 'Oct', value: 38 },
  { month: 'Nov', value: 55 },
  { month: 'Dec', value: 49 },
  { month: 'Jan', value: 72 },
  { month: 'Feb', value: 61 },
  { month: 'Mar', value: 94 },
]

type TabKey = 'Today' | 'Week' | 'Month'

const procurementData: Record<TabKey, { cases: string; spend: string; approvals: string; casesDelta: string; spendDelta: string; approvalsDelta: string }> = {
  Today:  { cases: '12',      spend: '94K',    approvals: '3',  casesDelta: '+2',    spendDelta: '+8.4%', approvalsDelta: '+1' },
  Week:   { cases: '47',      spend: '485K',   approvals: '11', casesDelta: '+14%',  spendDelta: '+6.1%', approvalsDelta: '+4' },
  Month:  { cases: '183',     spend: '1.82M',  approvals: '38', casesDelta: '+22%',  spendDelta: '+11.3%', approvalsDelta: '+9' },
}

export default function HeroBanner() {
  const [activeTab, setActiveTab] = useState<TabKey>('Today')
  const data = procurementData[activeTab]

  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ height: '360px' }}>
      {/* Real photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-conveyor.jpg')" }}
      />
      {/* Dark gradient overlay — heavy left, fades right */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(90deg, rgba(18,14,8,0.97) 0%, rgba(18,14,8,0.82) 38%, rgba(18,14,8,0.35) 65%, rgba(18,14,8,0.1) 100%)'
      }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Hero text */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="font-black leading-none tracking-tight" style={{ color: 'var(--brand-text)', fontSize: '46px', lineHeight: 1.05 }}>
              OWN<br />THE OUTCOME
            </h1>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="chip chip-gold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>AI-Powered Platform</span>
          </div>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--brand-text-muted)' }}>
            Autonomous procurement, intelligent<br />suppliers, resilient supply chains.
          </p>
        </div>

        {/* Savings Trend Chart card */}
        <div className="rounded-xl" style={{ padding: '14px', maxWidth: '230px', background: 'rgba(22,18,10,0.92)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Savings Trend</span>
            <ArrowUpRight size={11} style={{ color: 'var(--brand-text-dim)' }} />
          </div>
          <div className="chip chip-green mb-2" style={{ fontSize: '11px' }}>+$24.5K this run</div>
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={savingsData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {savingsData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.month === 'Mar' ? '#C9A84C' : '#4A4535'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right-side stats panel */}
      <div className="absolute top-4 right-4 z-10 space-y-3" style={{ minWidth: '290px' }}>
        {/* Active Procurements */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(22,18,10,0.92)', border: '1px solid rgba(201,168,76,0.18)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Active Procurements</span>
            <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>(This {activeTab})</span>
          </div>
          <div className="flex gap-5 mb-3">
            <div>
              <div className="text-xl font-bold leading-none" style={{ color: 'var(--brand-text)' }}>{data.cases}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Cases</span>
                <span className="text-xs font-semibold" style={{ color: '#8DC54A' }}>{data.casesDelta}</span>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold leading-none" style={{ color: 'var(--brand-text)' }}>{data.spend}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Spend</span>
                <span className="text-xs font-semibold" style={{ color: '#8DC54A' }}>{data.spendDelta}</span>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold leading-none" style={{ color: 'var(--brand-text)' }}>{data.approvals}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Approvals</span>
                <span className="text-xs font-semibold" style={{ color: '#8DC54A' }}>{data.approvalsDelta}</span>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 items-center">
            {(['Today', 'Week', 'Month'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background: activeTab === tab ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: activeTab === tab ? 'var(--brand-text)' : 'var(--brand-text-dim)',
                  border: activeTab === tab ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                }}
              >
                {tab}
              </button>
            ))}
            <button
              className="ml-auto flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'var(--brand-gold)', color: '#111010' }}
            >
              View Details <ArrowUpRight size={10} />
            </button>
          </div>
        </div>

        {/* Mini stat cards */}
        <div className="flex gap-3">
          {/* Agent Pipeline */}
          <div className="rounded-xl p-3 flex-1" style={{ background: 'rgba(22,18,10,0.92)', border: '1px solid rgba(201,168,76,0.18)' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Agent Pipeline</span>
              <ArrowUpRight size={11} style={{ color: 'var(--brand-text-dim)' }} />
            </div>
            <div className="text-xs mb-1" style={{ color: 'var(--brand-text-dim)' }}>Automation Rate</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--brand-text)' }}>94%</div>
            <div className="text-xs mb-1.5" style={{ color: 'var(--brand-text-dim)' }}>Tasks automated</div>
            <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full" style={{ width: '94%', background: '#8DC54A' }} />
            </div>
          </div>

          {/* Risk Flags */}
          <div className="rounded-xl p-3 flex-1" style={{ background: 'rgba(22,18,10,0.92)', border: '1px solid rgba(201,168,76,0.18)' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Risk Flags</span>
              <ArrowUpRight size={11} style={{ color: 'var(--brand-text-dim)' }} />
            </div>
            <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>(Last 2 Weeks)</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--brand-text)' }}>7</div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Suppliers</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--brand-red)' }}>2 Critical</span>
            </div>
            <div className="flex items-end gap-px h-4">
              {[2,4,3,6,4,7,5,8,6,7,4,5].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{
                  height: `${v * 2}px`,
                  background: i > 9 ? '#D45A4A' : 'rgba(255,255,255,0.12)'
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
