'use client'

import { useState } from 'react'
import { CheckCircle, Clock, AlertTriangle, ChevronRight, GitBranch, Timer, RotateCcw, User, Bot, Zap } from 'lucide-react'

type NodeType = 'start' | 'end' | 'task-ai' | 'task-human' | 'task-rpa' | 'gateway-xor' | 'gateway-and' | 'timer' | 'error' | 'subprocess'

interface BPMNNode {
  id: string
  type: NodeType
  label: string
  sublabel?: string
  status: 'completed' | 'active' | 'pending' | 'error' | 'skipped'
  sla?: string
  lane: 'ai' | 'human' | 'rpa' | 'system'
  exceptionHandler?: string
}

const LANES = [
  { id: 'ai', label: 'AI Agent Layer', color: 'var(--brand-gold)' },
  { id: 'human', label: 'Human Governance', color: '#4A8CD4' },
  { id: 'rpa', label: 'UiPath RPA Layer', color: 'var(--brand-green)' },
  { id: 'system', label: 'System / Monitoring', color: 'var(--brand-text-dim)' },
]

const BPMN_NODES: BPMNNode[] = [
  { id: 'start', type: 'start', label: 'Inventory Alert', sublabel: 'Threshold breach', status: 'completed', lane: 'system', sla: 'Instant' },
  { id: 'gateway-need', type: 'gateway-xor', label: 'Urgent?', sublabel: 'Priority routing', status: 'completed', lane: 'system' },
  { id: 'discovery', type: 'task-ai', label: 'Supplier Discovery', sublabel: 'AI searches 847 DBs', status: 'completed', lane: 'ai', sla: '< 2 min', exceptionHandler: 'No suppliers → Manual search' },
  { id: 'evaluation', type: 'task-ai', label: 'Vendor Evaluation', sublabel: '9-dimension scoring', status: 'completed', lane: 'ai', sla: '< 5 min', exceptionHandler: 'Score < 60 → Reject' },
  { id: 'gateway-risk', type: 'gateway-xor', label: 'Risk Passed?', sublabel: 'Compliance gate', status: 'completed', lane: 'system' },
  { id: 'compliance', type: 'task-ai', label: 'Compliance Screen', sublabel: 'OFAC, AML, KYC', status: 'completed', lane: 'ai', sla: '< 3 min', exceptionHandler: 'Match → Block + Case' },
  { id: 'negotiation', type: 'task-ai', label: 'AI Negotiation', sublabel: 'Multi-round pricing', status: 'active', lane: 'ai', sla: '< 30 min', exceptionHandler: 'Stall → Escalate human' },
  { id: 'timer-sla', type: 'timer', label: 'SLA Timer', sublabel: '2h negotiation limit', status: 'active', lane: 'system' },
  { id: 'gateway-value', type: 'gateway-xor', label: 'Value > $500K?', sublabel: 'Approval threshold', status: 'pending', lane: 'system' },
  { id: 'approval', type: 'task-human', label: 'Executive Approval', sublabel: 'Human-in-the-loop', status: 'pending', lane: 'human', sla: '< 24h', exceptionHandler: 'Timeout → Escalate VP' },
  { id: 'gateway-approved', type: 'gateway-xor', label: 'Approved?', sublabel: 'Decision gate', status: 'pending', lane: 'system' },
  { id: 'po-create', type: 'task-rpa', label: 'Create PO in SAP', sublabel: 'Robot XK01/ME21N', status: 'pending', lane: 'rpa', sla: '< 30 sec' },
  { id: 'gateway-parallel', type: 'gateway-and', label: 'Parallel Split', sublabel: 'Concurrent tasks', status: 'pending', lane: 'system' },
  { id: 'erp-update', type: 'task-rpa', label: 'Update Oracle ERP', sublabel: 'Inventory forecast', status: 'pending', lane: 'rpa', sla: '< 1 min' },
  { id: 'notify', type: 'task-rpa', label: 'Send Notifications', sublabel: 'Outlook + Teams', status: 'pending', lane: 'rpa', sla: '< 15 sec' },
  { id: 'shipment', type: 'task-ai', label: 'Logistics Optimization', sublabel: 'Route + carrier', status: 'pending', lane: 'ai', sla: '< 5 min' },
  { id: 'monitoring', type: 'task-ai', label: 'Continuous Monitoring', sublabel: 'Disruption watch', status: 'pending', lane: 'ai', sla: 'Ongoing' },
  { id: 'gateway-disruption', type: 'gateway-xor', label: 'Disruption?', sublabel: 'Risk event gate', status: 'pending', lane: 'system' },
  { id: 'alt-supplier', type: 'subprocess', label: 'Alternative Supplier\nSubprocess', sublabel: 'Full re-run', status: 'pending', lane: 'ai' },
  { id: 'end', type: 'end', label: 'Case Closed', sublabel: 'Audit finalized', status: 'pending', lane: 'system' },
]

const NODE_STYLES: Record<NodeType, { shape: string; bg: string; border: string; icon?: React.ReactNode }> = {
  'start': { shape: 'rounded-full', bg: 'rgba(124,184,74,0.15)', border: 'rgba(124,184,74,0.6)', icon: <div className="w-3 h-3 rounded-full" style={{ background: 'var(--brand-green)' }} /> },
  'end': { shape: 'rounded-full', bg: 'rgba(124,184,74,0.15)', border: 'rgba(124,184,74,0.8)', icon: <div className="w-3 h-3 rounded-full border-2" style={{ background: 'var(--brand-green)', borderColor: 'white' }} /> },
  'task-ai': { shape: 'rounded-xl', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.3)', icon: <Bot size={10} style={{ color: 'var(--brand-gold)' }} /> },
  'task-human': { shape: 'rounded-xl', bg: 'rgba(74,140,212,0.08)', border: 'rgba(74,140,212,0.3)', icon: <User size={10} style={{ color: '#4A8CD4' }} /> },
  'task-rpa': { shape: 'rounded-xl', bg: 'rgba(124,184,74,0.08)', border: 'rgba(124,184,74,0.3)', icon: <Zap size={10} style={{ color: 'var(--brand-green)' }} /> },
  'gateway-xor': { shape: 'rounded-lg rotate-45', bg: 'rgba(212,146,74,0.15)', border: 'rgba(212,146,74,0.5)', icon: <GitBranch size={9} style={{ color: 'var(--brand-amber)' }} /> },
  'gateway-and': { shape: 'rounded-lg rotate-45', bg: 'rgba(138,74,212,0.15)', border: 'rgba(138,74,212,0.5)', icon: <GitBranch size={9} style={{ color: '#8A4AD4' }} /> },
  'timer': { shape: 'rounded-full', bg: 'rgba(74,140,212,0.1)', border: 'rgba(74,140,212,0.4)', icon: <Timer size={9} style={{ color: '#4A8CD4' }} /> },
  'error': { shape: 'rounded-full', bg: 'rgba(212,90,74,0.1)', border: 'rgba(212,90,74,0.4)', icon: <AlertTriangle size={9} style={{ color: 'var(--brand-red)' }} /> },
  'subprocess': { shape: 'rounded-xl border-dashed', bg: 'rgba(138,74,212,0.06)', border: 'rgba(138,74,212,0.3)', icon: <RotateCcw size={10} style={{ color: '#8A4AD4' }} /> },
}

const STATUS_OVERLAY: Record<string, string> = {
  completed: 'var(--brand-green)',
  active: 'var(--brand-gold)',
  pending: 'var(--brand-text-dim)',
  error: 'var(--brand-red)',
  skipped: 'var(--brand-text-dim)',
}

export default function BPMNEnhanced() {
  const [selectedNode, setSelectedNode] = useState<BPMNNode | null>(null)

  const completedCount = BPMN_NODES.filter(n => n.status === 'completed').length
  const progress = (completedCount / BPMN_NODES.length) * 100

  return (
    <div className="sg-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>
            UiPath Maestro — BPMN Orchestration
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
            PC-2026-0321 · With XOR gateways, parallel splits, timers, exception handlers, and compensation flows
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Progress</div>
            <div className="text-sm font-bold" style={{ color: 'var(--brand-gold)' }}>{completedCount}/{BPMN_NODES.length}</div>
          </div>
        </div>
      </div>

      <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>

      {/* Lane legend */}
      <div className="flex gap-4">
        {LANES.map(l => (
          <div key={l.id} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
            <span className="text-xs" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* BPMN flow - scrollable */}
      <div className="overflow-x-auto pb-3">
        <div className="flex items-start gap-1.5 min-w-max">
          {BPMN_NODES.map((node, idx) => {
            const laneColor = LANES.find(l => l.id === node.lane)?.color || 'var(--brand-text-dim)'
            const isGateway = node.type.startsWith('gateway')
            return (
              <div key={node.id} className="flex items-center gap-1.5">
                <div
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  style={{
                    width: isGateway ? '64px' : '88px',
                    minWidth: isGateway ? '64px' : '88px',
                  }}
                >
                  {/* Lane color bar */}
                  <div className="h-0.5 mb-1.5 rounded" style={{ background: laneColor, opacity: 0.6 }} />

                  {/* Node box */}
                  <div
                    className={`p-2 ${isGateway ? 'rounded-lg' : 'rounded-xl'} text-center transition-all`}
                    style={{
                      background: selectedNode?.id === node.id
                        ? `${laneColor}15`
                        : node.status === 'completed'
                        ? 'rgba(124,184,74,0.06)'
                        : node.status === 'active'
                        ? 'rgba(201,168,76,0.08)'
                        : 'var(--brand-surface-light)',
                      border: `1px solid ${
                        selectedNode?.id === node.id
                          ? laneColor
                          : node.status === 'completed'
                          ? 'rgba(124,184,74,0.3)'
                          : node.status === 'active'
                          ? 'rgba(201,168,76,0.3)'
                          : 'var(--brand-border)'
                      }`,
                    }}
                  >
                    {/* Status icon */}
                    <div className="flex justify-center mb-1">
                      {node.status === 'completed'
                        ? <CheckCircle size={11} style={{ color: 'var(--brand-green)' }} />
                        : node.status === 'active'
                        ? <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand-gold)', borderTopColor: 'transparent' }} />
                        : <Clock size={11} style={{ color: 'var(--brand-text-dim)' }} />
                      }
                    </div>
                    <div className="text-xs font-semibold leading-tight whitespace-pre-line"
                      style={{ color: 'var(--brand-text)', fontSize: '9px' }}>
                      {node.label}
                    </div>
                    {node.sla && (
                      <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)', fontSize: '8px' }}>SLA: {node.sla}</div>
                    )}
                  </div>
                </div>

                {idx < BPMN_NODES.length - 1 && (
                  <ChevronRight size={10} style={{ color: 'var(--brand-border-light)', flexShrink: 0 }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected node detail */}
      {selectedNode && (
        <div className="rounded-xl p-4" style={{ background: 'var(--brand-surface-light)', border: '1px solid var(--brand-border)' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="chip chip-gold text-xs mb-1">{selectedNode.type.replace('-', ' ').toUpperCase()}</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>{selectedNode.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>{selectedNode.sublabel}</div>
            </div>
            <div className="text-right">
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>Lane</div>
              <div className="text-xs font-semibold" style={{ color: LANES.find(l => l.id === selectedNode.lane)?.color }}>
                {LANES.find(l => l.id === selectedNode.lane)?.label}
              </div>
            </div>
          </div>
          {selectedNode.sla && (
            <div className="flex items-center gap-2 mt-2">
              <Timer size={11} style={{ color: 'var(--brand-text-dim)' }} />
              <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>SLA: {selectedNode.sla}</span>
            </div>
          )}
          {selectedNode.exceptionHandler && (
            <div className="flex items-center gap-2 mt-1">
              <AlertTriangle size={11} style={{ color: 'var(--brand-amber)' }} />
              <span className="text-xs" style={{ color: 'var(--brand-amber)' }}>Exception: {selectedNode.exceptionHandler}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
