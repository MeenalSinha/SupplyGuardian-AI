'use client'

import { useState } from 'react'
import { MoreHorizontal, Download, Info, LayoutGrid, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const kpiData = [
  { metric: 'Total Inventory Value', value: '$1,248,920', change: '+5.4%', status: 'Healthy', positive: true },
  { metric: 'Units In Stock', value: '48,920', change: '+2.1%', status: 'Stable', positive: true },
  { metric: 'Incoming Stock (Week)', value: '12,480', change: '+8.2%', status: 'High', positive: true },
  { metric: 'Active Suppliers', value: '128', change: '+3.6%', status: 'Stable', positive: true },
  { metric: 'On-Time Delivery', value: '92.6%', change: '+4.7%', status: 'Healthy', positive: true },
]

const inventoryData = [
  { name: 'Warehouse A', value: 56, color: '#C9A84C' },
  { name: 'Warehouse B', value: 26, color: '#7CB84A' },
  { name: 'Retail Store', value: 11, color: '#4A8CD4' },
  { name: 'In Transit', value: 7, color: '#6B6758' },
]

const salesGoalBars = Array.from({ length: 30 }, (_, i) => ({
  filled: i < 19,
  active: i === 18,
}))

export default function MarchReport() {
  const [movementType, setMovementType] = useState('All')
  const [warehouse, setWarehouse] = useState('All')
  const [category, setCategory] = useState('All')

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: 'var(--brand-text)' }}>March Report</h2>
        <div className="flex items-center gap-2">
          {/* Filters */}
          {[
            { label: 'Movement Type', val: movementType, set: setMovementType },
            { label: 'Warehouse', val: warehouse, set: setWarehouse },
            { label: 'Category', val: category, set: setCategory },
          ].map((f) => (
            <button
              key={f.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)', color: 'var(--brand-text-muted)' }}
            >
              {f.label} <ChevronDown size={11} />
            </button>
          ))}
          <button className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}>
            <LayoutGrid size={13} style={{ color: 'var(--brand-text-muted)' }} />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center relative"
            style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}>
            <SlidersHorizontal size={13} style={{ color: 'var(--brand-text-muted)' }} />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full text-xs flex items-center justify-center"
              style={{ background: 'var(--brand-gold)', color: 'var(--brand-carbon)', fontSize: '8px', fontWeight: 700 }}>2</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 items-start">
        {/* Overview KPI Table */}
        <div className="sg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Overview KPI</div>
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>March 2026</div>
            </div>
            <div className="flex gap-1">
              <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: 'var(--brand-text-dim)' }}>
                <Info size={12} />
              </button>
              <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: 'var(--brand-text-dim)' }}>
                <Download size={12} />
              </button>
            </div>
          </div>
          <table className="sg-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current Value</th>
                <th>Change</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {kpiData.map((row) => (
                <tr key={row.metric}>
                  <td style={{ color: 'var(--brand-text-muted)', fontSize: '12px' }}>{row.metric}</td>
                  <td style={{ fontWeight: 600, fontSize: '12px' }}>{row.value}</td>
                  <td>
                    <span className="text-xs font-semibold" style={{ color: row.positive ? 'var(--brand-green)' : 'var(--brand-red)' }}>
                      {row.change}
                    </span>
                  </td>
                  <td>
                    <span className="chip chip-green" style={{ fontSize: '10px' }}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Sales Goal */}
        <div className="sg-card">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Monthly Sales Goal</div>
            <button style={{ color: 'var(--brand-text-dim)' }}><MoreHorizontal size={14} /></button>
          </div>
          <div className="text-xs mb-4" style={{ color: 'var(--brand-text-dim)' }}>Target: $150,000</div>
          <div className="text-4xl font-black mb-3" style={{ color: 'var(--brand-text)' }}>63%</div>

          {/* Progress bars visualization */}
          <div className="flex gap-0.5 flex-wrap mb-4">
            {salesGoalBars.map((bar, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '28px',
                  borderRadius: '2px',
                  background: bar.active
                    ? 'var(--brand-gold)'
                    : bar.filled
                    ? 'var(--brand-green)'
                    : 'var(--brand-border)',
                }}
              />
            ))}
          </div>

          <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
            Keep pushing! Just $60,000 left to hit your goal.
          </p>
          <p className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Every sale counts!</p>
        </div>

        {/* Inventory Distribution */}
        <div className="sg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Inventory Distribution Overview</div>
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Distribution of Stocks</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              {inventoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{item.name} - {item.value}%</span>
                </div>
              ))}
            </div>
            <div className="relative" style={{ width: 100, height: 100 }}>
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx={45}
                    cy={45}
                    innerRadius={30}
                    outerRadius={45}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {inventoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-sm font-bold" style={{ color: 'var(--brand-text)' }}>48,920</div>
                <div className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '9px' }}>Units Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
