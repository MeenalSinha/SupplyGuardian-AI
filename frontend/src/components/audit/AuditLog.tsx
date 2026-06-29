'use client'

import { useState } from 'react'
import { Bot, User, Server, Shield, Download, Search } from 'lucide-react'

const logs = [
  { id: 'AUD-0892', time: 'Mar 21, 2026 10:18', actor: 'Negotiation Agent', actorType: 'ai', action: 'Counter-offer submitted', detail: 'VoltX Energy - $48/unit, 48-day payment terms. Round 2.', category: 'Negotiation', caseId: 'NEG-001' },
  { id: 'AUD-0891', time: 'Mar 21, 2026 10:05', actor: 'VoltX Energy (Supplier)', actorType: 'external', action: 'Offer accepted (partial)', detail: 'Accepted $49/unit. Counter-proposed 50-day payment terms.', category: 'Negotiation', caseId: 'NEG-001' },
  { id: 'AUD-0890', time: 'Mar 21, 2026 09:55', actor: 'Risk & Compliance Agent', actorType: 'ai', action: 'OFAC sanction match flagged', detail: 'AsiaTrade Co. - 78% name match on SDN list. Escalated to human review.', category: 'Compliance', caseId: 'APR-002' },
  { id: 'AUD-0889', time: 'Mar 21, 2026 09:22', actor: 'Negotiation Agent', actorType: 'ai', action: 'Counter-offer submitted', detail: 'VoltX Energy - $49/unit, 45-day terms, quality guarantee clause added.', category: 'Negotiation', caseId: 'NEG-001' },
  { id: 'AUD-0888', time: 'Mar 21, 2026 09:14', actor: 'VoltX Energy (Supplier)', actorType: 'external', action: 'Initial counter-offer', detail: '$52/unit for 30K+ units. 60-day payment terms.', category: 'Negotiation', caseId: 'NEG-001' },
  { id: 'AUD-0887', time: 'Mar 21, 2026 09:00', actor: 'Negotiation Agent', actorType: 'ai', action: 'Negotiation session opened', detail: 'Opening offer: $55/unit based on market benchmark. Procurement case PC-0321.', category: 'Negotiation', caseId: 'NEG-001' },
  { id: 'AUD-0886', time: 'Mar 21, 2026 08:52', actor: 'Supplier Discovery Agent', actorType: 'ai', action: 'Supplier ranking completed', detail: '14 suppliers evaluated. Top 3 selected for negotiation: VoltX, BattCo, KoreaPower.', category: 'Discovery', caseId: 'PC-0321' },
  { id: 'AUD-0885', time: 'Mar 21, 2026 08:30', actor: 'Procurement Need Agent', actorType: 'ai', action: 'Case created', detail: 'Lithium battery inventory at 12% (threshold: 20%). Procurement case PC-0321 opened automatically.', category: 'Procurement', caseId: 'PC-0321' },
  { id: 'AUD-0884', time: 'Mar 20, 2026 16:30', actor: 'Disruption Prediction Agent', actorType: 'ai', action: 'Disruption alert raised', detail: 'Factory fire risk elevated in Shenzhen. SinoTech capacity 45%. Alternative supplier search triggered.', category: 'Disruption', caseId: 'EVT-001' },
  { id: 'AUD-0883', time: 'Mar 20, 2026 14:15', actor: 'J. Doe (Human)', actorType: 'human', action: 'Budget increase approved', detail: 'Approved $180K emergency sourcing budget for Nordic Metals rare earth backup. Reason: Disruption scenario.', category: 'Approval', caseId: 'APR-003' },
  { id: 'AUD-0882', time: 'Mar 20, 2026 11:00', actor: 'UiPath Robot', actorType: 'rpa', action: 'Purchase order created in SAP', detail: 'PO-2026-1204 created. CapEx Solutions, 200,000 capacitors, $67,800. ERP updated.', category: 'Execution', caseId: 'PC-0309' },
  { id: 'AUD-0881', time: 'Mar 19, 2026 09:45', actor: 'ESG Agent', actorType: 'ai', action: 'ESG assessment completed', detail: 'VoltX Energy: ESG score 82/100. Carbon footprint 4.2t CO2e/order. ISO 14001 valid.', category: 'Compliance', caseId: 'PC-0321' },
]

const actorIcon: Record<string, JSX.Element> = {
  ai: <Bot size={13} style={{ color: 'var(--brand-gold)' }} />,
  human: <User size={13} style={{ color: 'var(--brand-blue, #4A8CD4)' }} />,
  external: <Server size={13} style={{ color: 'var(--brand-text-dim)' }} />,
  rpa: <Shield size={13} style={{ color: 'var(--brand-green)' }} />,
}

const actorColor: Record<string, string> = {
  ai: 'var(--brand-gold)',
  human: '#4A8CD4',
  external: 'var(--brand-text-dim)',
  rpa: 'var(--brand-green)',
}

const categoryColors: Record<string, string> = {
  Negotiation: 'chip-gold',
  Compliance: 'chip-amber',
  Discovery: 'chip-blue',
  Procurement: 'chip-muted',
  Disruption: 'chip-red',
  Approval: 'chip-green',
  Execution: 'chip-green',
}

export default function AuditLog() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', 'Negotiation', 'Compliance', 'Discovery', 'Procurement', 'Disruption', 'Approval', 'Execution']

  const filtered = logs.filter((l) => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.detail.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || l.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-text-dim)' }} />
          <input
            className="sg-input pl-9"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: category === c ? 'rgba(201,168,76,0.15)' : 'var(--brand-surface)',
                color: category === c ? 'var(--brand-gold)' : 'var(--brand-text-muted)',
                border: `1px solid ${category === c ? 'rgba(201,168,76,0.3)' : 'var(--brand-border)'}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <button className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-2 ml-auto">
          <Download size={12} /> Export
        </button>
      </div>

      {/* Timeline */}
      <div className="sg-card" style={{ padding: '24px' }}>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'var(--brand-border)' }} />

          <div className="space-y-0">
            {filtered.map((log, i) => (
              <div key={log.id} className="relative flex gap-4 pb-5">
                {/* Icon circle */}
                <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--brand-surface)', border: `1px solid ${actorColor[log.actorType]}`, boxShadow: `0 0 8px ${actorColor[log.actorType]}20` }}>
                  {actorIcon[log.actorType]}
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{log.action}</span>
                      <span className={`chip ${categoryColors[log.category]}`} style={{ fontSize: '9px' }}>{log.category}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{log.id}</span>
                      <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{log.time}</span>
                    </div>
                  </div>
                  <div className="text-xs mb-1" style={{ color: actorColor[log.actorType], fontWeight: 500 }}>{log.actor}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--brand-text-muted)' }}>{log.detail}</div>
                  {log.caseId && (
                    <div className="mt-1">
                      <span className="chip chip-muted" style={{ fontSize: '9px' }}>Case: {log.caseId}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
