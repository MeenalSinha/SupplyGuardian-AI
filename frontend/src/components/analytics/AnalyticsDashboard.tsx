'use client'

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area
} from 'recharts'

const savingsData = [
  { month: 'Oct', savings: 42000, spend: 820000 },
  { month: 'Nov', savings: 58000, spend: 940000 },
  { month: 'Dec', savings: 51000, spend: 870000 },
  { month: 'Jan', savings: 67000, spend: 1020000 },
  { month: 'Feb', savings: 74000, spend: 1100000 },
  { month: 'Mar', savings: 84000, spend: 1248920 },
]

const supplierScoreData = [
  { name: 'VoltX Energy', delivery: 96, quality: 92, esg: 82, price: 88 },
  { name: 'Nordic Metals', delivery: 92, quality: 95, esg: 94, price: 72 },
  { name: 'CapEx Solutions', delivery: 98, quality: 97, esg: 91, price: 85 },
  { name: 'EuroMetals AG', delivery: 94, quality: 91, esg: 88, price: 78 },
  { name: 'SinoTech Ltd.', delivery: 85, quality: 80, esg: 68, price: 95 },
]

const leadTimeData = [
  { month: 'Oct', avg: 18 }, { month: 'Nov', avg: 16 }, { month: 'Dec', avg: 15 },
  { month: 'Jan', avg: 13 }, { month: 'Feb', avg: 11 }, { month: 'Mar', avg: 8.4 },
]

const tooltipStyle = {
  contentStyle: { background: 'var(--brand-surface)', border: '1px solid var(--brand-border)', borderRadius: 8, fontSize: 11 },
  labelStyle: { color: 'var(--brand-text-muted)' },
}

export default function AnalyticsDashboard() {
  const totalSavings = savingsData.reduce((sum, d) => sum + d.savings, 0)
  const avgSavingsRate = ((totalSavings / savingsData.reduce((sum, d) => sum + d.spend, 0)) * 100).toFixed(1)

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Savings (6mo)', value: `$${(totalSavings / 1000).toFixed(0)}K`, delta: `${avgSavingsRate}% of spend`, color: 'var(--brand-green)' },
          { label: 'Procurement Cycle Time', value: '8.4d', delta: '-53% vs baseline', color: 'var(--brand-gold)' },
          { label: 'Supplier On-Time Rate', value: '92.6%', delta: '+4.7% MoM', color: 'var(--brand-green)' },
          { label: 'AI Decisions Automated', value: '94%', delta: '6% require human approval', color: 'var(--brand-blue, #4A8CD4)' },
        ].map((kpi) => (
          <div key={kpi.label} className="sg-card">
            <div className="text-xs mb-2" style={{ color: 'var(--brand-text-dim)' }}>{kpi.label}</div>
            <div className="text-2xl font-black mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-5">
        <div className="sg-card">
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Monthly Savings vs Spend</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={savingsData}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-gold)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--brand-gold)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-green)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--brand-green)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--brand-border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} width={48} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="spend" name="Total Spend" stroke="var(--brand-gold)" fill="url(#spendGrad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="var(--brand-green)" fill="url(#savingsGrad)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="sg-card">
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Average Lead Time (Days)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={leadTimeData}>
              <CartesianGrid stroke="var(--brand-border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}d`} />
              <Line type="monotone" dataKey="avg" name="Avg Lead Time" stroke="var(--brand-gold)" strokeWidth={2} dot={{ fill: 'var(--brand-gold)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier scores */}
      <div className="sg-card">
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Supplier Performance Scorecard</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={supplierScoreData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid stroke="var(--brand-border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--brand-text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend />
            <Bar dataKey="delivery" name="Delivery" fill="var(--brand-green)" radius={[0, 2, 2, 0]} />
            <Bar dataKey="quality" name="Quality" fill="var(--brand-gold)" radius={[0, 2, 2, 0]} />
            <Bar dataKey="esg" name="ESG" fill="var(--brand-blue, #4A8CD4)" radius={[0, 2, 2, 0]} />
            <Bar dataKey="price" name="Price" fill="var(--brand-amber)" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
