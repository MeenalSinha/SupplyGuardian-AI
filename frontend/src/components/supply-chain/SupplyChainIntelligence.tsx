'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Globe, Wind, Ship, DollarSign, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const COMMODITIES = [
  { name: 'Lithium Carbonate', unit: '$/tonne', current: 14820, change: 8.4, trend: 'up', history: [11200, 11800, 12400, 12100, 13200, 14100, 13800, 14500, 14820] },
  { name: 'Copper', unit: '$/tonne', current: 9240, change: 1.2, trend: 'up', history: [8800, 8950, 9100, 9000, 9150, 9200, 9180, 9210, 9240] },
  { name: 'Semiconductors (NAND)', unit: 'Index', current: 142, change: -3.1, trend: 'down', history: [162, 158, 155, 151, 148, 147, 145, 143, 142] },
  { name: 'Steel HRC', unit: '$/tonne', current: 580, change: -0.8, trend: 'down', history: [610, 605, 598, 595, 590, 585, 582, 581, 580] },
  { name: 'Rare Earth (Mixed)', unit: '$/kg', current: 124, change: 2.1, trend: 'up', history: [108, 110, 114, 112, 116, 118, 120, 122, 124] },
  { name: 'Brent Crude (freight)', unit: '$/barrel', current: 82, change: 0.4, trend: 'stable', history: [78, 79, 80, 81, 82, 81, 82, 82, 82] },
]

const CURRENCIES = [
  { pair: 'USD/KRW', rate: 1342.5, change: -0.8, impact: 'Favourable for Korean suppliers' },
  { pair: 'USD/CNY', rate: 7.24, change: 1.2, impact: 'Depreciation pressure — monitor' },
  { pair: 'USD/EUR', rate: 0.92, change: -0.3, impact: 'Stable — EuroMetals pricing OK' },
  { pair: 'USD/JPY', rate: 149.8, change: 2.1, impact: 'Weak yen helps BattCo pricing' },
  { pair: 'USD/NOK', rate: 10.52, change: 0.4, impact: 'Slight NOK strength — Nordic costs up' },
]

const PORTS = [
  { name: 'Port of Busan', location: 'South Korea', congestion: 12, status: 'Clear', waitTime: '0.4 days' },
  { name: 'Port of Shenzhen', location: 'China', congestion: 78, status: 'Congested', waitTime: '4.2 days' },
  { name: 'Port of Rotterdam', location: 'Netherlands', congestion: 91, status: 'Strike', waitTime: '7-10 days' },
  { name: 'Port of Los Angeles', location: 'USA', congestion: 34, status: 'Moderate', waitTime: '1.8 days' },
  { name: 'Port of Hamburg', location: 'Germany', congestion: 18, status: 'Clear', waitTime: '0.6 days' },
  { name: 'Port of Yokohama', location: 'Japan', congestion: 22, status: 'Clear', waitTime: '0.8 days' },
]

const WEATHER_ALERTS = [
  { region: 'East China Sea', type: 'Typhoon Watch', severity: 'medium', impact: 'Seoul shipping may delay 1-2 days' },
  { region: 'North Atlantic', type: 'Winter Storm', severity: 'low', impact: 'Hamburg route minor delay risk' },
  { region: 'South China Sea', type: 'Fire conditions', severity: 'high', impact: 'Shenzhen logistics disrupted' },
]

const tooltipStyle = {
  contentStyle: { background: 'var(--brand-surface)', border: '1px solid var(--brand-border)', borderRadius: 8, fontSize: 11 },
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUp size={12} style={{ color: 'var(--brand-red)' }} />
  if (trend === 'down') return <TrendingDown size={12} style={{ color: 'var(--brand-green)' }} />
  return <Minus size={12} style={{ color: 'var(--brand-text-dim)' }} />
}

export default function SupplyChainIntelligence() {
  const [lithiumData] = useState(
    COMMODITIES[0].history.map((v, i) => ({ t: `W${i + 1}`, price: v }))
  )
  const [tick, setTick] = useState(0)
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 5000); return () => clearInterval(t) }, [])

  return (
    <div className="space-y-5">
      {/* Commodity prices */}
      <div className="grid grid-cols-2 gap-5">
        <div className="sg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Commodity Prices</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brand-green)' }} />
              <span className="text-xs" style={{ color: 'var(--brand-green)' }}>Live</span>
            </div>
          </div>
          <div className="space-y-3">
            {COMMODITIES.map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate" style={{ color: 'var(--brand-text)' }}>{c.name}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <TrendIcon trend={c.trend} />
                      <span className="text-xs font-bold" style={{ color: Math.abs(c.change) > 5 ? 'var(--brand-red)' : c.change > 0 ? 'var(--brand-amber)' : 'var(--brand-green)' }}>
                        {c.change > 0 ? '+' : ''}{c.change}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: 'var(--brand-text)' }}>
                      {c.current.toLocaleString()} <span style={{ color: 'var(--brand-text-dim)', fontWeight: 400 }}>{c.unit}</span>
                    </span>
                    <div className="flex gap-0.5 items-end h-4">
                      {c.history.slice(-6).map((v, i) => (
                        <div key={i} className="w-1.5 rounded-sm"
                          style={{
                            height: `${((v - Math.min(...c.history)) / (Math.max(...c.history) - Math.min(...c.history))) * 16}px`,
                            background: i === 5 ? 'var(--brand-gold)' : 'var(--brand-border)',
                            minHeight: '2px',
                          }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lithium price trend chart */}
        <div className="sg-card">
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--brand-text)' }}>Lithium Carbonate — 9 Week Trend</div>
          <div className="text-xs mb-4" style={{ color: 'var(--brand-red)' }}>+8.4% — AI recommends locking in VoltX contract now</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={lithiumData}>
              <defs>
                <linearGradient id="lithGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-red)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--brand-red)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={36} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}/t`, 'Lithium']} />
              <Area type="monotone" dataKey="price" stroke="var(--brand-red)" fill="url(#lithGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Port congestion */}
      <div className="sg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Port Congestion Monitor</div>
          <Ship size={14} style={{ color: 'var(--brand-text-dim)' }} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {PORTS.map(p => (
            <div key={p.name} className="rounded-lg p-3"
              style={{
                background: p.congestion > 70 ? 'rgba(212,90,74,0.05)' : p.congestion > 40 ? 'rgba(212,146,74,0.05)' : 'var(--brand-surface-light)',
                border: `1px solid ${p.congestion > 70 ? 'rgba(212,90,74,0.2)' : p.congestion > 40 ? 'rgba(212,146,74,0.2)' : 'var(--brand-border)'}`,
              }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{p.name}</span>
                <span className={`chip ${p.status === 'Strike' ? 'chip-red' : p.status === 'Congested' ? 'chip-amber' : p.status === 'Moderate' ? 'chip-gold' : 'chip-green'}`}
                  style={{ fontSize: '9px' }}>{p.status}</span>
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--brand-text-dim)' }}>{p.location}</div>
              <div className="progress-bar mb-1">
                <div className="progress-bar-fill" style={{
                  width: `${p.congestion}%`,
                  background: p.congestion > 70 ? 'var(--brand-red)' : p.congestion > 40 ? 'var(--brand-amber)' : 'var(--brand-green)',
                }} />
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{p.congestion}% capacity</span>
                <span style={{ color: 'var(--brand-text-muted)', fontSize: '10px' }}>Wait: {p.waitTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Currency + Weather */}
      <div className="grid grid-cols-2 gap-5">
        <div className="sg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Currency Risk Monitor</div>
            <DollarSign size={14} style={{ color: 'var(--brand-text-dim)' }} />
          </div>
          <div className="space-y-2.5">
            {CURRENCIES.map(c => (
              <div key={c.pair} className="flex items-center gap-3">
                <div className="w-16 text-xs font-bold font-mono flex-shrink-0" style={{ color: 'var(--brand-text)' }}>{c.pair}</div>
                <div className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--brand-text)' }}>{c.rate}</div>
                <span className="text-xs font-semibold flex-shrink-0"
                  style={{ color: Math.abs(c.change) > 1.5 ? 'var(--brand-red)' : c.change > 0 ? 'var(--brand-amber)' : 'var(--brand-green)' }}>
                  {c.change > 0 ? '+' : ''}{c.change}%
                </span>
                <span className="text-xs flex-1" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{c.impact}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Weather & Climate Alerts</div>
            <Wind size={14} style={{ color: 'var(--brand-text-dim)' }} />
          </div>
          <div className="space-y-3">
            {WEATHER_ALERTS.map(w => (
              <div key={w.region} className="rounded-lg p-3"
                style={{
                  background: w.severity === 'high' ? 'rgba(212,90,74,0.05)' : w.severity === 'medium' ? 'rgba(212,146,74,0.05)' : 'var(--brand-surface-light)',
                  border: `1px solid ${w.severity === 'high' ? 'rgba(212,90,74,0.2)' : w.severity === 'medium' ? 'rgba(212,146,74,0.2)' : 'var(--brand-border)'}`,
                }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`chip ${w.severity === 'high' ? 'chip-red' : w.severity === 'medium' ? 'chip-amber' : 'chip-muted'}`}
                    style={{ fontSize: '9px' }}>{w.type}</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{w.region}</span>
                </div>
                <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{w.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
