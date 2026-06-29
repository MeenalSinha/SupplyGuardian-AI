'use client'

import { useState } from 'react'
import { FileText, Download, Bot, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Activity } from 'lucide-react'
import toast from 'react-hot-toast'

const BRIEFING = {
  date: 'March 21, 2026 — 14:30 UTC',
  headline: 'Supply Chain Under Elevated Risk — Autonomous Response Active',
  health: 92,
  summary: 'Three concurrent supply chain events are being managed autonomously. Factory fire in Shenzhen activates emergency semiconductor sourcing. Battery cell negotiation achieved 13% savings below market. One critical sanctions match blocked. Supply continuity maintained across all product lines. Human decisions required on 3 approvals.',
  keyMetrics: [
    { label: 'Supply Health Score', value: '92/100', trend: '+2', color: 'var(--brand-green)', icon: Activity },
    { label: 'Monthly Savings', value: '$84K', trend: '+12.1%', color: 'var(--brand-green)', icon: DollarSign },
    { label: 'Active Agents', value: '8/13', trend: 'Live', color: 'var(--brand-gold)', icon: Bot },
    { label: 'Pipeline Value', value: '$1.4M', trend: '14 cases', color: 'var(--brand-text)', icon: TrendingUp },
  ],
  criticalDecisions: [
    {
      id: 'APR-001', urgency: 'Urgent', title: 'Approve VoltX Energy Contract',
      detail: '$2.4M supply agreement. AI confidence: 94%. Savings: $350K vs market.',
      deadline: 'By EOD today', recommendation: 'APPROVE',
    },
    {
      id: 'APR-002', urgency: 'Critical', title: 'Block AsiaTrade Co.',
      detail: '78% OFAC sanctions match. Legal review in progress.',
      deadline: 'Immediate', recommendation: 'BLOCK — Await legal',
    },
    {
      id: 'APR-003', urgency: 'High', title: 'Approve TaipeiTech Emergency Budget',
      detail: '+$60K for emergency semiconductor source. ROI: 35x vs $2.1M disruption.',
      deadline: 'Within 4 hours', recommendation: 'APPROVE',
    },
  ],
  topRisks: [
    { risk: 'Shenzhen factory fire', probability: '94%', impact: '$2.1M', mitigated: true },
    { risk: 'Rotterdam port strike', probability: '87%', impact: '$145K', mitigated: true },
    { risk: 'Taiwan Strait escalation', probability: '62%', impact: 'TBD', mitigated: false },
    { risk: 'AsiaTrade sanctions match', probability: '78%', impact: '$890K', mitigated: true },
  ],
  agentActions: [
    'Negotiation Agent achieved $48/unit with VoltX — 13% below market',
    'Alternative Supplier Agent activated TaipeiTech for Shenzhen disruption',
    'Risk Agent blocked AsiaTrade Co. on 78% OFAC SDN match',
    'Logistics Agent rerouted Rotterdam shipment via Hamburg — delay cut 7 days',
    'Market Intelligence Agent flagged lithium +8.4% — contract lock-in recommended',
  ],
}

export default function ExecutiveBriefing() {
  const [generating, setGenerating] = useState(false)

  async function generatePDF() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    setGenerating(false)
    toast.success('Executive Briefing PDF generated and sent to j.doe@company.com')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="sg-card" style={{ borderColor: 'rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.03)' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot size={16} style={{ color: 'var(--brand-gold)' }} />
              <span className="chip chip-gold text-xs">Executive Advisor Agent</span>
              <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>{BRIEFING.date}</span>
            </div>
            <h2 className="text-base font-bold" style={{ color: 'var(--brand-text)' }}>{BRIEFING.headline}</h2>
            <p className="text-xs mt-1.5 leading-relaxed max-w-2xl" style={{ color: 'var(--brand-text-muted)' }}>
              {BRIEFING.summary}
            </p>
          </div>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="btn-gold flex items-center gap-2 text-sm px-4 py-2 flex-shrink-0 ml-6"
          >
            {generating
              ? <div className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#111', borderTopColor: 'transparent' }} />
              : <Download size={14} />
            }
            {generating ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4">
        {BRIEFING.keyMetrics.map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} className="sg-card">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={13} style={{ color: m.color }} />
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>{m.label}</span>
              </div>
              <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>{m.trend}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Critical decisions */}
        <div className="sg-card">
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>
            Decisions Required From You
          </div>
          <div className="space-y-3">
            {BRIEFING.criticalDecisions.map(d => (
              <div key={d.id} className="rounded-xl p-3"
                style={{
                  background: d.urgency === 'Critical' ? 'rgba(212,90,74,0.06)' : d.urgency === 'Urgent' ? 'rgba(212,146,74,0.06)' : 'rgba(201,168,76,0.06)',
                  border: `1px solid ${d.urgency === 'Critical' ? 'rgba(212,90,74,0.25)' : d.urgency === 'Urgent' ? 'rgba(212,146,74,0.25)' : 'rgba(201,168,76,0.25)'}`,
                }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`chip ${d.urgency === 'Critical' ? 'chip-red' : d.urgency === 'Urgent' ? 'chip-amber' : 'chip-gold'}`}
                    style={{ fontSize: '9px' }}>{d.urgency}</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{d.title}</span>
                  <span className="text-xs ml-auto" style={{ color: 'var(--brand-text-dim)', fontSize: '10px', fontFamily: 'monospace' }}>{d.id}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--brand-text-muted)' }}>{d.detail}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Deadline: {d.deadline}</span>
                  <span className="chip chip-gold" style={{ fontSize: '9px' }}>AI: {d.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk register + Agent actions */}
        <div className="space-y-4">
          <div className="sg-card">
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>Top Risk Register</div>
            <div className="space-y-2">
              {BRIEFING.topRisks.map(r => (
                <div key={r.risk} className="flex items-center gap-3">
                  {r.mitigated
                    ? <CheckCircle size={12} style={{ color: 'var(--brand-green)', flexShrink: 0 }} />
                    : <AlertTriangle size={12} style={{ color: 'var(--brand-red)', flexShrink: 0 }} />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--brand-text)' }}>{r.risk}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{r.probability}</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)', fontSize: '10px' }}>{r.impact}</span>
                    <span className={`chip ${r.mitigated ? 'chip-green' : 'chip-red'}`} style={{ fontSize: '9px' }}>
                      {r.mitigated ? 'Mitigated' : 'Open'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sg-card">
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>AI Actions Taken Today</div>
            <div className="space-y-2">
              {BRIEFING.agentActions.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={11} style={{ color: 'var(--brand-green)', flexShrink: 0, marginTop: 1 }} />
                  <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
