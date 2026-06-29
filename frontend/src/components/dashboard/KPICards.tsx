'use client'

const kpis = [
  { label: 'Active Suppliers', value: '128', delta: '+3.6%', positive: true },
  { label: 'Open Cases', value: '14', delta: '+2', positive: false },
  { label: 'Cost Savings (MTD)', value: '$84K', delta: '+12.1%', positive: true },
  { label: 'Avg. Lead Time', value: '8.4d', delta: '-0.6d', positive: true },
]

export default function KPICards() {
  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="sg-card sg-card-hover flex flex-col justify-between" style={{ padding: '14px' }}>
          <div className="text-xs mb-2" style={{ color: 'var(--brand-text-muted)', fontWeight: 500 }}>{kpi.label}</div>
          <div className="metric-value text-2xl">{kpi.value}</div>
          <div className={`metric-change text-xs mt-1 ${kpi.positive ? 'positive' : 'negative'}`}>
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  )
}
