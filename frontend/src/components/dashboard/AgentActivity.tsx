'use client'

import { useState, useEffect } from 'react'
import { Bot, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const agents = [
  { name: 'Procurement Need Agent', status: 'active', task: 'Monitoring lithium battery inventory levels', lastAction: '12s ago' },
  { name: 'Supplier Discovery Agent', status: 'active', task: 'Searching 847 supplier databases globally', lastAction: '34s ago' },
  { name: 'Vendor Intelligence Agent', status: 'idle', task: 'Awaiting new supplier candidates', lastAction: '2m ago' },
  { name: 'Negotiation Agent', status: 'active', task: 'Round 2 negotiation with VoltX Energy', lastAction: '5s ago' },
  { name: 'Risk & Compliance Agent', status: 'alert', task: 'OFAC match flagged - AsiaTrade Co.', lastAction: '8m ago' },
  { name: 'Contract Intelligence Agent', status: 'idle', task: 'Contract review queue: 2 pending', lastAction: '15m ago' },
  { name: 'ESG Agent', status: 'active', task: 'Calculating carbon footprint for 12 suppliers', lastAction: '1m ago' },
  { name: 'Market Intelligence Agent', status: 'active', task: 'Monitoring lithium commodity prices', lastAction: '18s ago' },
  { name: 'Disruption Prediction Agent', status: 'alert', task: 'Factory fire risk elevated in Shenzhen region', lastAction: '3m ago' },
  { name: 'Alternative Supplier Agent', status: 'active', task: 'Identifying backup lithium suppliers', lastAction: '42s ago' },
  { name: 'Logistics Optimization Agent', status: 'idle', task: 'Route optimization ready for execution', lastAction: '8m ago' },
  { name: 'Executive Advisor Agent', status: 'idle', task: 'Briefing report compiled for review', lastAction: '22m ago' },
]

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'var(--brand-green)',
    idle: 'var(--brand-border-light)',
    alert: 'var(--brand-red)',
  }
  return (
    <div className="relative">
      <div className="w-2 h-2 rounded-full" style={{ background: colors[status] }} />
      {status === 'active' && (
        <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ background: colors[status], opacity: 0.4 }} />
      )}
    </div>
  )
}

export default function AgentActivity() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 3000)
    return () => clearInterval(t)
  }, [])

  const active = agents.filter((a) => a.status === 'active').length
  const alerts = agents.filter((a) => a.status === 'alert').length

  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>AI Agent Ecosystem</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brand-green)' }} />
            <span className="text-xs" style={{ color: 'var(--brand-green)' }}>{active} Active</span>
          </div>
          {alerts > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertCircle size={12} style={{ color: 'var(--brand-red)' }} />
              <span className="text-xs" style={{ color: 'var(--brand-red)' }}>{alerts} Alert</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>
            {agents.length} agents running
          </span>
          <Activity size={13} style={{ color: 'var(--brand-text-dim)' }} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="rounded-lg p-3 transition-all"
            style={{
              background: agent.status === 'active'
                ? 'rgba(124,184,74,0.05)'
                : agent.status === 'alert'
                ? 'rgba(212,90,74,0.05)'
                : 'var(--brand-surface-light)',
              border: `1px solid ${
                agent.status === 'active'
                  ? 'rgba(124,184,74,0.2)'
                  : agent.status === 'alert'
                  ? 'rgba(212,90,74,0.2)'
                  : 'var(--brand-border)'
              }`,
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Bot size={11} style={{ color: agent.status === 'active' ? 'var(--brand-gold)' : 'var(--brand-text-dim)' }} />
                <StatusDot status={agent.status} />
              </div>
              <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{agent.lastAction}</span>
            </div>
            <div className="text-xs font-semibold mb-1 leading-tight" style={{ color: 'var(--brand-text)', fontSize: '11px' }}>
              {agent.name}
            </div>
            <div className="text-xs leading-tight" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>
              {agent.task}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
