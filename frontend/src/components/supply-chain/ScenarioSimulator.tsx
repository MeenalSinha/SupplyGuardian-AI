'use client'

import { useState } from 'react'
import { Play, RotateCcw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Sliders } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ReferenceLine } from 'recharts'

type Scenario = 'baseline' | 'disruption' | 'priceSpike' | 'multiSource'

const SCENARIOS: Record<Scenario, {
  label: string
  description: string
  color: string
  params: { supplierCount: number; priceBuffer: number; leadTimeDays: number; riskScore: number; savingsM: number }
  outcomes: { metric: string; baseline: number; scenario: number; unit: string }[]
}> = {
  baseline: {
    label: 'Baseline — Current State',
    description: 'Current procurement configuration with VoltX as primary supplier',
    color: 'var(--brand-gold)',
    params: { supplierCount: 1, priceBuffer: 0, leadTimeDays: 18, riskScore: 24, savingsM: 0.35 },
    outcomes: [
      { metric: 'Supply Risk', baseline: 24, scenario: 24, unit: '/100' },
      { metric: 'Lead Time', baseline: 18, scenario: 18, unit: ' days' },
      { metric: 'Cost/Unit', baseline: 48, scenario: 48, unit: ' USD' },
      { metric: 'Savings', baseline: 350, scenario: 350, unit: 'K' },
    ],
  },
  disruption: {
    label: 'Scenario A — Shenzhen Disruption',
    description: 'Factory fire disrupts SinoTech. No backup supplier. Production halt.',
    color: 'var(--brand-red)',
    params: { supplierCount: 0, priceBuffer: 0, leadTimeDays: 48, riskScore: 87, savingsM: -2.1 },
    outcomes: [
      { metric: 'Supply Risk', baseline: 24, scenario: 87, unit: '/100' },
      { metric: 'Lead Time', baseline: 18, scenario: 48, unit: ' days' },
      { metric: 'Cost/Unit', baseline: 48, scenario: 48, unit: ' USD' },
      { metric: 'Revenue Impact', baseline: 0, scenario: -2100, unit: 'K' },
    ],
  },
  priceSpike: {
    label: 'Scenario B — Lithium Price Spike +25%',
    description: 'Lithium carbonate prices spike 25% due to Chilean supply cuts.',
    color: 'var(--brand-amber)',
    params: { supplierCount: 1, priceBuffer: 25, leadTimeDays: 18, riskScore: 41, savingsM: -0.3 },
    outcomes: [
      { metric: 'Supply Risk', baseline: 24, scenario: 41, unit: '/100' },
      { metric: 'Lead Time', baseline: 18, scenario: 18, unit: ' days' },
      { metric: 'Cost/Unit', baseline: 48, scenario: 60, unit: ' USD' },
      { metric: 'Cost Impact', baseline: 0, scenario: -300, unit: 'K' },
    ],
  },
  multiSource: {
    label: 'Scenario C — Multi-Source Strategy (Recommended)',
    description: 'AI recommends splitting across VoltX (60%) + BattCo (40%) for resilience.',
    color: 'var(--brand-green)',
    params: { supplierCount: 2, priceBuffer: 4, leadTimeDays: 14, riskScore: 11, savingsM: 0.28 },
    outcomes: [
      { metric: 'Supply Risk', baseline: 24, scenario: 11, unit: '/100' },
      { metric: 'Lead Time', baseline: 18, scenario: 14, unit: ' days' },
      { metric: 'Cost/Unit', baseline: 48, scenario: 49.9, unit: ' USD' },
      { metric: 'Savings', baseline: 350, scenario: 280, unit: 'K' },
    ],
  },
}

const riskOverTime = [
  { month: 'Apr', baseline: 24, disruption: 87, priceSpike: 41, multiSource: 11 },
  { month: 'May', baseline: 24, disruption: 82, priceSpike: 38, multiSource: 10 },
  { month: 'Jun', baseline: 26, disruption: 74, priceSpike: 35, multiSource: 9 },
  { month: 'Jul', baseline: 28, disruption: 68, priceSpike: 42, multiSource: 10 },
  { month: 'Aug', baseline: 22, disruption: 55, priceSpike: 44, multiSource: 11 },
  { month: 'Sep', baseline: 20, disruption: 48, priceSpike: 38, multiSource: 9 },
]

const tooltipStyle = {
  contentStyle: { background: 'var(--brand-surface)', border: '1px solid var(--brand-border)', borderRadius: 8, fontSize: 11 },
}

export default function ScenarioSimulator() {
  const [active, setActive] = useState<Scenario>('baseline')
  const [running, setRunning] = useState(false)

  async function runSimulation() {
    setRunning(true)
    await new Promise(r => setTimeout(r, 1200))
    setRunning(false)
  }

  const scenario = SCENARIOS[active]

  return (
    <div className="space-y-5">
      <div className="sg-card" style={{ padding: '14px 20px' }}>
        <div className="flex items-center gap-3">
          <Sliders size={18} style={{ color: 'var(--brand-gold)' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--brand-text)' }}>What-If Scenario Simulator</div>
            <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
              Model the financial and operational impact of supply chain scenarios before they occur
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {(Object.keys(SCENARIOS) as Scenario[]).map(key => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="rounded-xl p-3 text-left transition-all"
            style={{
              background: active === key ? `${SCENARIOS[key].color}10` : 'var(--brand-surface)',
              border: `1px solid ${active === key ? SCENARIOS[key].color : 'var(--brand-border)'}`,
            }}
          >
            <div className="w-2 h-2 rounded-full mb-2" style={{ background: SCENARIOS[key].color }} />
            <div className="text-xs font-semibold leading-tight" style={{ color: 'var(--brand-text)' }}>
              {SCENARIOS[key].label}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Scenario outcomes */}
        <div className="sg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>{scenario.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>{scenario.description}</div>
            </div>
            <button
              onClick={runSimulation}
              disabled={running}
              className="btn-gold flex items-center gap-1.5 text-xs px-3 py-1.5 flex-shrink-0"
            >
              {running
                ? <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand-carbon)', borderTopColor: 'transparent' }} />
                : <Play size={11} />}
              {running ? 'Modeling...' : 'Run'}
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {scenario.outcomes.map(o => {
              const delta = o.scenario - o.baseline
              const isPositive = (o.metric === 'Supply Risk' || o.metric === 'Lead Time' || o.metric.includes('Impact') || o.metric.includes('Cost/Unit'))
                ? delta < 0 : delta > 0
              return (
                <div key={o.metric}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: 'var(--brand-text-muted)' }}>{o.metric}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--brand-text-dim)' }}>Base: {o.baseline}{o.unit}</span>
                      <span className="font-bold" style={{ color: scenario.color }}>
                        {o.scenario}{o.unit}
                      </span>
                      {delta !== 0 && (
                        <span className="font-semibold" style={{ color: isPositive ? 'var(--brand-green)' : 'var(--brand-red)', fontSize: '10px' }}>
                          {delta > 0 ? '+' : ''}{delta}{o.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="progress-bar flex-1" style={{ height: '4px' }}>
                      <div style={{ width: `${Math.min(100, Math.abs(o.baseline) / 100 * 100)}%`, height: '100%', background: 'var(--brand-border)', borderRadius: '4px' }} />
                    </div>
                    <div className="progress-bar flex-1" style={{ height: '4px' }}>
                      <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.abs(o.scenario) / 100 * 100)}%`, background: scenario.color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* AI recommendation */}
          {active === 'multiSource' && (
            <div className="mt-4 rounded-lg p-3" style={{ background: 'rgba(124,184,74,0.06)', border: '1px solid rgba(124,184,74,0.2)' }}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={12} style={{ color: 'var(--brand-green)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-green)' }}>AI Recommendation</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                Multi-source strategy reduces supply risk by 54% at only 4% cost premium. Resilience gain far outweighs marginal cost. Recommend implementing immediately.
              </p>
            </div>
          )}
          {active === 'disruption' && (
            <div className="mt-4 rounded-lg p-3" style={{ background: 'rgba(212,90,74,0.06)', border: '1px solid rgba(212,90,74,0.2)' }}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={12} style={{ color: 'var(--brand-red)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-red)' }}>High Risk Scenario</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                Without alternative supplier, disruption causes $2.1M revenue impact. Activating TaipeiTech reduces this to $60K. Approval required.
              </p>
            </div>
          )}
        </div>

        {/* Risk over time comparison chart */}
        <div className="sg-card">
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--brand-text)' }}>Supply Risk Score — 6 Month Forecast</div>
          <div className="text-xs mb-4" style={{ color: 'var(--brand-text-muted)' }}>Compare risk trajectories across scenarios</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={riskOverTime}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--brand-text-dim)' }} axisLine={false} tickLine={false} domain={[0, 100]} width={28} />
              <Tooltip {...tooltipStyle} />
              <ReferenceLine y={50} stroke="var(--brand-border)" strokeDasharray="4 4" label={{ value: 'Risk Threshold', fontSize: 9, fill: 'var(--brand-text-dim)' }} />
              <Line type="monotone" dataKey="baseline" name="Baseline" stroke="var(--brand-gold)" strokeWidth={active === 'baseline' ? 2.5 : 1} strokeOpacity={active === 'baseline' ? 1 : 0.3} dot={false} />
              <Line type="monotone" dataKey="disruption" name="Disruption" stroke="var(--brand-red)" strokeWidth={active === 'disruption' ? 2.5 : 1} strokeOpacity={active === 'disruption' ? 1 : 0.3} dot={false} />
              <Line type="monotone" dataKey="priceSpike" name="Price Spike" stroke="var(--brand-amber)" strokeWidth={active === 'priceSpike' ? 2.5 : 1} strokeOpacity={active === 'priceSpike' ? 1 : 0.3} dot={false} />
              <Line type="monotone" dataKey="multiSource" name="Multi-Source" stroke="var(--brand-green)" strokeWidth={active === 'multiSource' ? 2.5 : 1} strokeOpacity={active === 'multiSource' ? 1 : 0.3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center flex-wrap">
            {Object.entries({ Baseline: 'var(--brand-gold)', Disruption: 'var(--brand-red)', 'Price Spike': 'var(--brand-amber)', 'Multi-Source': 'var(--brand-green)' }).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5" style={{ background: color }} />
                <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
