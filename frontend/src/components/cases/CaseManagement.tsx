'use client'

import { useState } from 'react'
import { FileText, Clock, AlertTriangle, CheckCircle, ChevronRight, MessageSquare, User, Bot } from 'lucide-react'

const CASE_STAGES = ['Open', 'Investigation', 'Escalated', 'Pending Approval', 'Resolved', 'Closed']

const cases = [
  {
    id: 'CASE-001', type: 'Sanctions Match', title: 'OFAC SDN Match - AsiaTrade Co.',
    priority: 'Critical', stage: 'Pending Approval', opened: '2h ago',
    description: '78% confidence match on OFAC SDN sanctions list. Engagement blocked. Legal review required.',
    stageIndex: 3,
    history: [
      { actor: 'Risk & Compliance Agent', actorType: 'ai', action: 'Case opened — OFAC match detected (78%)', time: '2h ago' },
      { actor: 'Risk & Compliance Agent', actorType: 'ai', action: 'Supplier engagement automatically blocked', time: '2h ago' },
      { actor: 'Risk & Compliance Agent', actorType: 'ai', action: 'Sanctions report generated and attached', time: '1h 55m ago' },
      { actor: 'System', actorType: 'system', action: 'Escalated to legal team per policy P-RFC-004', time: '1h 50m ago' },
      { actor: 'J. Doe', actorType: 'human', action: 'Case reviewed — awaiting legal opinion document', time: '30m ago' },
    ],
  },
  {
    id: 'CASE-002', type: 'Disruption', title: 'Factory Fire — Shenzhen Industrial Zone',
    priority: 'High', stage: 'Investigation', opened: '3h ago',
    description: 'SinoTech Ltd. primary facility fire reported. Capacity at 45%. 30+ day impact estimated.',
    stageIndex: 1,
    history: [
      { actor: 'Disruption Prediction Agent', actorType: 'ai', action: 'Fire event detected via news feed monitoring', time: '3h ago' },
      { actor: 'Disruption Prediction Agent', actorType: 'ai', action: 'Probability confirmed at 94%. Impact modeled.', time: '2h 55m ago' },
      { actor: 'Alternative Supplier Agent', actorType: 'ai', action: 'Backup search initiated. TaipeiTech identified.', time: '2h 45m ago' },
      { actor: 'Market Intelligence Agent', actorType: 'ai', action: 'Semiconductor price impact analysis completed', time: '2h 30m ago' },
    ],
  },
  {
    id: 'CASE-003', type: 'Contract Stall', title: 'Negotiation Stalled — Nordic Metals',
    priority: 'Medium', stage: 'Escalated', opened: '6h ago',
    description: 'Rare earth negotiation stalled at $121/unit. Supplier requesting 2-year commitment.',
    stageIndex: 2,
    history: [
      { actor: 'Negotiation Agent', actorType: 'ai', action: 'Stall detected after 4h no supplier response', time: '6h ago' },
      { actor: 'Negotiation Agent', actorType: 'ai', action: 'Revised counter-offer sent. Payment terms adjusted.', time: '5h ago' },
      { actor: 'System', actorType: 'system', action: 'Escalated to procurement manager per SLA policy', time: '4h ago' },
      { actor: 'J. Doe', actorType: 'human', action: 'Authorized 18-month commitment as compromise', time: '2h ago' },
    ],
  },
  {
    id: 'CASE-004', type: 'Shipment Delay', title: 'SHP-004 Delayed — Shenzhen Port Congestion',
    priority: 'Medium', stage: 'Investigation', opened: '5h ago',
    description: 'SinoTech shipment SHP-004 delayed +3 days due to port congestion from factory fire aftermath.',
    stageIndex: 1,
    history: [
      { actor: 'Logistics Optimization Agent', actorType: 'ai', action: 'Delay detected via port congestion monitoring', time: '5h ago' },
      { actor: 'Logistics Optimization Agent', actorType: 'ai', action: 'Alternative routing assessed — no viable option', time: '4h 45m ago' },
      { actor: 'System', actorType: 'system', action: 'Customer notification queued via UiPath robot', time: '4h 30m ago' },
    ],
  },
  {
    id: 'CASE-005', type: 'Budget Override', title: 'Emergency Budget — TaipeiTech Corp',
    priority: 'High', stage: 'Pending Approval', opened: '1h ago',
    description: '$60K budget increase required for emergency TaipeiTech procurement. Cost avoidance: $2.1M.',
    stageIndex: 3,
    history: [
      { actor: 'Finance Agent', actorType: 'ai', action: 'Budget threshold exceeded by $60,000', time: '1h ago' },
      { actor: 'Executive Advisor Agent', actorType: 'ai', action: 'ROI analysis: $60K cost vs $2.1M avoidance (35x)', time: '58m ago' },
      { actor: 'System', actorType: 'system', action: 'Approval request APR-003 created and assigned to J. Doe', time: '55m ago' },
    ],
  },
]

const priorityColors: Record<string, string> = {
  Critical: 'chip-red',
  High: 'chip-amber',
  Medium: 'chip-gold',
  Low: 'chip-muted',
}

const actorColors: Record<string, string> = {
  ai: 'var(--brand-gold)',
  human: '#4A8CD4',
  system: 'var(--brand-text-dim)',
}

export default function CaseManagement() {
  const [selected, setSelected] = useState(cases[0])

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Open Cases', value: cases.filter(c => c.stage !== 'Closed').length, color: 'var(--brand-text)' },
          { label: 'Critical', value: cases.filter(c => c.priority === 'Critical').length, color: 'var(--brand-red)' },
          { label: 'Pending Approval', value: cases.filter(c => c.stage === 'Pending Approval').length, color: 'var(--brand-amber)' },
          { label: 'Avg Resolution', value: '2.4h', color: 'var(--brand-green)' },
        ].map(m => (
          <div key={m.label} className="sg-card" style={{ padding: '14px' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--brand-text-dim)' }}>{m.label}</div>
            <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Case list */}
        <div className="space-y-2">
          <div className="section-header">Active Cases ({cases.length})</div>
          {cases.map(c => (
            <div
              key={c.id}
              className="sg-card cursor-pointer transition-all"
              style={{ border: selected.id === c.id ? '1px solid var(--brand-gold-dark)' : undefined }}
              onClick={() => setSelected(c)}
            >
              <div className="flex items-start justify-between mb-1">
                <span className={`chip ${priorityColors[c.priority]}`} style={{ fontSize: '9px' }}>{c.priority}</span>
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{c.opened}</span>
              </div>
              <div className="text-xs font-semibold mb-1 leading-tight" style={{ color: 'var(--brand-text)' }}>{c.title}</div>
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>{c.type}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="chip chip-muted" style={{ fontSize: '9px' }}>{c.stage}</span>
                <span className="text-xs font-mono" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{c.id}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Case detail */}
        <div className="col-span-2 space-y-4">
          {/* Stage progress */}
          <div className="sg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="chip chip-muted text-xs mb-2">{selected.type} · {selected.id}</div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--brand-text)' }}>{selected.title}</h3>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--brand-text-muted)' }}>{selected.description}</p>
              </div>
              <span className={`chip ${priorityColors[selected.priority]} flex-shrink-0`}>{selected.priority}</span>
            </div>

            {/* Stage pipeline */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {CASE_STAGES.map((stage, idx) => (
                <div key={stage} className="flex items-center gap-1 flex-shrink-0">
                  <div
                    className="px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
                    style={{
                      background: idx < selected.stageIndex
                        ? 'rgba(124,184,74,0.1)'
                        : idx === selected.stageIndex
                        ? 'rgba(201,168,76,0.15)'
                        : 'var(--brand-surface-light)',
                      color: idx < selected.stageIndex
                        ? 'var(--brand-green)'
                        : idx === selected.stageIndex
                        ? 'var(--brand-gold)'
                        : 'var(--brand-text-dim)',
                      border: `1px solid ${
                        idx < selected.stageIndex
                          ? 'rgba(124,184,74,0.3)'
                          : idx === selected.stageIndex
                          ? 'rgba(201,168,76,0.3)'
                          : 'var(--brand-border)'
                      }`,
                      fontSize: '10px',
                    }}
                  >
                    {idx < selected.stageIndex && <CheckCircle size={9} className="inline mr-1" />}
                    {stage}
                  </div>
                  {idx < CASE_STAGES.length - 1 && (
                    <ChevronRight size={10} style={{ color: 'var(--brand-text-dim)', flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Audit history */}
          <div className="sg-card">
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>Case Activity Timeline</div>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: 'var(--brand-border)' }} />
              <div className="space-y-4">
                {selected.history.map((h, i) => (
                  <div key={i} className="relative flex gap-3">
                    <div
                      className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'var(--brand-surface)',
                        border: `1px solid ${actorColors[h.actorType]}`,
                      }}
                    >
                      {h.actorType === 'ai'
                        ? <Bot size={10} style={{ color: actorColors[h.actorType] }} />
                        : h.actorType === 'human'
                        ? <User size={10} style={{ color: actorColors[h.actorType] }} />
                        : <CheckCircle size={10} style={{ color: actorColors[h.actorType] }} />
                      }
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold" style={{ color: actorColors[h.actorType] }}>{h.actor}</span>
                        <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{h.time}</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>{h.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
