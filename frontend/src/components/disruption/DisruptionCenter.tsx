'use client'

import { useState } from 'react'
import { Zap, AlertTriangle, TrendingUp, Bot, Clock, CheckCircle, ExternalLink } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const events = [
  {
    id: 'EVT-001', type: 'Factory Fire', severity: 'Critical',
    title: 'Factory fire reported at Shenzhen Industrial Zone',
    location: 'Shenzhen, China', detected: '2h ago',
    impact: 'SinoTech Ltd. primary facility affected. 45% capacity reduction.',
    probability: 94, affectedSuppliers: ['SinoTech Ltd.', 'Global Parts Ltd.'],
    aiAction: 'Alternative suppliers identified. Negotiation initiated with TaipeiTech Corp.',
    status: 'Active Response'
  },
  {
    id: 'EVT-002', type: 'Port Strike', severity: 'High',
    title: 'Dockworkers strike at Port of Rotterdam',
    location: 'Rotterdam, Netherlands', detected: '6h ago',
    impact: 'EuroMetals AG shipment delayed 7-10 days. $145K order affected.',
    probability: 87, affectedSuppliers: ['EuroMetals AG', 'Nordic Metals'],
    aiAction: 'Rerouting via Hamburg port. Estimated delay reduced to 3 days.',
    status: 'Mitigating'
  },
  {
    id: 'EVT-003', type: 'Geopolitical', severity: 'Medium',
    title: 'Taiwan Strait tension escalation',
    location: 'Taiwan Strait', detected: '1d ago',
    impact: 'Global Parts Ltd. risk score elevated. Potential supply disruption.',
    probability: 62, affectedSuppliers: ['Global Parts Ltd.'],
    aiAction: 'Diversification strategy prepared. 3 alternative suppliers pre-qualified.',
    status: 'Monitoring'
  },
  {
    id: 'EVT-004', type: 'Weather', severity: 'Low',
    title: 'Typhoon track approaching Korean peninsula',
    location: 'East China Sea', detected: '3d ago',
    impact: 'VoltX Energy shipment SHP-001 may experience 1-2 day delay.',
    probability: 38, affectedSuppliers: ['VoltX Energy'],
    aiAction: 'Monitoring track. Contingency logistics route prepared.',
    status: 'Monitoring'
  },
]

const disruptionTimeline = [
  { time: '00:00', score: 18 }, { time: '04:00', score: 22 }, { time: '08:00', score: 19 },
  { time: '10:30', score: 45 }, { time: '12:00', score: 68 }, { time: '14:00', score: 72 },
  { time: '16:00', score: 65 }, { time: '18:00', score: 58 }, { time: '20:00', score: 52 },
  { time: '22:00', score: 48 }, { time: 'Now', score: 46 },
]

const severityColors: Record<string, string> = {
  Critical: 'chip-red',
  High: 'chip-amber',
  Medium: 'chip-gold',
  Low: 'chip-muted',
}

const statusColors: Record<string, string> = {
  'Active Response': 'chip-red',
  'Mitigating': 'chip-amber',
  'Monitoring': 'chip-muted',
  'Resolved': 'chip-green',
}

export default function DisruptionCenter() {
  const [selected, setSelected] = useState(events[0])

  return (
    <div className="space-y-5">
      {/* Top alerts summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="sg-card" style={{ borderColor: 'rgba(212,90,74,0.3)', background: 'rgba(212,90,74,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={13} style={{ color: 'var(--brand-red)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>Critical Events</span>
          </div>
          <div className="text-3xl font-black" style={{ color: 'var(--brand-red)' }}>1</div>
          <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Active response underway</div>
        </div>
        <div className="sg-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={13} style={{ color: 'var(--brand-amber)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>Under Monitoring</span>
          </div>
          <div className="text-3xl font-black" style={{ color: 'var(--brand-amber)' }}>3</div>
          <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>AI agents watching</div>
        </div>
        <div className="sg-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={13} style={{ color: 'var(--brand-gold)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>Disruption Risk Score</span>
          </div>
          <div className="text-3xl font-black" style={{ color: 'var(--brand-gold)' }}>46</div>
          <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Elevated (was 18 this morning)</div>
        </div>
        <div className="sg-card">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={13} style={{ color: 'var(--brand-green)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>AI Responses Active</span>
          </div>
          <div className="text-3xl font-black" style={{ color: 'var(--brand-green)' }}>2</div>
          <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Auto-mitigation running</div>
        </div>
      </div>

      {/* Disruption risk timeline */}
      <div className="sg-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Disruption Risk Score - Today</span>
          <span className="chip chip-amber text-xs">Elevated</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={disruptionTimeline}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand-amber)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--brand-amber)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} width={25} />
            <Tooltip
              contentStyle={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)', borderRadius: 8, fontSize: 11 }}
            />
            <Area type="monotone" dataKey="score" stroke="var(--brand-amber)" strokeWidth={2} fill="url(#riskGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Events list + detail */}
      <div className="grid grid-cols-3 gap-5">
        <div className="space-y-3">
          <div className="section-header">Active Events ({events.length})</div>
          {events.map((e) => (
            <div
              key={e.id}
              className="sg-card cursor-pointer transition-all"
              style={{ border: selected.id === e.id ? '1px solid var(--brand-gold-dark)' : undefined }}
              onClick={() => setSelected(e)}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className={`chip ${severityColors[e.severity]}`} style={{ fontSize: '10px' }}>{e.severity}</span>
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{e.detected}</span>
              </div>
              <div className="text-xs font-semibold mb-1 leading-snug" style={{ color: 'var(--brand-text)' }}>{e.title}</div>
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>{e.location}</div>
              <div className="flex items-center justify-between mt-2">
                <span className={`chip ${statusColors[e.status]}`} style={{ fontSize: '9px' }}>{e.status}</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-amber)' }}>{e.probability}% prob.</span>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-2 space-y-4">
          <div className="sg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`chip ${severityColors[selected.severity]}`}>{selected.type}</span>
                  <span className={`chip ${statusColors[selected.status]}`} style={{ fontSize: '10px' }}>{selected.status}</span>
                </div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--brand-text)' }}>{selected.title}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>
                  {selected.location} · Detected {selected.detected}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black" style={{ color: 'var(--brand-amber)' }}>{selected.probability}%</div>
                <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Disruption probability</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-lg p-3" style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
                <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--brand-text)' }}>Predicted Impact</div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--brand-text-muted)' }}>{selected.impact}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
                <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--brand-text)' }}>Affected Suppliers</div>
                <div className="space-y-1">
                  {selected.affectedSuppliers.map((s) => (
                    <div key={s} className="chip chip-amber" style={{ fontSize: '10px', display: 'inline-flex', marginRight: 4 }}>{s}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg p-3" style={{ background: 'rgba(124,184,74,0.05)', border: '1px solid rgba(124,184,74,0.2)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Bot size={12} style={{ color: 'var(--brand-gold)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>AI Agent Response</span>
                <span className="chip chip-green" style={{ fontSize: '9px' }}>Automated</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--brand-text-muted)' }}>{selected.aiAction}</p>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
                <ExternalLink size={12} /> View Full Report
              </button>
              <button className="btn-gold text-xs px-3 py-2">Approve AI Response</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
