'use client'

import { useState } from 'react'
import { FileText, TrendingDown, Clock, CheckCircle, Download, BarChart2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'

const RFQ_TEMPLATE = {
  rfqNumber: 'RFQ-2026-0321',
  issuedDate: 'Mar 19, 2026',
  deadline: 'Mar 22, 2026',
  item: 'Lithium Battery Cells (Li-NMC, 3.7V, 3000mAh)',
  quantity: '50,000 units',
  deliveryDate: 'Apr 8, 2026',
  requirements: [
    'ISO 9001:2015 certification required',
    'Minimum 24-month product warranty',
    'Delivery within 14 days of PO confirmation',
    'ESG score minimum 70/100',
    'OFAC/AML compliance certificate required',
    'Sample batch of 500 units prior to full order',
  ],
  paymentTerms: 'Net 48 days',
  budgetGuidance: '$44–52/unit',
}

const OFFER_COMPARISON = [
  { supplier: 'VoltX Energy', country: 'KR', round1: 55.0, round2: 49.0, current: 48.0, delivery: 14, warranty: 24, esg: 82, rating: 4.8, recommended: true },
  { supplier: 'BattCo Ltd.', country: 'JP', round1: 53.5, round2: 50.5, current: 49.5, delivery: 18, warranty: 18, esg: 79, rating: 4.5, recommended: false },
  { supplier: 'KoreaPower', country: 'KR', round1: 57.0, round2: 54.0, current: 52.0, delivery: 21, warranty: 12, esg: 71, rating: 4.2, recommended: false },
]

const NEGOTIATION_ROUNDS = [
  { round: 'Initial Ask', voltx: 55.0, battco: 53.5, korea: 57.0 },
  { round: 'Round 1', voltx: 49.0, battco: 50.5, korea: 54.0 },
  { round: 'Round 2', voltx: 48.0, battco: 49.5, korea: 52.0 },
]

const ANALYTICS = [
  { label: 'Total Negotiations (30d)', value: '14', delta: '+3', positive: true },
  { label: 'Avg Savings vs Ask', value: '11.8%', delta: '+1.2%', positive: true },
  { label: 'Avg Rounds to Close', value: '2.3', delta: '-0.4', positive: true },
  { label: 'Avg Time to Close', value: '18.4h', delta: '-3.2h', positive: true },
]

const tooltipStyle = {
  contentStyle: { background: 'var(--brand-surface)', border: '1px solid var(--brand-border)', borderRadius: 8, fontSize: 11 },
}

export default function NegotiationAnalytics() {
  const [showRFQ, setShowRFQ] = useState(false)

  return (
    <div className="space-y-5">
      {/* Analytics KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {ANALYTICS.map(a => (
          <div key={a.label} className="sg-card" style={{ padding: '14px' }}>
            <div className="text-xs mb-2" style={{ color: 'var(--brand-text-dim)' }}>{a.label}</div>
            <div className="text-2xl font-black" style={{ color: 'var(--brand-text)' }}>{a.value}</div>
            <div className="text-xs mt-1 font-semibold" style={{ color: a.positive ? 'var(--brand-green)' : 'var(--brand-red)' }}>
              {a.delta}
            </div>
          </div>
        ))}
      </div>

      {/* RFQ Generation */}
      <div className="sg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>RFQ Generation</div>
          <div className="flex gap-2">
            <button onClick={() => setShowRFQ(!showRFQ)} className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
              <FileText size={12} /> {showRFQ ? 'Hide' : 'View RFQ'}
            </button>
            <button className="btn-gold text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Download size={12} /> Export RFQ PDF
            </button>
          </div>
        </div>

        {showRFQ ? (
          <div className="rounded-xl p-4" style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)', fontFamily: 'JetBrains Mono, monospace' }}>
            <div className="text-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--brand-border)' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--brand-gold)' }}>REQUEST FOR QUOTATION</div>
              <div className="text-xs mt-1" style={{ color: 'var(--brand-text-muted)' }}>{RFQ_TEMPLATE.rfqNumber} · Issued: {RFQ_TEMPLATE.issuedDate}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div><span style={{ color: 'var(--brand-text-dim)' }}>Item: </span><span style={{ color: 'var(--brand-text)' }}>{RFQ_TEMPLATE.item}</span></div>
              <div><span style={{ color: 'var(--brand-text-dim)' }}>Quantity: </span><span style={{ color: 'var(--brand-text)' }}>{RFQ_TEMPLATE.quantity}</span></div>
              <div><span style={{ color: 'var(--brand-text-dim)' }}>Required By: </span><span style={{ color: 'var(--brand-text)' }}>{RFQ_TEMPLATE.deliveryDate}</span></div>
              <div><span style={{ color: 'var(--brand-text-dim)' }}>Response Deadline: </span><span style={{ color: 'var(--brand-text)' }}>{RFQ_TEMPLATE.deadline}</span></div>
              <div><span style={{ color: 'var(--brand-text-dim)' }}>Payment Terms: </span><span style={{ color: 'var(--brand-text)' }}>{RFQ_TEMPLATE.paymentTerms}</span></div>
              <div><span style={{ color: 'var(--brand-text-dim)' }}>Budget Guidance: </span><span style={{ color: 'var(--brand-gold)' }}>{RFQ_TEMPLATE.budgetGuidance}</span></div>
            </div>
            <div className="text-xs mb-1" style={{ color: 'var(--brand-text-dim)' }}>REQUIREMENTS:</div>
            {RFQ_TEMPLATE.requirements.map((r, i) => (
              <div key={i} className="text-xs" style={{ color: 'var(--brand-green)' }}>✓ {r}</div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: 'var(--brand-text-muted)' }}>
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <div className="text-sm">AI-generated RFQ ready for {RFQ_TEMPLATE.rfqNumber}</div>
            <div className="text-xs mt-1">Click "View RFQ" to preview or "Export RFQ PDF" to download</div>
          </div>
        )}
      </div>

      {/* Offer comparison table */}
      <div className="sg-card">
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Multi-Supplier Offer Comparison</div>
        <div className="overflow-x-auto">
          <table className="sg-table w-full">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Round 1</th>
                <th>Round 2</th>
                <th>Current</th>
                <th>Savings vs Market</th>
                <th>Delivery</th>
                <th>Warranty</th>
                <th>ESG</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {OFFER_COMPARISON.map(s => {
                const marketRate = 55.2
                const savings = ((marketRate - s.current) / marketRate * 100).toFixed(1)
                return (
                  <tr key={s.supplier} style={{ background: s.recommended ? 'rgba(201,168,76,0.04)' : undefined }}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs">{s.supplier}</span>
                        <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>{s.country}</span>
                        {s.recommended && <span className="chip chip-gold" style={{ fontSize: '9px' }}>Recommended</span>}
                      </div>
                    </td>
                    <td style={{ color: 'var(--brand-text-muted)', textDecoration: 'line-through', fontSize: '12px' }}>${s.round1}</td>
                    <td style={{ color: 'var(--brand-text-muted)', textDecoration: 'line-through', fontSize: '12px' }}>${s.round2}</td>
                    <td style={{ fontWeight: 700, fontSize: '13px', color: 'var(--brand-text)' }}>${s.current}</td>
                    <td><span className="text-xs font-semibold" style={{ color: 'var(--brand-green)' }}>{savings}% below</span></td>
                    <td style={{ fontSize: '12px' }}>{s.delivery}d</td>
                    <td style={{ fontSize: '12px' }}>{s.warranty}mo</td>
                    <td>
                      <span className={`chip ${s.esg >= 80 ? 'chip-green' : 'chip-amber'}`} style={{ fontSize: '10px' }}>{s.esg}</span>
                    </td>
                    <td style={{ fontSize: '12px' }}>{s.rating}/5</td>
                    <td>
                      {s.recommended
                        ? <span className="chip chip-green" style={{ fontSize: '9px' }}>Selected</span>
                        : <span className="chip chip-muted" style={{ fontSize: '9px' }}>Backup</span>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Round-by-round price chart */}
      <div className="sg-card">
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Price Negotiation Progress</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={NEGOTIATION_ROUNDS} layout="vertical" margin={{ left: 60 }}>
            <XAxis type="number" domain={[40, 60]} tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <YAxis type="category" dataKey="round" tick={{ fontSize: 11, fill: 'var(--brand-text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${v}/unit`]} />
            <ReferenceLine x={44} stroke="var(--brand-gold)" strokeDasharray="4 4" label={{ value: 'Target $44', fontSize: 9, fill: 'var(--brand-gold)' }} />
            <Bar dataKey="voltx" name="VoltX Energy" fill="var(--brand-gold)" radius={[0, 3, 3, 0]} />
            <Bar dataKey="battco" name="BattCo Ltd." fill="var(--brand-blue, #4A8CD4)" radius={[0, 3, 3, 0]} />
            <Bar dataKey="korea" name="KoreaPower" fill="var(--brand-border)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          {[
            { label: 'VoltX Energy', color: 'var(--brand-gold)' },
            { label: 'BattCo Ltd.', color: '#4A8CD4' },
            { label: 'KoreaPower', color: 'var(--brand-border)' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded" style={{ background: l.color }} />
              <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
