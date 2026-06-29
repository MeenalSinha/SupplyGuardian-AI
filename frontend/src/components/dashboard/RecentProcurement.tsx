'use client'

import Link from 'next/link'

const cases = [
  { id: 'PC-2026-0321', item: 'Lithium Batteries', status: 'Negotiation', value: '$128,000', date: 'Mar 21, 2026', statusColor: 'chip-gold' },
  { id: 'PC-2026-0318', item: 'PCB Components', status: 'Approved', value: '$74,200', date: 'Mar 18, 2026', statusColor: 'chip-green' },
  { id: 'PC-2026-0315', item: 'Copper Wire', status: 'Risk Review', value: '$42,800', date: 'Mar 15, 2026', statusColor: 'chip-amber' },
  { id: 'PC-2026-0312', item: 'Cooling Systems', status: 'Completed', value: '$95,500', date: 'Mar 12, 2026', statusColor: 'chip-muted' },
]

export default function RecentProcurement() {
  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Recent Procurement Cases</span>
        <Link href="/procurement">
          <button className="btn-ghost text-xs px-2 py-1">View All</button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="sg-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Item</th>
              <th>Status</th>
              <th>Value</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} className="cursor-pointer">
                <td style={{ color: 'var(--brand-gold)', fontSize: '11px', fontWeight: 500, fontFamily: 'JetBrains Mono, monospace' }}>{c.id}</td>
                <td style={{ fontSize: '12px' }}>{c.item}</td>
                <td><span className={`chip ${c.statusColor}`} style={{ fontSize: '10px' }}>{c.status}</span></td>
                <td style={{ fontSize: '12px', fontWeight: 600 }}>{c.value}</td>
                <td style={{ fontSize: '11px', color: 'var(--brand-text-muted)' }}>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
