'use client'

import { useState } from 'react'
import { Bot, ChevronDown, ChevronRight, CheckCircle, AlertTriangle, Info, TrendingUp, Database, Globe, FileText } from 'lucide-react'

interface Reasoning {
  step: number
  label: string
  detail: string
  confidence: number
  source: string
}

interface Alternative {
  label: string
  score: number
  reason: string
}

interface ExplainableDecision {
  id: string
  agent: string
  decision: string
  confidence: number
  timestamp: string
  reasoning: Reasoning[]
  dataSources: string[]
  alternatives: Alternative[]
  riskFactors: string[]
  businessImpact: string
}

const DECISIONS: ExplainableDecision[] = [
  {
    id: 'DEC-001',
    agent: 'Autonomous Negotiation Agent',
    decision: 'Submit counter-offer of $48/unit to VoltX Energy',
    confidence: 0.94,
    timestamp: '10:18 UTC',
    reasoning: [
      { step: 1, label: 'Market benchmark analysis', detail: 'Retrieved lithium battery cell spot prices from 14 exchanges. Current market: $55.20/unit average across Korean manufacturers.', confidence: 0.97, source: 'Market Intelligence Agent' },
      { step: 2, label: 'Supplier margin assessment', detail: 'VoltX Energy Q3 2025 gross margin: 34%. At $48/unit our ask leaves 18% margin — above minimum viable threshold of 15%.', confidence: 0.88, source: 'Vendor Intelligence Agent' },
      { step: 3, label: 'Negotiation history pattern', detail: 'Previous 6 VoltX negotiations: average 12.4% reduction from initial ask over 2.3 rounds. Round 2 position supports $48.', confidence: 0.91, source: 'Historical Database' },
      { step: 4, label: 'Competing offer leverage', detail: 'BattCo Ltd. (Japan) offered $49.50/unit in parallel discovery. This creates legitimate BATNA at $49.50.', confidence: 0.95, source: 'Supplier Discovery Agent' },
      { step: 5, label: 'Counter-offer calculation', detail: 'Optimal position: $48/unit. Expected acceptance probability: 78%. If rejected, round 3 fallback: $49/unit with extended warranty clause.', confidence: 0.94, source: 'Negotiation Model v2.1' },
    ],
    dataSources: ['14 commodity exchanges', 'VoltX Energy financial filings', 'Internal negotiation history (6 records)', 'BattCo parallel RFQ response', 'Bloomberg commodity API'],
    alternatives: [
      { label: '$46/unit aggressive', score: 31, reason: 'High rejection risk (67%). Damages supplier relationship. Not recommended.' },
      { label: '$49/unit moderate', score: 72, reason: 'Higher acceptance probability (89%) but $50K suboptimal vs $48 target.' },
      { label: '$48/unit optimal', score: 94, reason: 'Recommended. Balances price optimization with relationship preservation.' },
    ],
    riskFactors: ['Supplier may walk if round 3 still below $49', 'Lithium prices rising 8.4% — delay risks higher final price', 'Port congestion may affect leverage if delivery urgency rises'],
    businessImpact: 'Accepted at $48/unit saves $350,000 vs initial ask across 50,000 unit order. 13% below market rate.',
  },
  {
    id: 'DEC-002',
    agent: 'Risk & Compliance Agent',
    decision: 'Block AsiaTrade Co. — OFAC sanctions match',
    confidence: 0.78,
    timestamp: '08:45 UTC',
    reasoning: [
      { step: 1, label: 'Name screening run', detail: 'Entity "AsiaTrade Co." screened against OFAC SDN list, EU Consolidated List, UN Security Council list, and 12 national blacklists.', confidence: 0.99, source: 'OFAC API v3' },
      { step: 2, label: 'Match identified', detail: '"AsiaTrade International Co. Ltd." found on OFAC SDN list (entry 2024-0847). Fuzzy name similarity: 78% using Levenshtein + phonetic matching.', confidence: 0.78, source: 'Sanctions Engine' },
      { step: 3, label: 'Address cross-reference', detail: 'Registered address in Hong Kong SAR partially matches sanctioned entity registered in Shenzhen. Inconclusive — requires human review.', confidence: 0.62, source: 'Entity Resolution Engine' },
      { step: 4, label: 'Automatic block applied', detail: 'Per policy RFC-004: any match >70% confidence triggers automatic engagement block pending legal review. Block applied at 08:45 UTC.', confidence: 1.0, source: 'Policy Engine' },
    ],
    dataSources: ['OFAC SDN List (updated daily)', 'EU Consolidated Sanctions List', 'UN Security Council List', 'Company House UK', 'OpenCorporates API'],
    alternatives: [
      { label: 'Proceed with caution', score: 8, reason: 'Extremely high legal risk. OFAC violations: up to $1M per transaction. NOT recommended.' },
      { label: 'Request legal opinion', score: 85, reason: 'Recommended. Pause engagement. Legal team reviews match details within 48h.' },
      { label: 'Block permanently', score: 72, reason: 'Block if legal confirms match. Remove from approved vendor list.' },
    ],
    riskFactors: ['78% match may be false positive — different entity same name', 'Blocking may delay procurement by 3-5 days', 'Legal liability if match is confirmed and ignored'],
    businessImpact: 'Preventing potential OFAC violation. Maximum civil penalty: $356,579 per transaction. Criminal liability for knowingly proceeding.',
  },
  {
    id: 'DEC-003',
    agent: 'Disruption Prediction Agent',
    decision: 'Elevate Shenzhen disruption risk to CRITICAL (94%)',
    confidence: 0.94,
    timestamp: '14:30 UTC',
    reasoning: [
      { step: 1, label: 'News signal detected', detail: '3 independent news sources confirm factory fire at Shenzhen Industrial Zone, Longhua District. First report: Reuters 14:12 UTC.', confidence: 0.99, source: 'News API (Reuters, Bloomberg, AP)' },
      { step: 2, label: 'Satellite imagery cross-check', detail: 'Thermal anomaly confirmed at coordinates 22.6831°N, 114.2352°E matching SinoTech facility. Active fire signature.', confidence: 0.91, source: 'Planet Labs API' },
      { step: 3, label: 'Supplier impact modeling', detail: 'SinoTech primary production facility accounts for 78% of their semiconductor output. Historical precedent: similar fire in 2019 caused 6-week shutdown.', confidence: 0.87, source: 'Vendor Intelligence Agent' },
      { step: 4, label: 'Supply chain dependency graph', detail: 'SinoTech supplies 40% of our Q2 semiconductor requirement. No current buffer stock. Stockout in 18 days at current consumption rate.', confidence: 0.95, source: 'Inventory Management System' },
    ],
    dataSources: ['Reuters News API', 'Bloomberg Terminal Feed', 'Planet Labs Satellite API', 'OpenWeatherMap', 'Internal inventory system', 'Historical incident database'],
    alternatives: [
      { label: 'Monitor — wait for confirmation', score: 22, reason: 'Risk of stockout in 18 days if no action. Cost of inaction: $2.1M.' },
      { label: 'Activate alternative supplier', score: 94, reason: 'Recommended. TaipeiTech available immediately at +6% cost premium.' },
      { label: 'Emergency air freight from Japan', score: 68, reason: 'Available but 340% cost premium. Reserve for absolute emergency.' },
    ],
    riskFactors: ['Fire may be contained faster than modeled', 'TaipeiTech capacity may not absorb full 500K unit order', 'Taiwan geopolitical risk adds second-order exposure'],
    businessImpact: 'Without action: $2.1M revenue impact from production halt. With action (TaipeiTech): $60K premium cost. Net benefit: $2,040,000.',
  },
]

function ConfidenceBar({ value, label }: { value: number; label?: string }) {
  const color = value >= 0.85 ? 'var(--brand-green)' : value >= 0.65 ? 'var(--brand-amber)' : 'var(--brand-red)'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 progress-bar" style={{ height: '5px' }}>
        <div className="progress-bar-fill" style={{ width: `${value * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color, fontSize: '11px' }}>
        {Math.round(value * 100)}%
      </span>
      {label && <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>{label}</span>}
    </div>
  )
}

export default function AIExplainabilityPanel() {
  const [selected, setSelected] = useState<ExplainableDecision>(DECISIONS[0])
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="sg-card" style={{ padding: '14px 20px' }}>
        <div className="flex items-center gap-3">
          <Bot size={18} style={{ color: 'var(--brand-gold)' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--brand-text)' }}>AI Decision Explainability Engine</div>
            <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
              Every AI recommendation is fully traceable — reasoning steps, data sources, confidence scores, and alternatives
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Decision list */}
        <div className="space-y-3">
          <div className="section-header">Recent AI Decisions</div>
          {DECISIONS.map(d => (
            <div
              key={d.id}
              className="sg-card cursor-pointer transition-all"
              style={{ border: selected.id === d.id ? '1px solid var(--brand-gold-dark)' : undefined }}
              onClick={() => setSelected(d)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bot size={12} style={{ color: 'var(--brand-gold)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--brand-gold)', fontSize: '10px' }}>{d.agent}</span>
              </div>
              <div className="text-xs font-semibold mb-2 leading-snug" style={{ color: 'var(--brand-text)' }}>{d.decision}</div>
              <ConfidenceBar value={d.confidence} />
              <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{d.timestamp}</div>
            </div>
          ))}
        </div>

        {/* Decision detail */}
        <div className="col-span-2 space-y-4">
          {/* Decision header */}
          <div className="sg-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="chip chip-gold text-xs mb-1">{selected.agent}</div>
                <h3 className="text-sm font-bold leading-snug" style={{ color: 'var(--brand-text)' }}>{selected.decision}</h3>
                <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Decision ID: {selected.id} · {selected.timestamp}</div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-2xl font-black" style={{ color: selected.confidence >= 0.85 ? 'var(--brand-green)' : 'var(--brand-amber)' }}>
                  {Math.round(selected.confidence * 100)}%
                </div>
                <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>confidence</div>
              </div>
            </div>

            {/* Business impact */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={12} style={{ color: 'var(--brand-gold)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>Business Impact</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{selected.businessImpact}</p>
            </div>
          </div>

          {/* Reasoning steps */}
          <div className="sg-card">
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>
              Reasoning Trace ({selected.reasoning.length} steps)
            </div>
            <div className="space-y-2">
              {selected.reasoning.map(r => (
                <div
                  key={r.step}
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{ border: expandedStep === r.step ? '1px solid var(--brand-gold-dark)' : '1px solid var(--brand-border)' }}
                  onClick={() => setExpandedStep(expandedStep === r.step ? null : r.step)}
                >
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--brand-gold)' }}>
                      {r.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{r.label}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs" style={{ color: r.confidence >= 0.85 ? 'var(--brand-green)' : 'var(--brand-amber)', fontSize: '10px', fontWeight: 600 }}>
                            {Math.round(r.confidence * 100)}%
                          </span>
                          {expandedStep === r.step
                            ? <ChevronDown size={12} style={{ color: 'var(--brand-text-dim)' }} />
                            : <ChevronRight size={12} style={{ color: 'var(--brand-text-dim)' }} />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedStep === r.step && (
                    <div className="px-3 pb-3">
                      <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--brand-text-muted)' }}>{r.detail}</p>
                      <div className="flex items-center gap-1.5">
                        <Database size={10} style={{ color: 'var(--brand-text-dim)' }} />
                        <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>Source: {r.source}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alternatives + Data Sources */}
          <div className="grid grid-cols-2 gap-4">
            <div className="sg-card">
              <div className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>Alternative Options Considered</div>
              <div className="space-y-2">
                {selected.alternatives.map((alt, i) => (
                  <div key={i} className="rounded-lg p-2.5"
                    style={{ background: i === selected.alternatives.length - 1 ? 'rgba(201,168,76,0.05)' : 'var(--brand-surface-light)', border: `1px solid ${i === selected.alternatives.length - 1 ? 'rgba(201,168,76,0.2)' : 'var(--brand-border)'}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{alt.label}</span>
                      <span className="text-xs font-bold" style={{ color: alt.score >= 85 ? 'var(--brand-green)' : alt.score >= 60 ? 'var(--brand-amber)' : 'var(--brand-red)' }}>
                        {alt.score}/100
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{alt.reason}</p>
                    {i === selected.alternatives.length - 1 && (
                      <div className="chip chip-gold mt-1" style={{ fontSize: '9px' }}>Selected</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="sg-card">
              <div className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>Data Sources Used</div>
              <div className="space-y-1.5 mb-4">
                {selected.dataSources.map((src, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Database size={10} style={{ color: 'var(--brand-text-dim)', flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: 'var(--brand-text-muted)', fontSize: '11px' }}>{src}</span>
                  </div>
                ))}
              </div>
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--brand-text)' }}>Risk Factors</div>
              <div className="space-y-1.5">
                {selected.riskFactors.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle size={10} style={{ color: 'var(--brand-amber)', flexShrink: 0, marginTop: 1 }} />
                    <span className="text-xs" style={{ color: 'var(--brand-text-muted)', fontSize: '11px' }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
