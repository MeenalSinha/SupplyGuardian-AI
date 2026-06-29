'use client'

import { useEffect, useState } from 'react'
import { Bot, ArrowRight, Activity } from 'lucide-react'

const AGENTS = [
  { id: 'procurement', label: 'Procurement Need', status: 'active', x: 0, y: 0, color: 'var(--brand-amber)' },
  { id: 'discovery', label: 'Supplier Discovery', status: 'active', x: 1, y: 0, color: 'var(--brand-blue)' },
  { id: 'vendor', label: 'Vendor Intelligence', status: 'idle', x: 2, y: 0, color: 'var(--brand-gold)' },
  { id: 'negotiation', label: 'Negotiation', status: 'active', x: 3, y: 0, color: 'var(--brand-green)' },
  { id: 'risk', label: 'Risk & Compliance', status: 'alert', x: 0, y: 1, color: 'var(--brand-red)' },
  { id: 'contract', label: 'Contract Intelligence', status: 'idle', x: 1, y: 1, color: 'var(--brand-gold)' },
  { id: 'esg', label: 'ESG Agent', status: 'active', x: 2, y: 1, color: 'var(--brand-green)' },
  { id: 'market', label: 'Market Intelligence', status: 'active', x: 3, y: 1, color: 'var(--brand-gold)' },
  { id: 'disruption', label: 'Disruption Prediction', status: 'alert', x: 0, y: 2, color: 'var(--brand-red)' },
  { id: 'alternative', label: 'Alternative Supplier', status: 'active', x: 1, y: 2, color: 'var(--brand-green)' },
  { id: 'logistics', label: 'Logistics Optimization', status: 'idle', x: 2, y: 2, color: 'var(--brand-blue)' },
  { id: 'finance', label: 'Finance', status: 'idle', x: 3, y: 2, color: 'var(--brand-text-muted)' },
  { id: 'advisor', label: 'Executive Advisor', status: 'idle', x: 1.5, y: 3, color: 'var(--brand-purple)' },
]

const FLOWS = [
  ['procurement', 'discovery'],
  ['discovery', 'vendor'],
  ['vendor', 'negotiation'],
  ['vendor', 'risk'],
  ['risk', 'contract'],
  ['vendor', 'esg'],
  ['market', 'negotiation'],
  ['disruption', 'alternative'],
  ['alternative', 'logistics'],
  ['logistics', 'finance'],
  ['negotiation', 'advisor'],
  ['risk', 'advisor'],
  ['finance', 'advisor'],
]

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--brand-green)',
  idle: 'var(--brand-border-light)',
  alert: 'var(--brand-red)',
}

export default function AgentFlowDiagram() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2000)
    return () => clearInterval(t)
  }, [])

  const activeCount = AGENTS.filter(a => a.status === 'active').length
  const alertCount = AGENTS.filter(a => a.status === 'alert').length

  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>AI Agent Orchestration Network</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
            {AGENTS.length} specialized agents collaborating in real-time
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--brand-green)' }} />
            <span className="text-xs" style={{ color: 'var(--brand-green)' }}>{activeCount} Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-red)' }} />
            <span className="text-xs" style={{ color: 'var(--brand-red)' }}>{alertCount} Alert</span>
          </div>
          <Activity size={13} style={{ color: 'var(--brand-text-dim)' }} />
        </div>
      </div>

      {/* Agent grid layout */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {AGENTS.filter(a => a.y < 3).map(agent => (
          <div
            key={agent.id}
            className="rounded-xl p-3 transition-all"
            style={{
              background: agent.status === 'active'
                ? 'rgba(124,184,74,0.05)'
                : agent.status === 'alert'
                ? 'rgba(212,90,74,0.05)'
                : 'var(--brand-surface-light)',
              border: `1px solid ${
                agent.status === 'active'
                  ? 'rgba(124,184,74,0.25)'
                  : agent.status === 'alert'
                  ? 'rgba(212,90,74,0.25)'
                  : 'var(--brand-border)'
              }`,
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="relative">
                <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[agent.status] }} />
                {agent.status === 'active' && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-40"
                    style={{ background: STATUS_COLORS[agent.status] }} />
                )}
              </div>
              <Bot size={11} style={{ color: agent.color }} />
            </div>
            <div className="text-xs font-semibold leading-tight" style={{ color: 'var(--brand-text)', fontSize: '11px' }}>
              {agent.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: STATUS_COLORS[agent.status], fontSize: '9px', fontWeight: 600, textTransform: 'uppercase' }}>
              {agent.status}
            </div>
          </div>
        ))}
      </div>

      {/* Executive Advisor at bottom - full width */}
      {AGENTS.filter(a => a.y >= 3).map(agent => (
        <div
          key={agent.id}
          className="rounded-xl p-3 flex items-center gap-4"
          style={{
            background: 'rgba(138,74,212,0.05)',
            border: '1px solid rgba(138,74,212,0.2)',
          }}
        >
          <Bot size={16} style={{ color: 'var(--brand-purple)' }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Executive Advisor Agent</div>
            <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
              Synthesizes all agent outputs into executive briefings, decision recommendations, and risk summaries
            </div>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <ArrowRight size={14} style={{ color: 'var(--brand-text-dim)' }} />
            <span className="text-xs chip chip-muted">C-Suite Output</span>
          </div>
        </div>
      ))}

      {/* Flow indicators */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--brand-border)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--brand-text-dim)' }}>Active Message Flows</div>
        <div className="flex flex-wrap gap-1.5">
          {FLOWS.slice(0, 8).map(([from, to]) => {
            const fromAgent = AGENTS.find(a => a.id === from)
            const toAgent = AGENTS.find(a => a.id === to)
            if (!fromAgent || !toAgent) return null
            const isActive = fromAgent.status === 'active' || toAgent.status === 'active'
            return (
              <div
                key={`${from}-${to}`}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                style={{
                  background: isActive ? 'rgba(201,168,76,0.08)' : 'var(--brand-surface-light)',
                  border: `1px solid ${isActive ? 'rgba(201,168,76,0.2)' : 'var(--brand-border)'}`,
                  color: isActive ? 'var(--brand-gold)' : 'var(--brand-text-dim)',
                  fontSize: '10px',
                }}
              >
                {fromAgent.label.split(' ')[0]}
                <ArrowRight size={9} />
                {toAgent.label.split(' ')[0]}
                {isActive && <div className="w-1 h-1 rounded-full ml-1 animate-pulse" style={{ background: 'var(--brand-gold)' }} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
