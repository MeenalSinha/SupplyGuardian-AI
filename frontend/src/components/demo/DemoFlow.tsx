'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle, Circle, Play, RotateCcw, ChevronRight,
  AlertTriangle, Bot, User, Zap, Package, Search,
  DollarSign, Shield, FileText, Truck, Bell, RefreshCw
} from 'lucide-react'

const DEMO_STEPS = [
  {
    id: 1,
    title: 'Inventory Falls Below Threshold',
    icon: Package,
    color: 'var(--brand-amber)',
    agent: 'Procurement Need Agent',
    description: 'Lithium battery stock drops to 12% (threshold: 20%). Procurement Need Agent detects anomaly in real-time.',
    detail: 'System monitoring detected: LithiumBattery_SKU_4821 = 12,480 units (threshold: 20,000). Auto-creating procurement case PC-2026-0321.',
    duration: 2000,
  },
  {
    id: 2,
    title: 'Procurement Case Opened',
    icon: FileText,
    color: 'var(--brand-gold)',
    agent: 'Procurement Need Agent',
    description: 'Case PC-2026-0321 created automatically. Priority set to Critical. Workflow initiated in UiPath Maestro.',
    detail: 'CASE OPENED: PC-2026-0321 | Item: Lithium Batteries | Qty: 50,000 units | Est. Value: $128,000 | Priority: CRITICAL | Stage: Supplier Discovery',
    duration: 1500,
  },
  {
    id: 3,
    title: 'AI Discovers Global Suppliers',
    icon: Search,
    color: 'var(--brand-blue)',
    agent: 'Supplier Discovery Agent',
    description: 'Agent searches 847 global supplier databases. 14 candidates found. Ranked by score, price, and availability.',
    detail: 'Found 14 candidates across 8 countries. Top candidates: VoltX Energy (KR, score 94), BattCo Ltd. (JP, score 88), KoreaPower (KR, score 82). Initiating vendor intelligence evaluation.',
    duration: 2500,
  },
  {
    id: 4,
    title: 'Suppliers Scored & Evaluated',
    icon: Bot,
    color: 'var(--brand-gold)',
    agent: 'Vendor Intelligence Agent',
    description: 'Deep evaluation of top 3 suppliers across 9 dimensions: reputation, delivery, quality, financial stability, ESG.',
    detail: 'VoltX Energy: delivery 96%, quality 92%, ESG 82, risk 12. ISO 9001 certified. 4.8/5 rating. RECOMMENDED as primary supplier.',
    duration: 2000,
  },
  {
    id: 5,
    title: 'AI Negotiates Pricing',
    icon: DollarSign,
    color: 'var(--brand-green)',
    agent: 'Autonomous Negotiation Agent',
    description: 'Negotiation started at $55/unit (market rate). Agent conducts multi-round negotiation strategy.',
    detail: 'Round 1: Ask $55 → Counter $52 → AI $49 | Round 2: Supplier $49 → AI $48/unit. Final: $48/unit, 48-day terms. 13% below market. Savings: $7/unit × 50,000 = $350,000.',
    duration: 3000,
  },
  {
    id: 6,
    title: 'Supplier Fails Sanctions Screening',
    icon: AlertTriangle,
    color: 'var(--brand-red)',
    agent: 'Risk & Compliance Agent',
    description: 'AsiaTrade Co. (backup candidate) flagged with 78% OFAC SDN match. Engagement automatically blocked.',
    detail: 'SANCTIONS ALERT: AsiaTrade Co. matches OFAC SDN list with 78% confidence. Entity blocked. Case APR-002 created for legal review. Falling back to VoltX Energy as primary.',
    duration: 2000,
  },
  {
    id: 7,
    title: 'Alternative Supplier Recommended',
    icon: RefreshCw,
    color: 'var(--brand-gold)',
    agent: 'Alternative Supplier Agent',
    description: 'VoltX Energy confirmed as primary. BattCo Ltd. (Japan) pre-qualified as backup. Both cleared compliance.',
    detail: 'VoltX Energy: OFAC clear, AML clear, KYC verified, ISO 9001 valid. APPROVED for engagement. ESG score 82/100. Risk score 12/100 (Low).',
    duration: 1500,
  },
  {
    id: 8,
    title: 'Executive Approval Requested',
    icon: User,
    color: 'var(--brand-purple)',
    agent: 'Human-in-the-Loop',
    description: 'Contract value $2.4M exceeds $500K automated threshold. Approval request APR-001 sent to Procurement Director.',
    detail: 'APPROVAL REQUEST: VoltX Energy Supply Agreement | Value: $2,400,000 | Risk: LOW | AI Confidence: 94% | RECOMMEND: Approve | Deadline: 48h | Assigned: J. Doe',
    duration: 2000,
  },
  {
    id: 9,
    title: 'UiPath Robot Creates Purchase Order',
    icon: Zap,
    color: 'var(--brand-green)',
    agent: 'UiPath RPA Robot',
    description: 'Executive approves. UiPath robot immediately creates PO-2026-1205 in SAP, sends email to VoltX Energy, updates Salesforce.',
    detail: 'RPA EXECUTED: PO-2026-1205 created in SAP | Supplier record updated in Salesforce | Confirmation email sent via Outlook | Teams notification to supply chain team | PDF contract uploaded to SharePoint.',
    duration: 2000,
  },
  {
    id: 10,
    title: 'Shipment Begins & Tracked',
    icon: Truck,
    color: 'var(--brand-blue)',
    agent: 'Logistics Optimization Agent',
    description: 'SHP-2026-001 dispatched from Seoul. Route optimized: Seoul → Busan Port → LA Port → Chicago. ETA 18 days.',
    detail: 'SHIPMENT SHP-001: Seoul → Los Angeles (Maersk Line). Estimated: 18 days. Container: MSCU4821001. Tracking active. Cost: $12,400 (8.4% below alternative routes).',
    duration: 1500,
  },
  {
    id: 11,
    title: 'Factory Fire Detected in Shenzhen',
    icon: Zap,
    color: 'var(--brand-red)',
    agent: 'Disruption Prediction Agent',
    description: 'Breaking: Fire at Shenzhen Industrial Zone. SinoTech Ltd. (backup semiconductor supplier) at 45% capacity.',
    detail: 'DISRUPTION ALERT: Factory fire at Shenzhen Industrial Zone, China. SinoTech Ltd. primary facility affected. Capacity: 45%. Duration estimate: 30+ days. Disruption probability: 94%.',
    duration: 2000,
  },
  {
    id: 12,
    title: 'AI Predicts Supply Delay',
    icon: AlertTriangle,
    color: 'var(--brand-amber)',
    agent: 'Disruption Prediction Agent',
    description: 'Semiconductor supply chain impact modeled. 30-day gap identified. Financial impact: $2.1M if unresolved.',
    detail: 'IMPACT ANALYSIS: SinoTech semiconductor shortfall affects Q2 production. Delay: 30-45 days. Revenue impact: $2.1M. Activating Alternative Supplier Agent immediately.',
    duration: 1500,
  },
  {
    id: 13,
    title: 'Alternative Supplier Identified',
    icon: Search,
    color: 'var(--brand-green)',
    agent: 'Alternative Supplier Agent',
    description: 'TaipeiTech Corp (Taiwan) identified as primary backup. 91/100 score. Immediate availability. +6% cost premium.',
    detail: 'ALTERNATIVE FOUND: TaipeiTech Corp, Taiwan. Score: 91/100. Availability: Immediate. Price delta: +6% ($84,000 premium). Compliance: CLEAR. Recommendation: APPROVE as emergency source.',
    duration: 2000,
  },
  {
    id: 14,
    title: 'AI Negotiates Emergency Contract',
    icon: DollarSign,
    color: 'var(--brand-gold)',
    agent: 'Autonomous Negotiation Agent',
    description: 'Emergency negotiation with TaipeiTech Corp. $2.52/unit agreed (vs $2.40 SinoTech). 7-day delivery committed.',
    detail: 'EMERGENCY NEGOTIATION: TaipeiTech Corp. Initial: $2.80 → Final: $2.52/unit. 7-day expedited delivery. Quality guarantee included. Total premium: $60,000 vs $2.1M disruption cost. ROI: 35x.',
    duration: 2000,
  },
  {
    id: 15,
    title: 'Human Approves Budget Increase',
    icon: User,
    color: 'var(--brand-purple)',
    agent: 'Human-in-the-Loop',
    description: '$60K budget increase approved by Director. AI provided full cost-benefit showing 35x ROI vs disruption impact.',
    detail: 'APPROVAL APR-003: Budget increase $60,000 for TaipeiTech emergency sourcing. Approved by: J. Doe, Procurement Director. Reason: Cost avoidance $2.1M vs $60K premium. Approved 14:15 UTC.',
    duration: 1500,
  },
  {
    id: 16,
    title: 'ERP Updated Automatically',
    icon: Zap,
    color: 'var(--brand-green)',
    agent: 'UiPath RPA Robot',
    description: 'UiPath robots update SAP with new supplier, create PO-2026-1206, update Oracle inventory forecast, notify Teams.',
    detail: 'RPA BATCH: SAP supplier master updated | PO-2026-1206 created ($126,000) | Oracle ERP inventory forecast revised | Salesforce opportunity updated | Teams alert to VP Supply Chain | Audit log entry created.',
    duration: 2000,
  },
  {
    id: 17,
    title: 'Dashboard Shows Uninterrupted Supply',
    icon: CheckCircle,
    color: 'var(--brand-green)',
    agent: 'Supply Chain Health: 94/100',
    description: 'End-to-end autonomous response completed. Supply continuity maintained. Zero production downtime. AI-to-resolution: 4.2 minutes.',
    detail: 'OUTCOME: Supply chain disruption neutralized. VoltX batteries arriving day 18. TaipeiTech semiconductors arriving day 7. Savings vs disruption: $2,040,000. Health score improved to 94/100. Full audit trail generated.',
    duration: 1000,
  },
]

export default function DemoFlow() {
  const [running, setRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    if (!running || currentStep >= DEMO_STEPS.length - 1) return
    const step = DEMO_STEPS[currentStep]
    if (!step) return

    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(prev => prev + 1)
    }, step.duration)

    return () => clearTimeout(timer)
  }, [running, currentStep])

  useEffect(() => {
    if (currentStep >= DEMO_STEPS.length) {
      setCompletedSteps(prev => [...prev, DEMO_STEPS.length - 1])
      setRunning(false)
    }
  }, [currentStep])

  function startDemo() {
    setRunning(true)
    setCurrentStep(0)
    setCompletedSteps([])
    setExpanded(null)
  }

  function resetDemo() {
    setRunning(false)
    setCurrentStep(-1)
    setCompletedSteps([])
    setExpanded(null)
  }

  const progress = completedSteps.length / DEMO_STEPS.length * 100

  return (
    <div className="space-y-5">
      {/* Header controls */}
      <div className="sg-card flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--brand-text)' }}>
            Live Demo Flow: Lithium Battery Crisis Response
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
            End-to-end autonomous procurement — from inventory alert to uninterrupted supply in 4.2 minutes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Progress</div>
            <div className="text-sm font-bold" style={{ color: 'var(--brand-gold)' }}>
              {completedSteps.length}/{DEMO_STEPS.length} steps
            </div>
          </div>
          <button onClick={resetDemo} className="btn-ghost flex items-center gap-1.5 text-sm px-3 py-2">
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={startDemo}
            disabled={running}
            className="btn-gold flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-50"
          >
            <Play size={14} />
            {running ? 'Running...' : currentStep >= 0 ? 'Replay' : 'Run Demo'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ height: '6px' }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%`, transition: 'width 0.5s ease' }} />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {DEMO_STEPS.map((step, idx) => {
          const Icon = step.icon
          const isCompleted = completedSteps.includes(idx)
          const isActive = currentStep === idx && running
          const isVisible = isCompleted || isActive || idx <= Math.max(currentStep, 0)

          return (
            <div
              key={step.id}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                border: isActive
                  ? `1px solid ${step.color}`
                  : isCompleted
                  ? '1px solid rgba(124,184,74,0.3)'
                  : '1px solid var(--brand-border)',
                background: isActive
                  ? `rgba(${step.color === 'var(--brand-red)' ? '212,90,74' : step.color === 'var(--brand-green)' ? '124,184,74' : '201,168,76'},0.05)`
                  : 'var(--brand-surface)',
                opacity: !isVisible && currentStep >= 0 ? 0.35 : 1,
              }}
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => isCompleted && setExpanded(expanded === idx ? null : idx)}
              >
                {/* Step number / status */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: isCompleted
                      ? 'rgba(124,184,74,0.15)'
                      : isActive
                      ? `rgba(201,168,76,0.15)`
                      : 'var(--brand-surface-light)',
                    border: isCompleted
                      ? '1px solid rgba(124,184,74,0.4)'
                      : isActive
                      ? '1px solid rgba(201,168,76,0.4)'
                      : '1px solid var(--brand-border)',
                  }}>
                  {isCompleted ? (
                    <CheckCircle size={16} style={{ color: 'var(--brand-green)' }} />
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--brand-gold)', borderTopColor: 'transparent' }} />
                  ) : (
                    <span className="text-xs font-bold" style={{ color: 'var(--brand-text-dim)' }}>{step.id}</span>
                  )}
                </div>

                {/* Icon */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${step.color}18` }}>
                  <Icon size={15} style={{ color: step.color }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: isActive ? 'var(--brand-text)' : isCompleted ? 'var(--brand-text)' : 'var(--brand-text-muted)' }}>
                      {step.title}
                    </span>
                    {isActive && (
                      <span className="chip chip-gold" style={{ fontSize: '9px' }}>Running</span>
                    )}
                    {isCompleted && (
                      <span className="chip chip-green" style={{ fontSize: '9px' }}>Done</span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>
                    {step.agent}
                  </div>
                  {(isActive || isCompleted) && (
                    <div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--brand-text-muted)' }}>
                      {step.description}
                    </div>
                  )}
                </div>

                {isCompleted && (
                  <ChevronRight
                    size={14}
                    style={{
                      color: 'var(--brand-text-dim)',
                      transform: expanded === idx ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>

              {/* Expanded detail */}
              {expanded === idx && isCompleted && (
                <div className="px-4 pb-4">
                  <div className="rounded-lg p-3 font-mono text-xs leading-relaxed"
                    style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)', color: 'var(--brand-green)' }}>
                    {step.detail}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Completion summary */}
      {completedSteps.length === DEMO_STEPS.length && (
        <div className="sg-card" style={{ borderColor: 'rgba(124,184,74,0.3)', background: 'rgba(124,184,74,0.05)' }}>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={20} style={{ color: 'var(--brand-green)' }} />
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--brand-green)' }}>Demo Complete — Full Lifecycle Executed</div>
              <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>From inventory alert to supply continuity in 4 minutes 12 seconds</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'AI Agents Deployed', value: '8' },
              { label: 'Human Approvals', value: '2' },
              { label: 'UiPath Robot Actions', value: '12' },
              { label: 'Cost Avoidance', value: '$2.1M' },
            ].map(m => (
              <div key={m.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(124,184,74,0.08)', border: '1px solid rgba(124,184,74,0.2)' }}>
                <div className="text-xl font-black" style={{ color: 'var(--brand-green)' }}>{m.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
