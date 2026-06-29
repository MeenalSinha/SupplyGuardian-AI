'use client'

import { useState } from 'react'
import { FileText, AlertTriangle, CheckCircle, XCircle, Bot } from 'lucide-react'

const contracts = [
  { id: 'CTR-001', supplier: 'VoltX Energy', type: 'Supply Agreement', value: '$2,400,000', status: 'Under Review', expires: 'Dec 31, 2026', riskScore: 18 },
  { id: 'CTR-002', supplier: 'Nordic Metals', type: 'Framework Agreement', value: '$1,800,000', status: 'Active', expires: 'Jun 30, 2027', riskScore: 9 },
  { id: 'CTR-003', supplier: 'CapEx Solutions', type: 'Purchase Order', value: '$67,800', status: 'Active', expires: 'Mar 31, 2026', riskScore: 4 },
  { id: 'CTR-004', supplier: 'EuroMetals AG', type: 'Supply Agreement', value: '$145,000', status: 'Expiring Soon', expires: 'Apr 15, 2026', riskScore: 22 },
]

const clauseAnalysis = [
  { clause: 'Force Majeure', status: 'ok', note: 'Standard clause present. Covers pandemics, natural disasters, acts of war.' },
  { clause: 'Termination Rights', status: 'warning', note: 'Supplier has 30-day termination notice. Recommend extending to 90 days.' },
  { clause: 'Price Escalation', status: 'warning', note: 'No cap on annual price increases. Risk of uncapped cost inflation.' },
  { clause: 'Delivery SLA', status: 'ok', note: '14-day delivery guaranteed with 2% penalty per day for late delivery.' },
  { clause: 'IP & Data Rights', status: 'ok', note: 'All IP remains with buyer. Confidentiality clause 3 years post-contract.' },
  { clause: 'Warranty Terms', status: 'ok', note: '24-month product warranty with full replacement guarantee.' },
  { clause: 'Liability Cap', status: 'risk', note: 'Supplier liability capped at 50% of contract value. Insufficient for high-value orders.' },
  { clause: 'Renewal Terms', status: 'warning', note: 'Auto-renews unless cancelled 60 days before expiry. Monitor expiry dates.' },
]

const statusColors: Record<string, string> = {
  'Under Review': 'chip-amber',
  'Active': 'chip-green',
  'Expiring Soon': 'chip-red',
  'Expired': 'chip-muted',
}

const clauseIcon: Record<string, JSX.Element> = {
  ok: <CheckCircle size={13} style={{ color: 'var(--brand-green)', flexShrink: 0 }} />,
  warning: <AlertTriangle size={13} style={{ color: 'var(--brand-amber)', flexShrink: 0 }} />,
  risk: <XCircle size={13} style={{ color: 'var(--brand-red)', flexShrink: 0 }} />,
}

export default function ContractIntelligence() {
  const [selected, setSelected] = useState(contracts[0])

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Contract list */}
      <div>
        <div className="section-header">Contracts ({contracts.length})</div>
        <div className="space-y-3">
          {contracts.map((c) => (
            <div
              key={c.id}
              className="sg-card cursor-pointer transition-all"
              style={{ border: selected.id === c.id ? '1px solid var(--brand-gold-dark)' : undefined }}
              onClick={() => setSelected(c)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={13} style={{ color: 'var(--brand-gold)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{c.supplier}</span>
                </div>
                <span className={`chip ${statusColors[c.status]}`} style={{ fontSize: '9px' }}>{c.status}</span>
              </div>
              <div className="text-xs mb-1" style={{ color: 'var(--brand-text-muted)' }}>{c.type}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-bold" style={{ color: 'var(--brand-text)' }}>{c.value}</span>
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Exp: {c.expires}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Risk Score:</span>
                <span className="text-xs font-semibold" style={{ color: c.riskScore > 20 ? 'var(--brand-amber)' : 'var(--brand-green)' }}>
                  {c.riskScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract detail + clause analysis */}
      <div className="col-span-2 space-y-4">
        <div className="sg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--brand-text)' }}>{selected.supplier} - {selected.type}</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>{selected.id} · {selected.value} · Expires {selected.expires}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost text-xs px-2 py-1">Download</button>
              <button className="btn-gold text-xs px-2 py-1">Renegotiate</button>
            </div>
          </div>

          {/* AI Summary */}
          <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Bot size={12} style={{ color: 'var(--brand-gold)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>AI Contract Summary</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--brand-text-muted)' }}>
              This is a {selected.type.toLowerCase()} with {selected.supplier} valued at {selected.value}. The contract contains 
              2 moderate risk clauses requiring attention: uncapped price escalation and limited termination notice period. 
              Overall risk score of {selected.riskScore}/100 (Low). Recommend reviewing termination and price cap clauses 
              before final signature.
            </p>
          </div>

          {/* Clause analysis */}
          <div>
            <div className="section-header">AI Clause Analysis</div>
            <div className="space-y-2">
              {clauseAnalysis.map((c) => (
                <div
                  key={c.clause}
                  className="flex items-start gap-3 rounded-lg p-2.5"
                  style={{
                    background: c.status === 'risk'
                      ? 'rgba(212,90,74,0.05)'
                      : c.status === 'warning'
                      ? 'rgba(212,146,74,0.05)'
                      : 'var(--brand-surface-light)',
                    border: `1px solid ${
                      c.status === 'risk'
                        ? 'rgba(212,90,74,0.2)'
                        : c.status === 'warning'
                        ? 'rgba(212,146,74,0.2)'
                        : 'var(--brand-border)'
                    }`,
                  }}
                >
                  {clauseIcon[c.status]}
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{c.clause}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>{c.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
