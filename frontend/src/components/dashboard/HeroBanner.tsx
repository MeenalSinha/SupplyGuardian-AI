'use client'

import { useState } from 'react'
import { TrendingUp, Package, Truck } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const salesData = [
  { month: 'Dec', value: 52 },
  { month: 'Jan', value: 68 },
  { month: 'Feb', value: 61 },
  { month: 'Mar', value: 94 },
  { month: 'Apr', value: 72, dim: true },
  { month: 'May', value: 58, dim: true },
]

type TabKey = 'Today' | 'Week' | 'Month'

const stockData: Record<TabKey, { units: string; usd: string; shipments: string; unitsDelta: string; usdDelta: string; shipDelta: string }> = {
  Today: { units: '2,480', usd: '8,900', shipments: '24', unitsDelta: '+6.2%', usdDelta: '+4.6%', shipDelta: '+8.9%' },
  Week: { units: '17,340', usd: '62,300', shipments: '168', unitsDelta: '+3.1%', usdDelta: '+2.8%', shipDelta: '+5.2%' },
  Month: { units: '74,200', usd: '248,900', shipments: '720', unitsDelta: '+8.2%', usdDelta: '+6.4%', shipDelta: '+9.1%' },
}

export default function HeroBanner() {
  const [activeTab, setActiveTab] = useState<TabKey>('Today')
  const stock = stockData[activeTab]

  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ height: '360px' }}>
      {/* Background image simulation with gradient */}
      <div className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #2C2518 0%, #1A1510 40%, #0E0C08 100%)',
        }}
      />
      {/* Decorative conveyor belt visual */}
      <div className="absolute right-0 top-0 bottom-0 w-2/3"
        style={{
          background: 'linear-gradient(90deg, #1A1510 0%, transparent 30%)',
          zIndex: 2,
        }}
      />
      <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden">
        <div className="w-full h-full opacity-40"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(201,168,76,0.05) 0px, rgba(201,168,76,0.05) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(201,168,76,0.03) 0px, rgba(201,168,76,0.03) 1px, transparent 1px, transparent 40px)',
          }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Hero text */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-black leading-none tracking-tight" style={{ color: 'var(--brand-text)' }}>
              OWN
              <br />
              THE OUTCOME
            </h1>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="chip chip-gold text-xs">AI-Powered Platform</span>
          </div>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--brand-text-muted)' }}>
            Autonomous procurement, intelligent suppliers, resilient supply chains.
          </p>
        </div>

        {/* Sales Chart */}
        <div className="sg-card" style={{ padding: '14px', maxWidth: '220px', background: 'rgba(30,28,24,0.9)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Sales Increase</span>
            <TrendingUp size={12} style={{ color: 'var(--brand-text-dim)' }} />
          </div>
          <div className="chip chip-green text-xs mb-3">+26%</div>
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={salesData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {salesData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.month === 'Mar' ? 'var(--brand-gold)' : entry.dim ? 'var(--brand-border)' : '#4A4535'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right side stats panel */}
      <div className="absolute top-4 right-4 z-10 space-y-3">
        {/* Incoming Stock card */}
        <div className="rounded-xl p-4 min-w-[260px]" style={{ background: 'rgba(30,28,24,0.95)', border: '1px solid var(--brand-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Incoming Stock</span>
            <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>(This Week)</span>
          </div>
          <div className="flex gap-4">
            <div>
              <div className="text-xl font-bold leading-none" style={{ color: 'var(--brand-text)' }}>{stock.units}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Units</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-green)' }}>{stock.unitsDelta}</span>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold leading-none" style={{ color: 'var(--brand-text)' }}>{stock.usd}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>USD</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-green)' }}>{stock.usdDelta}</span>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold leading-none" style={{ color: 'var(--brand-text)' }}>{stock.shipments}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Shipments</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-green)' }}>{stock.shipDelta}</span>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mt-3">
            {(['Today', 'Week', 'Month'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background: activeTab === tab ? 'var(--brand-surface-light)' : 'transparent',
                  color: activeTab === tab ? 'var(--brand-text)' : 'var(--brand-text-dim)',
                  border: activeTab === tab ? '1px solid var(--brand-border-light)' : '1px solid transparent',
                }}
              >
                {tab}
              </button>
            ))}
            <button className="ml-auto px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{ background: 'var(--brand-gold)', color: 'var(--brand-carbon)' }}>
              View Details
            </button>
          </div>
        </div>

        {/* Mini stat cards row */}
        <div className="flex gap-3">
          <div className="rounded-xl p-3 flex-1" style={{ background: 'rgba(30,28,24,0.95)', border: '1px solid var(--brand-border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Warehouse Load</span>
              <Package size={11} style={{ color: 'var(--brand-text-dim)' }} />
            </div>
            <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Warehouse No. 4</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--brand-text)' }}>65%</div>
            <div className="text-xs mb-1" style={{ color: 'var(--brand-text-dim)' }}>Load</div>
            <div className="progress-bar">
              <div className="progress-bar-fill green" style={{ width: '65%' }} />
            </div>
          </div>

          <div className="rounded-xl p-3 flex-1" style={{ background: 'rgba(30,28,24,0.95)', border: '1px solid var(--brand-border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Write-Offs</span>
              <Truck size={11} style={{ color: 'var(--brand-text-dim)' }} />
            </div>
            <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>(Last 2 Weeks)</div>
            <div className="text-2xl font-bold mt-1" style={{ color: 'var(--brand-text)' }}>1,240</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Units</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--brand-red)' }}>-2.3%</span>
            </div>
            <div className="flex items-end gap-0.5 h-5 mt-1">
              {[3, 5, 4, 7, 5, 8, 6, 9, 7, 8, 5, 6].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${v * 2}px`, background: i > 9 ? 'var(--brand-gold)' : 'var(--brand-border)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
