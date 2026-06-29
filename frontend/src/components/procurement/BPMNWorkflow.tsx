'use client'

import { CheckCircle, Circle, ArrowRight, User, Bot, Zap, Clock } from 'lucide-react'

const BPMN_STAGES = [
  {
    id: 'trigger', label: 'Inventory Trigger', type: 'start',
    description: 'Automatic inventory threshold breach detection',
    agent: 'Procurement Need Agent', status: 'completed',
  },
  {
    id: 'discovery', label: 'Supplier Discovery', type: 'task',
    description: 'AI searches global supplier databases',
    agent: 'Supplier Discovery Agent', status: 'completed',
  },
  {
    id: 'evaluation', label: 'Vendor Evaluation', type: 'task',
    description: 'Scoring across 9 performance dimensions',
    agent: 'Vendor Intelligence Agent', status: 'completed',
  },
  {
    id: 'negotiation', label: 'Negotiation', type: 'task',
    description: 'Multi-round AI price negotiation',
    agent: 'Negotiation Agent', status: 'active',
  },
  {
    id: 'risk', label: 'Risk Analysis', type: 'task',
    description: 'OFAC, AML, KYC, ESG screening',
    agent: 'Risk & Compliance Agent', status: 'active',
  },
  {
    id: 'approval', label: 'Human Approval', type: 'human',
    description: 'Executive review for high-value contracts',
    agent: 'Procurement Director', status: 'pending',
  },
  {
    id: 'po', label: 'Purchase Order', type: 'rpa',
    description: 'UiPath robot creates PO in SAP/Oracle',
    agent: 'UiPath Robot', status: 'pending',
  },
  {
    id: 'shipment', label: 'Shipment', type: 'task',
    description: 'Logistics optimization and tracking initiation',
    agent: 'Logistics Agent', status: 'pending',
  },
  {
    id: 'monitoring', label: 'Continuous Monitoring', type: 'task',
    description: 'Disruption prediction and supply chain health',
    agent: 'Disruption Agent', status: 'pending',
  },
  {
    id: 'close', label: 'Close', type: 'end',
    description: 'Case completed, audit trail finalized',
    agent: 'System', status: 'pending',
  },
]

const typeColors: Record<string, string> = {
  start: 'var(--brand-green)',
  end: 'var(--brand-green)',
  task: 'var(--brand-gold)',
  human: 'var(--brand-blue)',
  rpa: 'var(--brand-purple)',
}

const typeLabels: Record<string, string> = {
  start: 'Start Event',
  end: 'End Event',
  task: 'AI Task',
  human: 'Human Task',
  rpa: 'RPA Task',
}

const statusStyles: Record<string, { bg: string; border: string }> = {
  completed: { bg: 'rgba(124,184,74,0.08)', border: 'rgba(124,184,74,0.3)' },
  active: { bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.3)' },
  pending: { bg: 'var(--brand-surface-light)', border: 'var(--brand-border)' },
}

export default function BPMNWorkflow() {
  const completed = BPMN_STAGES.filter(s => s.status === 'completed').length
  const progress = (completed / BPMN_STAGES.length) * 100

  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>UiPath Maestro — BPMN Workflow</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
            PC-2026-0321 — Lithium Battery Procurement · {completed}/{BPMN_STAGES.length} stages
          </div>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: 'AI Task', color: 'var(--brand-gold)' },
            { label: 'Human Task', color: 'var(--brand-blue)' },
            { label: 'RPA Task', color: 'var(--brand-purple)' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
              <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-5" style={{ height: '4px' }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* BPMN flow - horizontal scrollable */}
      <div className="flex items-start gap-2 overflow-x-auto pb-3">
        {BPMN_STAGES.map((stage, idx) => (
          <div key={stage.id} className="flex items-center gap-2 flex-shrink-0">
            {/* Node */}
            <div
              className="rounded-xl p-3 w-[130px] transition-all"
              style={{
                background: statusStyles[stage.status].bg,
                border: `1px solid ${statusStyles[stage.status].border}`,
              }}
            >
              {/* Type badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="chip" style={{
                  fontSize: '9px',
                  background: `${typeColors[stage.type]}18`,
                  color: typeColors[stage.type],
                  padding: '1px 5px',
                }}>
                  {typeLabels[stage.type]}
                </span>
                {stage.status === 'completed' ? (
                  <CheckCircle size={12} style={{ color: 'var(--brand-green)' }} />
                ) : stage.status === 'active' ? (
                  <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'var(--brand-gold)', borderTopColor: 'transparent' }} />
                ) : (
                  <Clock size={11} style={{ color: 'var(--brand-text-dim)' }} />
                )}
              </div>

              <div className="text-xs font-semibold mb-1 leading-tight" style={{ color: 'var(--brand-text)' }}>
                {stage.label}
              </div>
              <div className="text-xs leading-tight" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>
                {stage.description}
              </div>
              <div className="mt-2 text-xs" style={{ color: typeColors[stage.type], fontSize: '9px', fontWeight: 600 }}>
                {stage.agent}
              </div>
            </div>

            {/* Arrow connector */}
            {idx < BPMN_STAGES.length - 1 && (
              <ArrowRight size={14} style={{ color: 'var(--brand-border-light)', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>

      {/* Case summary */}
      <div className="mt-4 pt-4 grid grid-cols-4 gap-3" style={{ borderTop: '1px solid var(--brand-border)' }}>
        {[
          { label: 'Case ID', value: 'PC-2026-0321' },
          { label: 'Current Stage', value: 'Negotiation' },
          { label: 'Open Since', value: '2h 14m' },
          { label: 'Est. Completion', value: '~4h' },
        ].map(m => (
          <div key={m.label}>
            <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>{m.label}</div>
            <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--brand-text)' }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
