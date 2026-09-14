'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, CheckCircle, ShieldAlert, DollarSign, Activity, FileText, AlertTriangle, RotateCcw } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TraceEvent {
  timestamp: string
  agent: string
  action: string
  detail: string
  tool_name?: string
}

interface Candidate {
  name: string
  country: string
  score: number
  price_estimate: number
  on_time_delivery_pct: number
}

interface WorkflowResult {
  workflow: string
  demo_mode: boolean
  item: string
  quantity: number
  initial_estimated_value: number
  negotiated_total: number
  total_savings: number
  approval_required: boolean
  approval_threshold: number
  top_supplier: { name?: string; risk_score?: number }
  blocked_suppliers: Array<{ supplier: string; risk_level: string; flags: string[] }>
  steps: {
    planning?: { plan?: string }
    discovery?: { candidates?: Candidate[]; total_found?: number }
    risk?: { blocked_suppliers?: any[]; cleared_suppliers?: any[] }
    negotiation?: {
      counter_price?: number
      total_initial?: number
      total_negotiated?: number
      total_savings?: number
      formula?: string
      savings_per_unit?: number
    }
    approval?: { message?: string; status?: string }
  }
  execution_trace: TraceEvent[]
  completed_at: string
  error?: string
}

type DemoPhase = 'idle' | 'loading' | 'done' | 'approved' | 'error'

const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
const fmtUnit = (n: number) => `$${n.toFixed(2)}`

// Agent label → brand color variable
const agentColor = (agent: string): string => {
  if (agent.includes('Planner') || agent === 'System') return 'var(--brand-gold)'
  if (agent.includes('Research') || agent.includes('Supplier')) return '#A78BFA'
  if (agent.includes('Risk') || agent.includes('Compliance')) return 'var(--brand-red)'
  if (agent.includes('Negotiation')) return 'var(--brand-green)'
  if (agent.includes('Policy')) return 'var(--brand-amber)'
  if (agent.includes('Approval')) return '#FB923C'
  if (agent.includes('UiPath')) return '#818CF8'
  return 'var(--brand-text-muted)'
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function CommandCenter() {
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [result, setResult] = useState<WorkflowResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [visibleTraceCount, setVisibleTraceCount] = useState(0)
  const traceRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (phase === 'done' && result && visibleTraceCount < result.execution_trace.length) {
      timerRef.current = setTimeout(() => setVisibleTraceCount(c => c + 1), 300)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase, result, visibleTraceCount])

  useEffect(() => {
    if (traceRef.current) traceRef.current.scrollTop = traceRef.current.scrollHeight
  }, [visibleTraceCount])

  const startDemo = async () => {
    setPhase('loading')
    setResult(null)
    setErrorMsg('')
    setVisibleTraceCount(0)
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/agents/workflow/full-procurement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: 'lithium-ion battery cells', quantity: 10000, estimated_value: 510000.0 }),
      })
      if (!response.ok) throw new Error(`Backend returned ${response.status}: ${await response.text()}`)
      const data: WorkflowResult = await response.json()
      setResult(data)
      setPhase('done')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to the SupplyGuardian backend.')
      setPhase('error')
    }
  }

  const handleApprove = () => setPhase('approved')
  const reset = () => { setPhase('idle'); setResult(null); setErrorMsg(''); setVisibleTraceCount(0) }

  const negotiation = result?.steps?.negotiation
  const discovery = result?.steps?.discovery
  const blocked = result?.blocked_suppliers ?? []
  const topSupplier = result?.top_supplier
  const initialTotal = negotiation?.total_initial ?? result?.initial_estimated_value ?? 0
  const negotiatedTotal = negotiation?.total_negotiated ?? result?.negotiated_total ?? 0
  const totalSavings = negotiation?.total_savings ?? result?.total_savings ?? 0
  const counterPrice = negotiation?.counter_price ?? 0
  const formula = negotiation?.formula ?? ''
  const initialUnitPrice = counterPrice > 0 ? (initialTotal / (result?.quantity ?? 1)) : 0
  const visibleTrace = result?.execution_trace.slice(0, visibleTraceCount) ?? []
  const approvalRequired = result?.approval_required ?? false
  const pendingApprovals = (phase === 'done' && approvalRequired) ? 1 : 0

  return (
    <div className="space-y-4">
      {/* ── Section divider ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-gold)' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-text-muted)' }}>
            Agent Command Center
          </span>
        </div>
        <div className="flex-1 h-px" style={{ background: 'var(--brand-border)' }} />
      </div>

      {/* ── Header KPI strip ─────────────────────────────────────────────────── */}
      <div className="sg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-base font-bold" style={{ color: 'var(--brand-text)' }}>SupplyGuardian AI</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>Autonomous Procurement Control Tower</div>
        </div>
        <div className="flex gap-6">
          {[
            { label: 'Active Cases',       value: '4',                                             color: 'var(--brand-text)' },
            { label: 'Automation Rate',    value: '87%',                                           color: 'var(--brand-green)' },
            { label: 'Savings MTD',        value: '$240K',                                         color: 'var(--brand-gold)' },
            { label: 'At-Risk Suppliers',  value: blocked.length > 0 ? String(blocked.length) : '1', color: 'var(--brand-red)' },
            { label: 'Pending Approvals',  value: String(pendingApprovals),                        color: 'var(--brand-amber)' },
          ].map(k => (
            <div key={k.label} className="text-center">
              <div className="text-xl font-black" style={{ color: k.color }}>{k.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* CENTER: Form / Results */}
        <div className="lg:col-span-2 sg-card overflow-hidden">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--brand-text)' }}>
              <Activity className="w-4 h-4" style={{ color: 'var(--brand-gold)' }} />
              {phase === 'idle' ? 'New Procurement' : 'Active Agent Run'}
            </h2>
            <div className="flex items-center gap-3">
              {phase === 'loading' && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold animate-pulse"
                  style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--brand-gold)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  Strands SDK Running
                </span>
              )}
              {(phase === 'done' || phase === 'approved' || phase === 'error') && (
                <button onClick={reset} className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: 'var(--brand-text-dim)' }}>
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* IDLE */}
          {phase === 'idle' && (
            <div className="rounded-xl p-5" style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)' }}>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { label: 'What do you need?', value: 'Lithium-ion battery cells' },
                  { label: 'Quantity',           value: '10,000 units' },
                  { label: 'Max Budget',         value: '$500,000' },
                  { label: 'Required Within',    value: '30 Days' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs mb-1" style={{ color: 'var(--brand-text-muted)' }}>{f.label}</label>
                    <div className="w-full rounded-lg p-2 text-sm" style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={startDemo}
                className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                style={{ background: 'linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-light) 100%)', color: 'var(--brand-carbon)' }}
              >
                <Play className="w-4 h-4" />
                START AGENT — Judge Mode Demo
              </button>
              <p className="text-xs text-center mt-3" style={{ color: 'var(--brand-text-dim)' }}>
                Calls the real backend • Real tool functions • Real calculations
              </p>
            </div>
          )}

          {/* LOADING */}
          {phase === 'loading' && (
            <div className="rounded-xl p-10 flex flex-col items-center justify-center" style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)' }}>
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mb-4" style={{ borderColor: 'var(--brand-gold)', borderTopColor: 'transparent' }} />
              <p className="font-semibold text-sm" style={{ color: 'var(--brand-text)' }}>Strands agents executing…</p>
              <p className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Calling backend at {BACKEND_URL}</p>
            </div>
          )}

          {/* ERROR */}
          {phase === 'error' && (
            <div className="rounded-xl p-5" style={{ background: 'rgba(212,90,74,0.06)', border: '1px solid rgba(212,90,74,0.25)' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" style={{ color: 'var(--brand-red)' }} />
                <p className="font-semibold text-sm" style={{ color: 'var(--brand-red)' }}>Backend Connection Failed</p>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--brand-text-muted)' }}>{errorMsg}</p>
              <div className="rounded-lg p-3 text-xs font-mono mb-4" style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)', color: 'var(--brand-text-muted)' }}>
                Make sure the backend is running:<br />
                <span style={{ color: 'var(--brand-text)' }}>cd backend && uvicorn app.main:app --reload</span>
              </div>
              <button onClick={reset} className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)' }}>
                Try Again
              </button>
            </div>
          )}

          {/* DONE / APPROVED */}
          {(phase === 'done' || phase === 'approved') && result && (
            <div className="rounded-xl p-5 space-y-5" style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)' }}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted)' }}>Execution Summary</div>
                <p className="text-sm" style={{ color: 'var(--brand-text)' }}>
                  Goal: Procure {result.quantity.toLocaleString()} × {result.item} within 30 days.
                </p>
              </div>

              {/* Supplier candidates */}
              {discovery?.candidates && (
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-dim)' }}>
                    Candidates Found ({discovery.total_found})
                  </div>
                  <div className="space-y-2">
                    {discovery.candidates.map((c, i) => {
                      const isBlocked = blocked.some(b => b.supplier === c.name)
                      const isTop = topSupplier?.name === c.name
                      return (
                        <div key={c.name} className="flex items-center justify-between rounded-lg p-3 text-sm" style={{
                          background: isBlocked ? 'rgba(212,90,74,0.06)' : isTop ? 'rgba(141,197,74,0.06)' : 'var(--brand-surface)',
                          border: `1px solid ${isBlocked ? 'rgba(212,90,74,0.2)' : isTop ? 'rgba(141,197,74,0.25)' : 'var(--brand-border)'}`,
                          opacity: isBlocked ? 0.7 : 1,
                        }}>
                          <div className="flex items-center gap-3">
                            <span style={{ color: 'var(--brand-text-dim)', width: 16 }}>{i + 1}.</span>
                            <div>
                              <span className="font-medium" style={{ color: isTop ? 'var(--brand-green)' : 'var(--brand-text)' }}>{c.name}</span>
                              <span className="text-xs ml-2" style={{ color: 'var(--brand-text-dim)' }}>{c.country}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span style={{ color: 'var(--brand-text-muted)' }}>{fmtUnit(c.price_estimate)}/unit</span>
                            <span style={{ color: 'var(--brand-text-muted)' }}>{c.on_time_delivery_pct}% OTD</span>
                            {isBlocked && <span className="chip chip-red">BLOCKED</span>}
                            {isTop && <span className="chip chip-green">SELECTED</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Negotiation result */}
              {negotiation && (
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-dim)' }}>Negotiation Result</div>
                  <div className="rounded-lg p-4 space-y-2 text-sm" style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--brand-text-muted)' }}>Initial Quote</span>
                      <span style={{ color: 'var(--brand-text)' }}>{result.quantity.toLocaleString()} × {fmtUnit(initialUnitPrice)} = {fmt(initialTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--brand-text-muted)' }}>Negotiated Price</span>
                      <span style={{ color: 'var(--brand-text)' }}>{result.quantity.toLocaleString()} × {fmtUnit(counterPrice)} = {fmt(negotiatedTotal)}</span>
                    </div>
                    {formula && (
                      <div className="text-xs font-mono pt-2 mt-1" style={{ borderTop: '1px solid var(--brand-border)', color: 'var(--brand-text-dim)' }}>
                        Formula: {formula}
                      </div>
                    )}
                    <div className="flex justify-between pt-2 mt-1" style={{ borderTop: '1px solid var(--brand-border)' }}>
                      <span className="font-semibold" style={{ color: 'var(--brand-gold)' }}>Total Savings</span>
                      <span className="font-bold" style={{ color: 'var(--brand-gold)' }}>{fmt(totalSavings)}</span>
                    </div>
                  </div>
                </div>
              )}

              {phase === 'approved' && (
                <div className="flex items-center gap-2 rounded-lg p-3"
                  style={{ background: 'rgba(141,197,74,0.08)', border: '1px solid rgba(141,197,74,0.2)' }}>
                  <CheckCircle className="w-4 h-4" style={{ color: 'var(--brand-green)' }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--brand-green)' }}>Approved — Simulated UiPath Execution</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>
                      In production, UiPath Maestro would now orchestrate PO generation in ERP.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Next Human Action */}
        <div className="sg-card flex flex-col">
          <h2 className="text-sm font-bold flex items-center gap-2 mb-5" style={{ color: 'var(--brand-text)' }}>
            <ShieldAlert className="w-4 h-4" style={{ color: 'var(--brand-gold)' }} />
            Next Human Action
          </h2>

          {phase === 'done' && approvalRequired && result ? (
            <div className="flex-1 rounded-xl p-4" style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <span className="chip chip-gold text-xs">Approval Required</span>
              <h3 className="text-base font-bold mt-3 mb-1" style={{ color: 'var(--brand-text)' }}>Approve Purchase</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--brand-text-muted)' }}>
                Strands Negotiator recommends {topSupplier?.name || 'selected supplier'}.
              </p>

              <div className="rounded-lg p-4 space-y-2.5 text-sm mb-4" style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)' }}>
                {[
                  { label: 'Supplier', value: topSupplier?.name, color: 'var(--brand-text)' },
                  { label: 'Negotiated Total', value: fmt(negotiatedTotal), color: 'var(--brand-text)' },
                  { label: 'Risk Score', value: `${topSupplier?.risk_score ?? 18} / 100 (Low)`, color: 'var(--brand-green)' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between">
                    <span style={{ color: 'var(--brand-text-muted)' }}>{r.label}</span>
                    <span className="font-semibold" style={{ color: r.color }}>{r.value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--brand-border)' }}>
                  <span style={{ color: 'var(--brand-text-muted)' }}>Negotiated Savings</span>
                  <span className="font-semibold flex items-center gap-0.5" style={{ color: 'var(--brand-gold)' }}>
                    <DollarSign className="w-3 h-3" />{fmt(totalSavings).replace('$', '')}
                  </span>
                </div>
              </div>

              <p className="text-xs italic mb-4" style={{ color: 'var(--brand-text-dim)' }}>
                Policy gate: Value {fmt(negotiatedTotal)} exceeds {fmt(result.approval_threshold)} autonomous threshold.
                {blocked.length > 0 && ` ${blocked.length} supplier(s) blocked for compliance.`}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleApprove} className="py-2.5 rounded-lg font-bold text-sm transition-all"
                  style={{ background: 'var(--brand-green)', color: 'var(--brand-carbon)' }}>
                  APPROVE
                </button>
                <button onClick={reset} className="py-2.5 rounded-lg font-bold text-sm transition-all"
                  style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)', color: 'var(--brand-text-muted)' }}>
                  REJECT
                </button>
              </div>
            </div>
          ) : phase === 'approved' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 rounded-xl"
              style={{ background: 'rgba(141,197,74,0.06)', border: '1px solid rgba(141,197,74,0.15)' }}>
              <CheckCircle className="w-10 h-10 mb-3" style={{ color: 'var(--brand-green)' }} />
              <h3 className="font-bold" style={{ color: 'var(--brand-text)' }}>Approved</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--brand-text-muted)' }}>Simulated UiPath Maestro execution triggered</p>
              <p className="text-xs mt-2" style={{ color: 'var(--brand-text-dim)' }}>In production: UiPath Robot generates PO in SAP ERP</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 rounded-xl"
              style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)' }}>
              <FileText className="w-8 h-8 mb-3" style={{ color: 'var(--brand-text-dim)' }} />
              <p style={{ color: 'var(--brand-text-muted)' }}>No actions required.</p>
              <p className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>
                {phase === 'loading' ? 'Agents are working…' : 'Agents are handling routine tasks.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Live Execution Trace ───────────────────────────────────────────── */}
      <div className="sg-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold" style={{ color: 'var(--brand-text)' }}>Live Execution Trace</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>
              {result ? `${visibleTrace.length} / ${result.execution_trace.length} events` : 'Awaiting run…'}
            </span>
            {result && (
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)', color: 'var(--brand-text-dim)' }}>
                Real tool call data from backend
              </span>
            )}
          </div>
        </div>
        <div
          ref={traceRef}
          className="rounded-xl p-4 h-52 overflow-y-auto font-mono text-xs space-y-1.5"
          style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)' }}
        >
          {!result && phase !== 'loading' && (
            <div className="flex gap-4" style={{ color: 'var(--brand-text-dim)' }}>
              <span style={{ color: 'var(--brand-border-light)' }}>--:--:--</span>
              <span style={{ color: 'var(--brand-gold)', width: 144 }}>System</span>
              <span>Awaiting procurement request…</span>
            </div>
          )}
          {phase === 'loading' && (
            <div className="flex gap-4">
              <span style={{ color: 'var(--brand-border-light)' }}>…</span>
              <span className="animate-pulse" style={{ color: 'var(--brand-gold)', width: 144 }}>Strands SDK</span>
              <span style={{ color: 'var(--brand-text-muted)' }}>Executing agent workflow on backend…</span>
            </div>
          )}
          {visibleTrace.map((event, i) => {
            const ts = new Date(event.timestamp).toLocaleTimeString('en-US', { hour12: false })
            const isToolCall = event.action === 'tool_call'
            const isGate = event.action === 'policy_gate' || event.action === 'gate_evaluated'
            const isResult = event.action === 'tool_result'
            return (
              <div key={i} className="flex gap-3">
                <span style={{ color: 'var(--brand-text-dim)', flexShrink: 0 }}>{ts}</span>
                <span className="shrink-0 font-semibold" style={{ color: agentColor(event.agent), width: 160 }}>{event.agent}</span>
                <span style={{
                  color: isGate ? 'var(--brand-amber)' : isToolCall || isResult ? 'var(--brand-text)' : 'var(--brand-text-muted)'
                }}>
                  {isToolCall && event.tool_name ? `[Tool: ${event.tool_name}] ` : ''}
                  {event.detail}
                </span>
              </div>
            )
          })}
          {phase === 'approved' && (
            <div className="flex gap-3">
              <span style={{ color: 'var(--brand-text-dim)', flexShrink: 0 }}>{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
              <span className="shrink-0 font-semibold" style={{ color: '#818CF8', width: 160 }}>UiPath Maestro</span>
              <span style={{ color: '#A5B4FC' }}>[Simulated] PO generation workflow triggered in ERP</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
