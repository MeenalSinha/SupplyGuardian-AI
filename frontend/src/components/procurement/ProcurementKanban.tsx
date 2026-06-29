'use client'

import { useState } from 'react'
import { MoreHorizontal, Clock, DollarSign, AlertTriangle } from 'lucide-react'

interface ProcurementCase {
  id: string
  title: string
  item: string
  value: string
  priority: string
  daysOpen: number
  supplier?: string
}

type Columns = {
  [key: string]: ProcurementCase[]
}

const initialColumns: Columns = {
  'Detected': [
    { id: 'PC-0321', title: 'Lithium Battery Shortage', item: 'Lithium Batteries', value: '$128,000', priority: 'Critical', daysOpen: 1 },
    { id: 'PC-0322', title: 'Cooling Unit Restock', item: 'Cooling Systems', value: '$45,000', priority: 'Medium', daysOpen: 0 },
  ],
  'Supplier Discovery': [
    { id: 'PC-0318', title: 'PCB Component Sourcing', item: 'PCB Components', value: '$74,200', priority: 'High', daysOpen: 3, supplier: '6 candidates' },
    { id: 'PC-0319', title: 'Copper Wire Supply', item: 'Copper Wire', value: '$42,800', priority: 'Medium', daysOpen: 4, supplier: '4 candidates' },
  ],
  'Negotiation': [
    { id: 'PC-0315', title: 'Battery Cell Negotiation', item: 'Battery Cells', value: '$92,500', priority: 'High', daysOpen: 6, supplier: 'VoltX Energy' },
    { id: 'PC-0316', title: 'Rare Earth Metals', item: 'Rare Earth', value: '$180,000', priority: 'Critical', daysOpen: 8, supplier: 'Nordic Metals' },
  ],
  'Risk Review': [
    { id: 'PC-0312', title: 'Semiconductor Batch', item: 'Semiconductors', value: '$220,000', priority: 'High', daysOpen: 12, supplier: 'SinoTech Ltd.' },
  ],
  'Approval': [
    { id: 'PC-0310', title: 'Industrial Capacitors', item: 'Capacitors', value: '$67,800', priority: 'Medium', daysOpen: 15, supplier: 'CapEx Solutions' },
    { id: 'PC-0309', title: 'Steel Alloy Order', item: 'Steel Alloy', value: '$145,000', priority: 'High', daysOpen: 17, supplier: 'EuroMetals AG' },
  ],
  'Executing': [
    { id: 'PC-0305', title: 'Display Panels Q2', item: 'LCD Panels', value: '$312,000', priority: 'High', daysOpen: 22, supplier: 'PanelTech Corp' },
  ],
  'Completed': [
    { id: 'PC-0298', title: 'Q1 Battery Restock', item: 'Lithium Cells', value: '$95,500', priority: 'Medium', daysOpen: 30, supplier: 'BattCo Ltd.' },
    { id: 'PC-0297', title: 'Sensor Array Units', item: 'Sensors', value: '$38,400', priority: 'Low', daysOpen: 35, supplier: 'SenseIt GmbH' },
  ],
}

const priorityColors: Record<string, string> = {
  Critical: 'chip-red',
  High: 'chip-amber',
  Medium: 'chip-gold',
  Low: 'chip-muted',
}

const columnColors: Record<string, string> = {
  'Detected': 'var(--brand-text-dim)',
  'Supplier Discovery': 'var(--brand-gold)',
  'Negotiation': 'var(--brand-amber)',
  'Risk Review': 'var(--brand-red)',
  'Approval': 'var(--brand-purple, #8A4AD4)',
  'Executing': 'var(--brand-blue)',
  'Completed': 'var(--brand-green)',
}

export default function ProcurementKanban() {
  const [columns] = useState(initialColumns)

  const totalValue = Object.values(columns)
    .flat()
    .reduce((sum, c) => sum + parseFloat(c.value.replace(/[$,]/g, '')), 0)

  return (
    <div>
      {/* Summary bar */}
      <div className="flex gap-4 mb-4">
        <div className="sg-card flex-1" style={{ padding: '12px' }}>
          <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Total Pipeline Value</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: 'var(--brand-text)' }}>
            ${(totalValue / 1000000).toFixed(2)}M
          </div>
        </div>
        <div className="sg-card flex-1" style={{ padding: '12px' }}>
          <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Active Cases</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: 'var(--brand-text)' }}>
            {Object.values(columns).flat().length}
          </div>
        </div>
        <div className="sg-card flex-1" style={{ padding: '12px' }}>
          <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Pending Approvals</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: 'var(--brand-amber)' }}>
            {columns['Approval']?.length ?? 0}
          </div>
        </div>
        <div className="sg-card flex-1" style={{ padding: '12px' }}>
          <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Critical Priority</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: 'var(--brand-red)' }}>
            {Object.values(columns).flat().filter((c) => c.priority === 'Critical').length}
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(columns).map(([col, cards]) => (
          <div key={col} className="kanban-column flex-shrink-0" style={{ minWidth: '240px' }}>
            {/* Column header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: columnColors[col] }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{col}</span>
                <span className="chip chip-muted" style={{ fontSize: '9px', padding: '1px 5px' }}>{cards.length}</span>
              </div>
              <button style={{ color: 'var(--brand-text-dim)' }}><MoreHorizontal size={13} /></button>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {cards.map((card) => (
                <div key={card.id} className="kanban-card">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`chip ${priorityColors[card.priority]}`} style={{ fontSize: '9px' }}>{card.priority}</span>
                    <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontFamily: 'monospace', fontSize: '10px' }}>{card.id}</span>
                  </div>
                  <div className="text-xs font-semibold mb-1 leading-tight" style={{ color: 'var(--brand-text)' }}>{card.title}</div>
                  <div className="text-xs mb-2" style={{ color: 'var(--brand-text-dim)' }}>{card.item}</div>
                  {card.supplier && (
                    <div className="text-xs mb-2" style={{ color: 'var(--brand-gold)', fontSize: '10px' }}>{card.supplier}</div>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--brand-border)' }}>
                    <div className="flex items-center gap-1" style={{ color: 'var(--brand-text-muted)' }}>
                      <DollarSign size={10} />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--brand-text)' }}>{card.value}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: 'var(--brand-text-dim)' }}>
                      <Clock size={9} />
                      <span style={{ fontSize: '10px' }}>{card.daysOpen}d</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add card */}
            <button className="w-full mt-2 py-2 rounded-lg text-xs transition-colors"
              style={{ border: '1px dashed var(--brand-border)', color: 'var(--brand-text-dim)' }}>
              + Add Case
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
