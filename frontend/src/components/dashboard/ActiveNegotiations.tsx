'use client'

import Link from 'next/link'

const negotiations = [
  { supplier: 'VoltX Energy', item: 'Battery Cells', stage: 'Round 2', progress: 60 },
  { supplier: 'SinoTech Ltd.', item: 'Semiconductors', stage: 'Round 1', progress: 25 },
  { supplier: 'Nordic Metals', item: 'Rare Earth', stage: 'Final', progress: 88 },
]

export default function ActiveNegotiations() {
  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Active Negotiations</span>
        <Link href="/negotiations">
          <button className="btn-ghost text-xs px-2 py-1">View All</button>
        </Link>
      </div>
      <table className="sg-table">
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Item</th>
            <th>Stage</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {negotiations.map((n) => (
            <tr key={n.supplier} className="cursor-pointer">
              <td style={{ fontSize: '12px', fontWeight: 500 }}>{n.supplier}</td>
              <td style={{ fontSize: '12px', color: 'var(--brand-text-muted)' }}>{n.item}</td>
              <td>
                <span className="chip chip-gold" style={{ fontSize: '10px' }}>{n.stage}</span>
              </td>
              <td style={{ width: '80px' }}>
                <div className="flex items-center gap-2">
                  <div className="progress-bar flex-1">
                    <div className="progress-bar-fill" style={{ width: `${n.progress}%` }} />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--brand-text-muted)', minWidth: 28 }}>{n.progress}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
