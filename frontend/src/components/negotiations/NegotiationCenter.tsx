'use client'

import { useState } from 'react'
import { Bot, User, TrendingDown, Clock, CheckCircle, ChevronRight } from 'lucide-react'

const negotiations = [
  {
    id: 'NEG-001', supplier: 'VoltX Energy', item: 'Battery Cells', stage: 'Round 2',
    initialPrice: 55, currentPrice: 48, targetPrice: 44, progress: 60,
    status: 'In Progress', startDate: 'Mar 19, 2026',
    messages: [
      { role: 'ai', text: 'Opening negotiation for 50,000 battery cells. Initial offer submitted at $55/unit based on market rate.', time: '09:00' },
      { role: 'supplier', text: 'We can offer $52/unit for quantities above 30,000 with 60-day payment terms.', time: '09:14' },
      { role: 'ai', text: 'Counter-proposal: $49/unit, 45-day payment terms, with a quality guarantee clause and delivery within 14 days.', time: '09:22' },
      { role: 'supplier', text: 'Acceptable on pricing. Requesting 50-day payment terms. Delivery confirmed at 14 days.', time: '10:05' },
      { role: 'ai', text: 'Round 2 initiated. Proposing $48/unit with 48-day payment terms and 2% discount on next order.', time: '10:18' },
    ]
  },
  {
    id: 'NEG-002', supplier: 'Nordic Metals', item: 'Rare Earth Materials', stage: 'Final',
    initialPrice: 140, currentPrice: 124, targetPrice: 120, progress: 88,
    status: 'Near Close', startDate: 'Mar 17, 2026',
    messages: [
      { role: 'ai', text: 'Initiating final round. Current position: $124/kg for 5,000kg order.', time: '14:00' },
      { role: 'supplier', text: 'We can meet $122/kg with a 2-year supply agreement at current volumes.', time: '14:30' },
      { role: 'ai', text: 'Analyzing multi-year risk vs cost benefit. Revised counter: $121/kg with 18-month commitment.', time: '14:45' },
    ]
  },
  {
    id: 'NEG-003', supplier: 'SinoTech Ltd.', item: 'Semiconductors', stage: 'Round 1',
    initialPrice: 2.80, currentPrice: 2.40, targetPrice: 2.20, progress: 25,
    status: 'In Progress', startDate: 'Mar 21, 2026',
    messages: [
      { role: 'ai', text: 'Initial offer submitted: $2.40/unit for 500,000 units. Market benchmark: $2.65/unit.', time: '11:00' },
      { role: 'supplier', text: 'Minimum order 500k at $2.55/unit. Volume discount available at 1M+ units.', time: '11:45' },
    ]
  },
]

export default function NegotiationCenter() {
  const [active, setActive] = useState(negotiations[0])

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* List */}
      <div className="space-y-3">
        <div className="section-header">Active Negotiations ({negotiations.length})</div>
        {negotiations.map((n) => (
          <div
            key={n.id}
            className="sg-card cursor-pointer transition-all"
            style={{
              border: active.id === n.id ? '1px solid var(--brand-gold-dark)' : undefined,
              background: active.id === n.id ? 'rgba(201,168,76,0.05)' : undefined,
            }}
            onClick={() => setActive(n)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>{n.supplier}</div>
                <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{n.item}</div>
              </div>
              <span className={`chip ${n.status === 'Near Close' ? 'chip-green' : 'chip-gold'}`} style={{ fontSize: '10px' }}>
                {n.stage}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span style={{ color: 'var(--brand-text-dim)' }}>Current Price</span>
              <div className="flex items-center gap-1">
                <TrendingDown size={10} style={{ color: 'var(--brand-green)' }} />
                <span className="font-bold" style={{ color: 'var(--brand-text)' }}>
                  ${typeof n.currentPrice === 'number' ? n.currentPrice.toFixed(2) : n.currentPrice}
                </span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${n.progress}%` }} />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span style={{ color: 'var(--brand-text-dim)' }}>Progress</span>
              <span style={{ color: 'var(--brand-gold)' }}>{n.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail */}
      <div className="col-span-2 space-y-4">
        {/* Header */}
        <div className="sg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>{active.supplier} - {active.item}</div>
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Started {active.startDate} · {active.stage}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost text-xs px-3 py-1.5">Pause</button>
              <button className="btn-gold text-xs px-3 py-1.5">Approve & Sign</button>
            </div>
          </div>

          {/* Price comparison */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Initial Ask', value: active.initialPrice, color: 'var(--brand-red)' },
              { label: 'Current', value: active.currentPrice, color: 'var(--brand-gold)' },
              { label: 'Target', value: active.targetPrice, color: 'var(--brand-green)' },
            ].map((p) => (
              <div key={p.label} className="text-center p-3 rounded-xl" style={{ background: 'var(--brand-surface-light)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--brand-text-dim)' }}>{p.label}</div>
                <div className="text-xl font-black" style={{ color: p.color }}>
                  ${typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
                </div>
                {p.label === 'Current' && (
                  <div className="text-xs mt-1" style={{ color: 'var(--brand-green)' }}>
                    -{((active.initialPrice - active.currentPrice) / active.initialPrice * 100).toFixed(1)}% from ask
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className="sg-card flex-1">
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>Negotiation Thread</div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {active.messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'ai' ? '' : 'flex-row-reverse'}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: m.role === 'ai' ? 'var(--brand-gold)' : 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
                  {m.role === 'ai'
                    ? <Bot size={13} style={{ color: 'var(--brand-carbon)' }} />
                    : <User size={13} style={{ color: 'var(--brand-text-muted)' }} />
                  }
                </div>
                <div className={`flex-1 max-w-[80%] ${m.role !== 'ai' ? 'text-right' : ''}`}>
                  <div className="rounded-xl px-3 py-2 inline-block text-left"
                    style={{
                      background: m.role === 'ai' ? 'rgba(201,168,76,0.08)' : 'var(--brand-surface-light)',
                      border: `1px solid ${m.role === 'ai' ? 'rgba(201,168,76,0.2)' : 'var(--brand-border)'}`,
                    }}>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--brand-text)' }}>{m.text}</p>
                  </div>
                  <div className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--brand-text-dim)' }}>
                    <Clock size={9} />{m.time}
                  </div>
                </div>
              </div>
            ))}
            {/* AI thinking indicator */}
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--brand-gold)' }}>
                <Bot size={13} style={{ color: 'var(--brand-carbon)' }} />
              </div>
              <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="ai-thinking text-xs">Negotiation Agent analyzing optimal counter-offer...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
