'use client'

import { useEffect, useState } from 'react'
import { Bot, AlertTriangle, CheckCircle, Truck, DollarSign, Shield } from 'lucide-react'

interface LiveEvent {
  type: string
  message: string
  time: string
  severity?: string
}

const SIMULATED_EVENTS: LiveEvent[] = [
  { type: 'agent', message: 'Negotiation Agent: Round 2 counter-offer submitted to VoltX Energy — $48/unit', time: 'now', severity: 'info' },
  { type: 'alert', message: 'DISRUPTION: Factory fire risk elevated in Shenzhen — 94% probability', time: '1m ago', severity: 'critical' },
  { type: 'approval', message: 'APR-001 awaiting signature — VoltX Energy $2.4M contract', time: '3m ago', severity: 'warning' },
  { type: 'shipment', message: 'SHP-004 delayed +3 days — Shenzhen port congestion', time: '5m ago', severity: 'warning' },
  { type: 'agent', message: 'Alternative Supplier Agent: TaipeiTech Corp identified as backup', time: '8m ago', severity: 'success' },
  { type: 'compliance', message: 'Risk Agent: AsiaTrade Co. OFAC match 78% — engagement blocked', time: '12m ago', severity: 'critical' },
  { type: 'agent', message: 'Market Intelligence: Lithium prices up 8.4% — lock-in recommended', time: '15m ago', severity: 'warning' },
  { type: 'shipment', message: 'SHP-002 cleared customs — Hamburg port, ETA 2 days', time: '22m ago', severity: 'success' },
  { type: 'agent', message: 'ESG Agent: VoltX Energy score 82/100 — APPROVED for engagement', time: '28m ago', severity: 'success' },
  { type: 'approval', message: 'APR-003 approved — $60K emergency budget increase for TaipeiTech', time: '35m ago', severity: 'success' },
]

const typeIcons: Record<string, React.ReactNode> = {
  agent: <Bot size={12} />,
  alert: <AlertTriangle size={12} />,
  approval: <CheckCircle size={12} />,
  shipment: <Truck size={12} />,
  compliance: <Shield size={12} />,
}

const severityColors: Record<string, string> = {
  critical: 'var(--brand-red)',
  warning: 'var(--brand-amber)',
  success: 'var(--brand-green)',
  info: 'var(--brand-gold)',
}

export default function LiveFeed() {
  const [events, setEvents] = useState<LiveEvent[]>(SIMULATED_EVENTS.slice(0, 5))
  const [newEvent, setNewEvent] = useState<LiveEvent | null>(null)

  useEffect(() => {
    // Simulate incoming events
    const extras = [
      { type: 'agent', message: 'Disruption Agent: Rotterdam port strike rerouted via Hamburg', time: 'just now', severity: 'success' },
      { type: 'compliance', message: 'Risk Agent: CapEx Solutions ISO 9001 renewal verified', time: 'just now', severity: 'success' },
      { type: 'agent', message: 'Finance Agent: Q2 procurement budget utilization at 62%', time: 'just now', severity: 'info' },
    ]
    let idx = 0
    const interval = setInterval(() => {
      if (idx < extras.length) {
        const ev = extras[idx]
        setNewEvent(ev)
        setEvents(prev => [ev, ...prev].slice(0, 8))
        idx++
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Live Event Feed</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brand-green)' }} />
          <span className="text-xs" style={{ color: 'var(--brand-green)' }}>Live</span>
        </div>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {events.map((ev, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 rounded-lg p-2.5 transition-all"
            style={{
              background: i === 0 && newEvent ? 'rgba(201,168,76,0.06)' : 'var(--brand-surface-light)',
              border: `1px solid ${i === 0 && newEvent ? 'rgba(201,168,76,0.2)' : 'var(--brand-border)'}`,
            }}
          >
            <div className="flex-shrink-0 mt-0.5" style={{ color: severityColors[ev.severity || 'info'] }}>
              {typeIcons[ev.type] || <Bot size={12} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-snug" style={{ color: 'var(--brand-text)' }}>{ev.message}</p>
            </div>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{ev.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
