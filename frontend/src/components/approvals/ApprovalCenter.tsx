'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, User, Bot, AlertTriangle, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface Approval {
  id: string
  type: string
  title: string
  supplier: string
  value: string
  risk: string
  reason: string
  aiRecommendation: string
  confidence: number
  requestedBy: string
  requestedAt: string
  deadline: string
  status: string
  documents: string[]
}

const approvals: Approval[] = [
  {
    id: 'APR-001', type: 'Contract Approval', title: 'Battery Cell Supply Contract - VoltX Energy',
    supplier: 'VoltX Energy', value: '$2,400,000', risk: 'Low',
    reason: 'High-value contract exceeds automated approval threshold of $500K',
    aiRecommendation: 'Recommend approval. Supplier has 4.8/5 rating, 96% on-time delivery, ISO 9001 certified. Price 13% below market.',
    confidence: 94, requestedBy: 'Negotiation Agent', requestedAt: 'Mar 21, 2026 10:18',
    deadline: 'Mar 23, 2026', status: 'Pending',
    documents: ['NDA_VoltX_2026.pdf', 'Supply_Agreement_v3.pdf', 'Risk_Assessment.pdf']
  },
  {
    id: 'APR-002', type: 'Supplier Exception', title: 'Sanctions Exception Request - AsiaTrade Co.',
    supplier: 'AsiaTrade Co.', value: '$890,000', risk: 'Critical',
    reason: 'Partial OFAC name match requires executive approval to proceed or block',
    aiRecommendation: 'Do NOT recommend approval. Match confidence 78%. Legal review required before any engagement.',
    confidence: 22, requestedBy: 'Risk & Compliance Agent', requestedAt: 'Mar 21, 2026 08:45',
    deadline: 'Mar 21, 2026', status: 'Urgent',
    documents: ['Sanctions_Report.pdf', 'Legal_Opinion.pdf']
  },
  {
    id: 'APR-003', type: 'Budget Increase', title: 'Alternative Supplier Budget Override',
    supplier: 'Nordic Metals (backup)', value: '$180,000 additional', risk: 'Medium',
    reason: 'Disruption scenario requires 15% budget increase for expedited rare earth sourcing',
    aiRecommendation: 'Recommend approval. Factory fire in primary region justifies emergency procurement. Cost of delay: $2.1M.',
    confidence: 87, requestedBy: 'Disruption Prediction Agent', requestedAt: 'Mar 20, 2026 16:30',
    deadline: 'Mar 22, 2026', status: 'Pending',
    documents: ['Disruption_Analysis.pdf', 'Cost_Benefit.pdf']
  },
]

const riskColors: Record<string, string> = {
  Low: 'chip-green',
  Medium: 'chip-amber',
  High: 'chip-red',
  Critical: 'chip-red',
}

export default function ApprovalCenter() {
  const [items, setItems] = useState(approvals)
  const [selected, setSelected] = useState<Approval>(approvals[0])
  const [comment, setComment] = useState('')

  function handleApprove(id: string) {
    setItems((prev) => prev.map((a) => a.id === id ? { ...a, status: 'Approved' } : a))
    toast.success('Approval granted. UiPath robot will execute automatically.')
  }

  function handleReject(id: string) {
    setItems((prev) => prev.map((a) => a.id === id ? { ...a, status: 'Rejected' } : a))
    toast.error('Request rejected. Agents notified to explore alternatives.')
  }

  const pending = items.filter((a) => a.status === 'Pending' || a.status === 'Urgent').length

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="section-header" style={{ marginBottom: 0 }}>Pending Approvals</span>
          <span className="chip chip-amber">{pending}</span>
        </div>
        <div className="space-y-3">
          {items.map((a) => (
            <div
              key={a.id}
              className="sg-card cursor-pointer transition-all"
              style={{
                border: selected.id === a.id ? '1px solid var(--brand-gold-dark)' : undefined,
                opacity: a.status === 'Approved' || a.status === 'Rejected' ? 0.6 : 1,
              }}
              onClick={() => setSelected(a)}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--brand-text)' }}>{a.title}</span>
                {a.status === 'Urgent' && <span className="chip chip-red" style={{ fontSize: '9px', flexShrink: 0, marginLeft: 8 }}>Urgent</span>}
                {a.status === 'Approved' && <CheckCircle size={13} style={{ color: 'var(--brand-green)', flexShrink: 0 }} />}
                {a.status === 'Rejected' && <XCircle size={13} style={{ color: 'var(--brand-red)', flexShrink: 0 }} />}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                <span>{a.type}</span>
                <span>·</span>
                <span className={`chip ${riskColors[a.risk]}`} style={{ fontSize: '9px' }}>{a.risk} Risk</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{a.value}</span>
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Due {a.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="col-span-2 space-y-4">
        {selected && (
          <>
            <div className="sg-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="chip chip-muted text-xs mb-2">{selected.type}</div>
                  <h2 className="text-base font-bold" style={{ color: 'var(--brand-text)' }}>{selected.title}</h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--brand-text-muted)' }}>
                    Requested by {selected.requestedBy} at {selected.requestedAt}
                  </p>
                </div>
                <span className={`chip ${riskColors[selected.risk]}`}>{selected.risk} Risk</span>
              </div>

              {/* Reason */}
              <div className="rounded-lg p-3 mb-4" style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle size={12} style={{ color: 'var(--brand-amber)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Why approval is required</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{selected.reason}</p>
              </div>

              {/* AI Recommendation */}
              <div className="rounded-lg p-3 mb-4" style={{
                background: selected.confidence > 70 ? 'rgba(124,184,74,0.05)' : 'rgba(212,90,74,0.05)',
                border: `1px solid ${selected.confidence > 70 ? 'rgba(124,184,74,0.2)' : 'rgba(212,90,74,0.2)'}`,
              }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Bot size={12} style={{ color: 'var(--brand-gold)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>AI Recommendation</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: selected.confidence > 70 ? 'var(--brand-green)' : 'var(--brand-red)' }}>
                    {selected.confidence}% confidence
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{selected.aiRecommendation}</p>
              </div>

              {/* Documents */}
              <div className="mb-4">
                <div className="section-header">Supporting Documents</div>
                <div className="flex gap-2 flex-wrap">
                  {selected.documents.map((d) => (
                    <button key={d} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors"
                      style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)', color: 'var(--brand-text-muted)' }}>
                      <FileText size={11} style={{ color: 'var(--brand-gold)' }} />
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <div className="section-header">Add Comment</div>
                <textarea
                  className="sg-input resize-none"
                  rows={3}
                  placeholder="Add a comment or reasoning for your decision..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {/* Actions */}
              {(selected.status === 'Pending' || selected.status === 'Urgent') && (
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'rgba(212,90,74,0.1)', border: '1px solid rgba(212,90,74,0.3)', color: 'var(--brand-red)' }}
                    onClick={() => handleReject(selected.id)}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'rgba(124,184,74,0.1)', border: '1px solid rgba(124,184,74,0.3)', color: 'var(--brand-green)' }}
                    onClick={() => handleApprove(selected.id)}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)', color: 'var(--brand-text-muted)' }}
                  >
                    <Clock size={14} /> Escalate
                  </button>
                </div>
              )}
              {selected.status === 'Approved' && (
                <div className="flex items-center gap-2 py-3 px-4 rounded-xl"
                  style={{ background: 'rgba(124,184,74,0.1)', border: '1px solid rgba(124,184,74,0.2)' }}>
                  <CheckCircle size={14} style={{ color: 'var(--brand-green)' }} />
                  <span className="text-sm" style={{ color: 'var(--brand-green)' }}>Approved — UiPath robot executing automatically</span>
                </div>
              )}
              {selected.status === 'Rejected' && (
                <div className="flex items-center gap-2 py-3 px-4 rounded-xl"
                  style={{ background: 'rgba(212,90,74,0.1)', border: '1px solid rgba(212,90,74,0.2)' }}>
                  <XCircle size={14} style={{ color: 'var(--brand-red)' }} />
                  <span className="text-sm" style={{ color: 'var(--brand-red)' }}>Rejected — Agents exploring alternatives</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
