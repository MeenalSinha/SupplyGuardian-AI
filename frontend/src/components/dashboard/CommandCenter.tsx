'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, CheckCircle, ShieldAlert, DollarSign, Activity, FileText, AlertTriangle, RotateCcw } from 'lucide-react'

// ─── Types matching the backend response schema ───────────────────────────────

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

// ─── Helper: format currency ──────────────────────────────────────────────────
const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
const fmtUnit = (n: number) => `$${n.toFixed(2)}`

// ─── Agent color map ──────────────────────────────────────────────────────────
const agentColor = (agent: string) => {
  if (agent.includes('Planner') || agent === 'System') return 'text-blue-400'
  if (agent.includes('Research') || agent.includes('Supplier')) return 'text-purple-400'
  if (agent.includes('Risk') || agent.includes('Compliance')) return 'text-red-400'
  if (agent.includes('Negotiation')) return 'text-green-400'
  if (agent.includes('Policy')) return 'text-yellow-400'
  if (agent.includes('Approval')) return 'text-orange-400'
  if (agent.includes('UiPath')) return 'text-indigo-400'
  return 'text-gray-400'
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function CommandCenter() {
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [result, setResult] = useState<WorkflowResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [visibleTraceCount, setVisibleTraceCount] = useState(0)
  const traceRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Animate trace events appearing one-by-one from real backend data
  useEffect(() => {
    if (phase === 'done' && result && visibleTraceCount < result.execution_trace.length) {
      timerRef.current = setTimeout(() => {
        setVisibleTraceCount(c => c + 1)
      }, 300)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase, result, visibleTraceCount])

  // Auto-scroll trace panel
  useEffect(() => {
    if (traceRef.current) {
      traceRef.current.scrollTop = traceRef.current.scrollHeight
    }
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
        body: JSON.stringify({
          item: 'lithium-ion battery cells',
          quantity: 10000,
          estimated_value: 510000.0,
        }),
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(`Backend returned ${response.status}: ${err}`)
      }

      const data: WorkflowResult = await response.json()
      setResult(data)
      setPhase('done')
    } catch (err: any) {
      console.error('Workflow API error:', err)
      setErrorMsg(err.message || 'Failed to connect to the SupplyGuardian backend.')
      setPhase('error')
    }
  }

  const handleApprove = () => {
    setPhase('approved')
  }

  const reset = () => {
    setPhase('idle')
    setResult(null)
    setErrorMsg('')
    setVisibleTraceCount(0)
  }

  // ── Derived data from real API response ──────────────────────────────────
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

  // ── Pending approvals counter (dynamic) ──────────────────────────────────
  const pendingApprovals = (phase === 'done' && approvalRequired && phase !== 'approved') ? 1 : 0

  return (
    <div className="space-y-6">
      {/* ── Header KPIs ───────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SupplyGuardian AI</h1>
          <p className="text-gray-400 mt-1">Autonomous Procurement Control Tower</p>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          {[
            { label: 'Active Cases', value: '4', color: 'text-white' },
            { label: 'Automation Rate', value: '87%', color: 'text-green-400' },
            { label: 'Savings MTD', value: '$240K', color: 'text-yellow-400' },
            { label: 'At-Risk Suppliers', value: blocked.length > 0 ? String(blocked.length) : '1', color: 'text-red-400' },
            { label: 'Pending Approvals', value: String(pendingApprovals), color: 'text-blue-400' },
          ].map(k => (
            <div key={k.label} className="text-center">
              <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-xs text-gray-400 font-medium">{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CENTER: Procurement Form / Active Run / Results ─────────────────── */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              {phase === 'idle' ? 'New Procurement' : 'Active Agent Run'}
            </h2>
            <div className="flex items-center gap-3">
              {phase === 'loading' && (
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                  Strands SDK Running
                </span>
              )}
              {(phase === 'done' || phase === 'approved' || phase === 'error') && (
                <button onClick={reset} className="text-gray-500 hover:text-gray-300 flex items-center gap-1 text-xs">
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* IDLE: procurement form */}
          {phase === 'idle' && (
            <div className="bg-gray-950/50 rounded-xl p-5 border border-gray-800/50">
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { label: 'What do you need?', value: 'Lithium-ion battery cells' },
                  { label: 'Quantity', value: '10,000 units' },
                  { label: 'Max Budget', value: '$500,000' },
                  { label: 'Required Within', value: '30 Days' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                    <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-sm">
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={startDemo}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <Play className="w-5 h-5" />
                START AGENT — Judge Mode Demo
              </button>
              <p className="text-xs text-gray-600 text-center mt-3">
                Calls the real backend • Real tool functions • Real calculations
              </p>
            </div>
          )}

          {/* LOADING: spinner while API runs */}
          {phase === 'loading' && (
            <div className="bg-gray-950/50 rounded-xl p-10 border border-gray-800/50 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white font-semibold">Strands agents executing…</p>
              <p className="text-gray-500 text-sm mt-1">Calling backend at {BACKEND_URL}</p>
            </div>
          )}

          {/* ERROR: backend not reachable */}
          {phase === 'error' && (
            <div className="bg-red-950/30 rounded-xl p-6 border border-red-800/50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-semibold">Backend Connection Failed</p>
              </div>
              <p className="text-gray-400 text-sm mb-4">{errorMsg}</p>
              <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-500 font-mono mb-4">
                Make sure the backend is running:<br />
                <span className="text-gray-300">cd backend && uvicorn app.main:app --reload</span>
              </div>
              <button onClick={reset} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                Try Again
              </button>
            </div>
          )}

          {/* DONE / APPROVED: real results from backend */}
          {(phase === 'done' || phase === 'approved') && result && (
            <div className="bg-gray-950/50 rounded-xl p-5 border border-gray-800/50 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Execution Summary</h3>
                <p className="text-gray-200 text-sm">
                  Goal: Procure {result.quantity.toLocaleString()} × {result.item} within 30 days.
                </p>
              </div>

              {/* Supplier shortlist from real tool output */}
              {discovery?.candidates && (
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Candidates Found ({discovery.total_found})
                  </h4>
                  <div className="space-y-2">
                    {discovery.candidates.map((c, i) => {
                      const isBlocked = blocked.some(b => b.supplier === c.name)
                      const isTop = topSupplier?.name === c.name
                      return (
                        <div
                          key={c.name}
                          className={`flex items-center justify-between rounded-lg p-3 border text-sm ${
                            isBlocked
                              ? 'bg-red-950/20 border-red-800/40 opacity-60'
                              : isTop
                              ? 'bg-green-950/20 border-green-700/40'
                              : 'bg-gray-900/50 border-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 w-4">{i + 1}.</span>
                            <div>
                              <span className={`font-medium ${isTop ? 'text-green-400' : 'text-gray-200'}`}>{c.name}</span>
                              <span className="text-gray-500 text-xs ml-2">{c.country}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-gray-400">{fmtUnit(c.price_estimate)}/unit</span>
                            <span className="text-gray-400">{c.on_time_delivery_pct}% OTD</span>
                            {isBlocked && (
                              <span className="text-red-400 font-semibold bg-red-900/30 px-2 py-0.5 rounded">BLOCKED</span>
                            )}
                            {isTop && (
                              <span className="text-green-400 font-semibold bg-green-900/30 px-2 py-0.5 rounded">SELECTED</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Calculated savings breakdown */}
              {negotiation && (
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Negotiation Result</h4>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Initial Quote</span>
                      <span className="text-gray-300">
                        {result.quantity.toLocaleString()} × {fmtUnit(initialUnitPrice)} = {fmt(initialTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Negotiated Price</span>
                      <span className="text-gray-300">
                        {result.quantity.toLocaleString()} × {fmtUnit(counterPrice)} = {fmt(negotiatedTotal)}
                      </span>
                    </div>
                    {formula && (
                      <div className="text-xs text-gray-600 font-mono border-t border-gray-800 pt-2 mt-1">
                        Formula: {formula}
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-800 pt-2 mt-1">
                      <span className="text-yellow-400 font-semibold">Total Savings</span>
                      <span className="text-yellow-400 font-bold">{fmt(totalSavings)}</span>
                    </div>
                  </div>
                </div>
              )}

              {phase === 'approved' && (
                <div className="flex items-center gap-2 bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-green-400 font-semibold text-sm">Approved — Simulated UiPath Execution</p>
                    <p className="text-gray-500 text-xs">
                      In production, UiPath Maestro would now orchestrate PO generation in ERP.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Next Human Action ──────────────────────────────────────── */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-500" />
            Next Human Action
          </h2>

          {phase === 'done' && approvalRequired && result ? (
            <div className="flex-1 bg-gray-800/50 rounded-xl p-5 border border-yellow-500/20">
              <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                Approval Required
              </span>
              <h3 className="text-lg font-bold text-white leading-tight mt-3">Approve Purchase</h3>
              <p className="text-gray-400 text-sm mt-1">
                Strands Negotiator recommends {topSupplier?.name || 'selected supplier'}.
              </p>

              <div className="my-5 space-y-3 bg-gray-900 rounded-lg p-4 border border-gray-700/50 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Supplier</span>
                  <span className="text-white font-semibold">{topSupplier?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Negotiated Total</span>
                  <span className="text-white font-semibold">{fmt(negotiatedTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Score</span>
                  <span className="text-green-400 font-semibold">
                    {topSupplier?.risk_score ?? 18} / 100 (Low)
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-700/50 pt-2">
                  <span className="text-gray-400">Negotiated Savings</span>
                  <span className="text-yellow-400 font-semibold flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />{fmt(totalSavings).replace('$', '')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-5 italic">
                Policy gate: Value {fmt(negotiatedTotal)} exceeds {fmt(result.approval_threshold)} autonomous threshold.
                {blocked.length > 0 && ` ${blocked.length} supplier(s) blocked for compliance issues.`}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-500 text-white rounded-lg py-2.5 font-bold transition-all"
                >
                  APPROVE
                </button>
                <button
                  onClick={reset}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg py-2.5 font-bold transition-all"
                >
                  REJECT
                </button>
              </div>
            </div>
          ) : phase === 'approved' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-green-900/10 rounded-xl border border-green-800/30">
              <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
              <h3 className="text-lg font-bold text-white">Approved</h3>
              <p className="text-sm text-gray-500 mt-1">Simulated UiPath Maestro execution triggered</p>
              <p className="text-xs text-gray-600 mt-3">
                In production: UiPath Robot generates PO in SAP ERP
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-800/20 rounded-xl border border-gray-800/50">
              <FileText className="w-10 h-10 text-gray-600 mb-3" />
              <p className="text-gray-500">No actions required.</p>
              <p className="text-sm text-gray-600 mt-1">
                {phase === 'loading' ? 'Agents are working…' : 'Agents are handling routine tasks.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Live Execution Trace ──────────────────────────────────────────── */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Live Execution Trace
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {result ? `${visibleTrace.length} / ${result.execution_trace.length} events` : 'Awaiting run…'}
            </span>
            {result && (
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">
                Real tool call data from backend
              </span>
            )}
          </div>
        </div>
        <div
          ref={traceRef}
          className="bg-gray-950 rounded-xl p-4 h-52 overflow-y-auto font-mono text-xs space-y-1.5 border border-gray-800"
        >
          {!result && phase !== 'loading' && (
            <div className="flex gap-4 text-gray-600">
              <span className="text-gray-700">--:--:--</span>
              <span className="text-blue-400 w-36">System</span>
              <span>Awaiting procurement request…</span>
            </div>
          )}
          {phase === 'loading' && (
            <div className="flex gap-4">
              <span className="text-gray-700">…</span>
              <span className="text-blue-400 w-36 animate-pulse">Strands SDK</span>
              <span className="text-gray-400">Executing agent workflow on backend…</span>
            </div>
          )}
          {visibleTrace.map((event, i) => {
            const ts = new Date(event.timestamp).toLocaleTimeString('en-US', { hour12: false })
            const isToolCall = event.action === 'tool_call'
            const isGate = event.action === 'policy_gate' || event.action === 'gate_evaluated'
            const isResult = event.action === 'tool_result'
            return (
              <div key={i} className={`flex gap-3 ${i === visibleTrace.length - 1 ? 'opacity-100' : 'opacity-90'}`}>
                <span className="text-gray-700 shrink-0">{ts}</span>
                <span className={`w-40 shrink-0 font-semibold ${agentColor(event.agent)}`}>{event.agent}</span>
                <span className={
                  isToolCall ? 'text-gray-300' :
                  isGate ? 'text-yellow-400' :
                  isResult ? 'text-gray-200' :
                  'text-gray-500'
                }>
                  {isToolCall && event.tool_name ? `[Tool: ${event.tool_name}] ` : ''}
                  {event.detail}
                </span>
              </div>
            )
          })}
          {phase === 'approved' && (
            <div className="flex gap-3">
              <span className="text-gray-700">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
              <span className="text-indigo-400 w-40 shrink-0 font-semibold">UiPath Maestro</span>
              <span className="text-indigo-300">[Simulated] PO generation workflow triggered in ERP</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
