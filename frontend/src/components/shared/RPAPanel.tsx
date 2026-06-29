'use client'

import { useState } from 'react'
import { Zap, CheckCircle, Clock, Play, RotateCcw, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

const RPA_TASKS = [
  {
    id: 'RPA-001', name: 'Create Supplier in SAP', system: 'SAP ERP',
    trigger: 'Approval: APR-001', status: 'completed',
    log: 'SAP_T-CODE: XK01 | Supplier: VoltX Energy | Account Group: LIEF | Created: 2026-03-21 10:22:45',
    duration: '4.2s',
  },
  {
    id: 'RPA-002', name: 'Generate Purchase Order', system: 'SAP ERP',
    trigger: 'Approval: APR-001', status: 'completed',
    log: 'PO-2026-1205 | Vendor: VoltX Energy | Item: Battery Cells | Qty: 50,000 | Value: $2,400,000 | Plant: CH01',
    duration: '6.8s',
  },
  {
    id: 'RPA-003', name: 'Update Oracle Inventory', system: 'Oracle ERP',
    trigger: 'PO-2026-1205 confirmed', status: 'completed',
    log: 'SKU LithiumBattery_4821 | Expected receipt: +50,000 units | ETA: +18 days | Forecast updated',
    duration: '3.1s',
  },
  {
    id: 'RPA-004', name: 'Send Outlook Confirmation', system: 'Microsoft Outlook',
    trigger: 'PO-2026-1205 created', status: 'completed',
    log: 'Email sent to: procurement@voltxenergy.kr | CC: j.doe@company.com | Subject: PO-2026-1205 Confirmed | Attachments: PO.pdf, NDA.pdf',
    duration: '1.4s',
  },
  {
    id: 'RPA-005', name: 'Notify Teams Channel', system: 'Microsoft Teams',
    trigger: 'PO-2026-1205 created', status: 'completed',
    log: 'Posted to: #supply-chain-ops | Message: PO-2026-1205 issued to VoltX Energy for 50,000 Battery Cells. Delivery ETA: Apr 8.',
    duration: '0.9s',
  },
  {
    id: 'RPA-006', name: 'Update Salesforce Record', system: 'Salesforce',
    trigger: 'Supplier onboarded', status: 'completed',
    log: 'Account: VoltX Energy | Opportunity: Q2-Battery-Supply | Stage: Closed-Won | Amount: $2,400,000 | Updated',
    duration: '2.7s',
  },
  {
    id: 'RPA-007', name: 'Upload Contract to SharePoint', system: 'SharePoint',
    trigger: 'Contract signed', status: 'running',
    log: 'Uploading VoltX_Supply_Agreement_2026.pdf to /Procurement/Contracts/2026/Q2/ ...',
    duration: '...',
  },
  {
    id: 'RPA-008', name: 'Create ERP Supplier (TaipeiTech)', system: 'SAP ERP',
    trigger: 'Approval: APR-003', status: 'queued',
    log: 'Pending approval before execution',
    duration: '-',
  },
]

const statusStyles: Record<string, { color: string; bg: string; label: string }> = {
  completed: { color: 'var(--brand-green)', bg: 'rgba(124,184,74,0.1)', label: 'Completed' },
  running: { color: 'var(--brand-gold)', bg: 'rgba(201,168,76,0.1)', label: 'Running' },
  queued: { color: 'var(--brand-text-dim)', bg: 'var(--brand-surface-light)', label: 'Queued' },
  failed: { color: 'var(--brand-red)', bg: 'rgba(212,90,74,0.1)', label: 'Failed' },
}

export default function RPAPanel() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [triggering, setTriggering] = useState(false)

  async function triggerRobot() {
    setTriggering(true)
    await new Promise(r => setTimeout(r, 1500))
    setTriggering(false)
    toast.success('UiPath robot triggered — RPA-008 queued for execution')
  }

  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>UiPath RPA Execution Log</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
            Deterministic robot automation across SAP, Oracle, Salesforce, Outlook, Teams
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle size={12} style={{ color: 'var(--brand-green)' }} />
            <span className="text-xs" style={{ color: 'var(--brand-green)' }}>
              {RPA_TASKS.filter(t => t.status === 'completed').length} completed
            </span>
          </div>
          <button
            onClick={triggerRobot}
            disabled={triggering}
            className="btn-gold flex items-center gap-1.5 text-xs px-3 py-1.5 disabled:opacity-60"
          >
            <Play size={11} />
            {triggering ? 'Triggering...' : 'Trigger Robot'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {RPA_TASKS.map(task => {
          const style = statusStyles[task.status]
          return (
            <div
              key={task.id}
              className="rounded-lg overflow-hidden cursor-pointer"
              style={{ border: `1px solid ${expanded === task.id ? 'var(--brand-gold-dark)' : 'var(--brand-border)'}` }}
              onClick={() => setExpanded(expanded === task.id ? null : task.id)}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Status icon */}
                <div className="flex-shrink-0">
                  {task.status === 'completed' ? (
                    <CheckCircle size={14} style={{ color: 'var(--brand-green)' }} />
                  ) : task.status === 'running' ? (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--brand-gold)', borderTopColor: 'transparent' }} />
                  ) : (
                    <Clock size={14} style={{ color: 'var(--brand-text-dim)' }} />
                  )}
                </div>

                {/* Robot icon */}
                <Zap size={13} style={{ color: style.color, flexShrink: 0 }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{task.name}</span>
                    <span className="chip chip-muted" style={{ fontSize: '9px' }}>{task.system}</span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)' }}>
                    Triggered by: {task.trigger}
                  </div>
                </div>

                {/* Duration + status */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-mono" style={{ color: 'var(--brand-text-dim)' }}>{task.duration}</span>
                  <span
                    className="chip"
                    style={{ fontSize: '9px', background: style.bg, color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>
              </div>

              {/* Expanded log */}
              {expanded === task.id && (
                <div className="px-4 pb-3">
                  <div className="rounded-lg px-3 py-2 font-mono text-xs leading-relaxed"
                    style={{ background: 'var(--brand-carbon)', border: '1px solid var(--brand-border)', color: task.status === 'completed' ? 'var(--brand-green)' : 'var(--brand-gold)' }}>
                    <span style={{ color: 'var(--brand-text-dim)' }}>robot@uipath:~$ </span>
                    {task.log}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
