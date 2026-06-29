'use client'

import Link from 'next/link'

const alerts = [
  { risk: 'Geo-Political Risk', supplier: 'Global Parts Ltd.', severity: 'High', detected: 'Mar 21, 2026', sevColor: 'chip-red' },
  { risk: 'Sanctions Match', supplier: 'AsiaTrade Co.', severity: 'Critical', detected: 'Mar 20, 2026', sevColor: 'chip-red' },
  { risk: 'Late Delivery', supplier: 'TransLog GmbH', severity: 'Medium', detected: 'Mar 19, 2026', sevColor: 'chip-amber' },
  { risk: 'Financial Risk', supplier: 'MicroParts Inc.', severity: 'Low', detected: 'Mar 18, 2026', sevColor: 'chip-muted' },
]

export default function RiskAlerts() {
  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Risk Alerts</span>
        <Link href="/risk">
          <button className="btn-ghost text-xs px-2 py-1">View All</button>
        </Link>
      </div>
      <table className="sg-table">
        <thead>
          <tr>
            <th>Risk</th>
            <th>Supplier</th>
            <th>Severity</th>
            <th>Detected On</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a, i) => (
            <tr key={i} className="cursor-pointer">
              <td style={{ fontSize: '12px' }}>{a.risk}</td>
              <td style={{ fontSize: '12px', color: 'var(--brand-text-muted)' }}>{a.supplier}</td>
              <td><span className={`chip ${a.sevColor}`} style={{ fontSize: '10px' }}>{a.severity}</span></td>
              <td style={{ fontSize: '11px', color: 'var(--brand-text-muted)' }}>{a.detected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
