'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Shield, Star, Package, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

const SUPPLIER_PROFILES = [
  {
    id: 'voltx', name: 'VoltX Energy', country: 'South Korea', category: 'Battery Cells',
    creditRating: 'AA-', creditScore: 820, financialHealth: 'Strong',
    revenue: [1.8, 2.0, 2.1, 2.2, 2.4], revenueYears: ['2021', '2022', '2023', '2024', '2025'],
    grossMargin: 34, debtToEquity: 0.42, currentRatio: 2.1,
    deliveryHistory: [
      { month: 'Oct', onTime: 94, quality: 91 }, { month: 'Nov', onTime: 96, quality: 93 },
      { month: 'Dec', onTime: 97, quality: 94 }, { month: 'Jan', onTime: 95, quality: 92 },
      { month: 'Feb', onTime: 96, quality: 95 }, { month: 'Mar', onTime: 96, quality: 92 },
    ],
    cybersecurity: { iso27001: true, soc2: true, penTested: true, lastAudit: 'Jan 2026', score: 88 },
    compliance: { ofac: 'Clear', aml: 'Clear', kyc: 'Verified', insurance: '$50M', taxStatus: 'Good Standing' },
    customerRefs: [
      { name: 'Samsung SDI', rating: 4.9, comment: 'Exceptional quality, always on time' },
      { name: 'LG Chem', rating: 4.7, comment: 'Strong technical support, competitive pricing' },
      { name: 'Panasonic EV', rating: 4.8, comment: 'Reliable partner, consistent delivery' },
    ],
    esgDetails: { environmental: 78, social: 85, governance: 88, carbonTonnes: 4.2, renewableEnergyPct: 62 },
    overallScore: 94,
  },
]

const tooltipStyle = {
  contentStyle: { background: 'var(--brand-surface)', border: '1px solid var(--brand-border)', borderRadius: 8, fontSize: 11 },
}

function ScorePill({ value, label }: { value: number; label: string }) {
  const color = value >= 85 ? 'var(--brand-green)' : value >= 70 ? 'var(--brand-amber)' : 'var(--brand-red)'
  return (
    <div className="text-center p-3 rounded-xl" style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
      <div className="text-xl font-black" style={{ color }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>{label}</div>
    </div>
  )
}

export default function VendorIntelligence() {
  const supplier = SUPPLIER_PROFILES[0]
  const [activeTab, setActiveTab] = useState<'financial' | 'delivery' | 'cyber' | 'esg' | 'references'>('financial')

  const tabs = [
    { id: 'financial', label: 'Financial Health' },
    { id: 'delivery', label: 'Delivery Performance' },
    { id: 'cyber', label: 'Cybersecurity' },
    { id: 'esg', label: 'ESG' },
    { id: 'references', label: 'Customer References' },
  ] as const

  return (
    <div className="space-y-5">
      {/* Supplier header */}
      <div className="sg-card">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0"
            style={{ background: 'var(--brand-gold)', color: 'var(--brand-carbon)' }}>
            VX
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-bold" style={{ color: 'var(--brand-text)' }}>{supplier.name}</h2>
              <span className="chip chip-green">Preferred Supplier</span>
              <span className="chip chip-gold">AI Recommended</span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--brand-text-muted)' }}>
              <span>{supplier.country}</span>
              <span>{supplier.category}</span>
              <span>Revenue: ${supplier.revenue[supplier.revenue.length - 1]}B (2025)</span>
              <span>Credit: {supplier.creditRating} ({supplier.creditScore})</span>
            </div>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="text-3xl font-black" style={{ color: 'var(--brand-gold)' }}>{supplier.overallScore}</div>
            <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Overall Score</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>/100</div>
          </div>
        </div>

        {/* Score grid */}
        <div className="grid grid-cols-5 gap-3 mt-4">
          <ScorePill value={96} label="Delivery" />
          <ScorePill value={92} label="Quality" />
          <ScorePill value={82} label="ESG" />
          <ScorePill value={88} label="Cyber" />
          <ScorePill value={12} label="Risk" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: activeTab === t.id ? 'rgba(201,168,76,0.15)' : 'var(--brand-surface)',
              color: activeTab === t.id ? 'var(--brand-gold)' : 'var(--brand-text-muted)',
              border: `1px solid ${activeTab === t.id ? 'rgba(201,168,76,0.3)' : 'var(--brand-border)'}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'financial' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="sg-card">
            <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Revenue Trend (USD Billion)</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={supplier.revenueYears.map((y, i) => ({ year: y, revenue: supplier.revenue[i] }))}>
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} width={36} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${v}B`, 'Revenue']} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {supplier.revenue.map((_, i) => (
                    <Cell key={i} fill={i === supplier.revenue.length - 1 ? 'var(--brand-gold)' : '#333128'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="sg-card">
            <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Financial Health Indicators</div>
            <div className="space-y-3">
              {[
                { label: 'Credit Rating', value: supplier.creditRating, detail: `Score: ${supplier.creditScore}`, positive: true },
                { label: 'Gross Margin', value: `${supplier.grossMargin}%`, detail: 'Industry avg: 28%', positive: true },
                { label: 'Debt / Equity', value: `${supplier.debtToEquity}x`, detail: 'Low leverage — healthy', positive: true },
                { label: 'Current Ratio', value: `${supplier.currentRatio}x`, detail: '> 1.5 is healthy', positive: true },
                { label: 'Financial Status', value: supplier.financialHealth, detail: 'No distress indicators', positive: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium" style={{ color: 'var(--brand-text)' }}>{item.label}</div>
                    <div className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{item.detail}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: item.positive ? 'var(--brand-green)' : 'var(--brand-red)' }}>
                      {item.value}
                    </span>
                    {item.positive
                      ? <CheckCircle size={12} style={{ color: 'var(--brand-green)' }} />
                      : <AlertTriangle size={12} style={{ color: 'var(--brand-red)' }} />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'delivery' && (
        <div className="sg-card">
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>6-Month Delivery Performance</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={supplier.deliveryHistory}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={36} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`]} />
              <Line type="monotone" dataKey="onTime" name="On-Time Delivery" stroke="var(--brand-green)" strokeWidth={2} dot={{ fill: 'var(--brand-green)', r: 3 }} />
              <Line type="monotone" dataKey="quality" name="Quality Score" stroke="var(--brand-gold)" strokeWidth={2} dot={{ fill: 'var(--brand-gold)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[
              { label: 'On-Time Delivery', color: 'var(--brand-green)', avg: '95.7%' },
              { label: 'Quality Score', color: 'var(--brand-gold)', avg: '92.8%' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-0.5" style={{ background: item.color }} />
                <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{item.label} — avg {item.avg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cyber' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="sg-card">
            <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Cybersecurity Posture</div>
            <div className="space-y-3">
              {[
                { check: 'ISO 27001 Certified', status: supplier.cybersecurity.iso27001 },
                { check: 'SOC 2 Type II', status: supplier.cybersecurity.soc2 },
                { check: 'Annual Pen Testing', status: supplier.cybersecurity.penTested },
                { check: 'Last Security Audit', status: true, note: supplier.cybersecurity.lastAudit },
                { check: 'MFA Enforced', status: true },
                { check: 'Data Encryption at Rest', status: true },
                { check: 'Incident Response Plan', status: true },
              ].map(item => (
                <div key={item.check} className="flex items-center gap-3">
                  {item.status
                    ? <CheckCircle size={13} style={{ color: 'var(--brand-green)', flexShrink: 0 }} />
                    : <AlertTriangle size={13} style={{ color: 'var(--brand-red)', flexShrink: 0 }} />
                  }
                  <span className="text-xs" style={{ color: 'var(--brand-text)' }}>{item.check}</span>
                  {item.note && <span className="text-xs ml-auto" style={{ color: 'var(--brand-text-dim)' }}>{item.note}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="sg-card">
            <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Compliance Status</div>
            <div className="space-y-3">
              {Object.entries(supplier.compliance).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs capitalize" style={{ color: 'var(--brand-text-muted)' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`chip ${value === 'Clear' || value === 'Verified' || value === 'Good Standing' ? 'chip-green' : 'chip-gold'}`}
                    style={{ fontSize: '10px' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'esg' && (
        <div className="sg-card">
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>ESG & Sustainability Profile</div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Environmental', value: supplier.esgDetails.environmental, color: 'var(--brand-green)' },
              { label: 'Social', value: supplier.esgDetails.social, color: '#4A8CD4' },
              { label: 'Governance', value: supplier.esgDetails.governance, color: 'var(--brand-gold)' },
            ].map(dim => (
              <div key={dim.label} className="text-center p-4 rounded-xl"
                style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
                <div className="text-3xl font-black" style={{ color: dim.color }}>{dim.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>{dim.label}</div>
                <div className="progress-bar mt-2">
                  <div className="progress-bar-fill" style={{ width: `${dim.value}%`, background: dim.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-3" style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--brand-text)' }}>Carbon Footprint</div>
              <div className="text-2xl font-black" style={{ color: 'var(--brand-green)' }}>{supplier.esgDetails.carbonTonnes}t</div>
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>CO₂e per order</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--brand-text)' }}>Renewable Energy</div>
              <div className="text-2xl font-black" style={{ color: 'var(--brand-green)' }}>{supplier.esgDetails.renewableEnergyPct}%</div>
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Of total energy use</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'references' && (
        <div className="sg-card">
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Customer References</div>
          <div className="space-y-4">
            {supplier.customerRefs.map(ref => (
              <div key={ref.name} className="rounded-xl p-4"
                style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>{ref.name}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} style={{ color: i < Math.floor(ref.rating) ? 'var(--brand-gold)' : 'var(--brand-border)', fill: i < Math.floor(ref.rating) ? 'var(--brand-gold)' : 'transparent' }} />
                    ))}
                    <span className="text-xs font-bold ml-1" style={{ color: 'var(--brand-gold)' }}>{ref.rating}</span>
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>"{ref.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
