'use client'

import { useState } from 'react'
import { Search, Filter, Star, MapPin, TrendingUp, Shield, Leaf } from 'lucide-react'

const suppliers = [
  {
    id: 1, name: 'VoltX Energy', country: 'South Korea', category: 'Battery Cells', rating: 4.8, deliveryScore: 96,
    esgScore: 82, riskScore: 12, price: '$48/unit', leadTime: '14d', certifications: ['ISO 9001', 'ISO 14001'],
    revenue: '$2.4B', status: 'Preferred'
  },
  {
    id: 2, name: 'Nordic Metals', country: 'Norway', category: 'Rare Earth Materials', rating: 4.6, deliveryScore: 92,
    esgScore: 94, riskScore: 8, price: '$124/kg', leadTime: '21d', certifications: ['ISO 9001', 'RoHS', 'REACH'],
    revenue: '$890M', status: 'Approved'
  },
  {
    id: 3, name: 'SinoTech Ltd.', country: 'China', category: 'Semiconductors', rating: 4.2, deliveryScore: 85,
    esgScore: 68, riskScore: 38, price: '$2.4/unit', leadTime: '28d', certifications: ['ISO 9001'],
    revenue: '$5.1B', status: 'Under Review'
  },
  {
    id: 4, name: 'Global Parts Ltd.', country: 'Taiwan', category: 'PCB Components', rating: 4.5, deliveryScore: 90,
    esgScore: 75, riskScore: 42, price: '$0.82/unit', leadTime: '18d', certifications: ['ISO 9001', 'IPC-A-610'],
    revenue: '$1.2B', status: 'Risk Flagged'
  },
  {
    id: 5, name: 'CapEx Solutions', country: 'Germany', category: 'Capacitors', rating: 4.9, deliveryScore: 98,
    esgScore: 91, riskScore: 5, price: '$0.34/unit', leadTime: '10d', certifications: ['ISO 9001', 'ISO 14001', 'IATF'],
    revenue: '$670M', status: 'Preferred'
  },
  {
    id: 6, name: 'EuroMetals AG', country: 'Austria', category: 'Steel Alloy', rating: 4.7, deliveryScore: 94,
    esgScore: 88, riskScore: 9, price: '$1.84/kg', leadTime: '12d', certifications: ['ISO 9001', 'ISO 14001'],
    revenue: '$3.2B', status: 'Approved'
  },
]

const statusColors: Record<string, string> = {
  'Preferred': 'chip-gold',
  'Approved': 'chip-green',
  'Under Review': 'chip-amber',
  'Risk Flagged': 'chip-red',
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="progress-bar flex-1">
        <div className="progress-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs" style={{ color: 'var(--brand-text-muted)', minWidth: 24 }}>{value}</span>
    </div>
  )
}

export default function SupplierMarketplace() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.country.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex gap-5">
      {/* Main list */}
      <div className="flex-1">
        {/* Search */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-text-dim)' }} />
            <input
              className="sg-input pl-9"
              placeholder="Search suppliers by name, category, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-ghost flex items-center gap-2 text-sm">
            <Filter size={13} /> Filters
          </button>
        </div>

        {/* Summary */}
        <div className="flex gap-3 mb-4">
          {[
            { label: 'Total Suppliers', value: suppliers.length },
            { label: 'Preferred', value: suppliers.filter(s => s.status === 'Preferred').length },
            { label: 'Under Review', value: suppliers.filter(s => s.status === 'Under Review').length },
            { label: 'Risk Flagged', value: suppliers.filter(s => s.status === 'Risk Flagged').length },
          ].map((s) => (
            <div key={s.label} className="sg-card flex-1" style={{ padding: '10px 14px' }}>
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>{s.label}</div>
              <div className="text-xl font-bold mt-0.5">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Supplier cards */}
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="sg-card sg-card-hover cursor-pointer transition-all"
              style={{
                border: selected === s.id ? '1px solid var(--brand-gold-dark)' : undefined,
              }}
              onClick={() => setSelected(selected === s.id ? null : s.id)}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: 'var(--brand-gold)', color: 'var(--brand-carbon)' }}>
                  {s.name.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm" style={{ color: 'var(--brand-text)' }}>{s.name}</span>
                    <span className={`chip ${statusColors[s.status]}`} style={{ fontSize: '10px' }}>{s.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                    <span className="flex items-center gap-1"><MapPin size={10} />{s.country}</span>
                    <span>{s.category}</span>
                    <span>{s.revenue} revenue</span>
                    <span>{s.price}</span>
                    <span>Lead: {s.leadTime}</span>
                  </div>
                </div>

                {/* Scores */}
                <div className="flex gap-4 flex-shrink-0">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star size={11} style={{ color: 'var(--brand-gold)', fill: 'var(--brand-gold)' }} />
                      <span className="text-sm font-bold">{s.rating}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold" style={{ color: 'var(--brand-green)' }}>{s.deliveryScore}%</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold" style={{ color: 'var(--brand-green)' }}>{s.esgScore}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>ESG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold" style={{ color: s.riskScore > 30 ? 'var(--brand-red)' : 'var(--brand-green)' }}>
                      {s.riskScore}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>Risk</div>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button className="btn-ghost text-xs px-2 py-1">Profile</button>
                  <button className="btn-gold text-xs px-2 py-1">Negotiate</button>
                </div>
              </div>

              {/* Expanded detail */}
              {selected === s.id && (
                <div className="mt-4 pt-4 grid grid-cols-3 gap-4" style={{ borderTop: '1px solid var(--brand-border)' }}>
                  <div>
                    <div className="section-header">Score Breakdown</div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: 'var(--brand-text-muted)' }}>Delivery Reliability</span>
                        </div>
                        <ScoreBar value={s.deliveryScore} color="var(--brand-green)" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: 'var(--brand-text-muted)' }}>ESG Rating</span>
                        </div>
                        <ScoreBar value={s.esgScore} color="var(--brand-blue)" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: 'var(--brand-text-muted)' }}>Risk Score</span>
                        </div>
                        <ScoreBar value={s.riskScore} color={s.riskScore > 30 ? 'var(--brand-red)' : 'var(--brand-green)'} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="section-header">Certifications</div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.certifications.map((c) => (
                        <span key={c} className="chip chip-muted" style={{ fontSize: '10px' }}>{c}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="section-header">Actions</div>
                    <div className="space-y-2">
                      <button className="btn-gold w-full text-xs py-2">Start Negotiation</button>
                      <button className="btn-ghost w-full text-xs py-2">Run Risk Check</button>
                      <button className="btn-ghost w-full text-xs py-2">View Full Profile</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
