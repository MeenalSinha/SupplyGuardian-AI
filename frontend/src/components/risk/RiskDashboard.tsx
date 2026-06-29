'use client'

import { AlertTriangle, Shield, XCircle, CheckCircle, Clock } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const riskAlerts = [
  { id: 'R-001', type: 'Sanctions', supplier: 'AsiaTrade Co.', severity: 'Critical', detail: 'OFAC SDN list match detected', status: 'Pending Review', date: 'Mar 21, 2026' },
  { id: 'R-002', type: 'Geo-Political', supplier: 'Global Parts Ltd.', severity: 'High', detail: 'Taiwan Strait escalation risk elevated', status: 'Monitoring', date: 'Mar 21, 2026' },
  { id: 'R-003', type: 'Financial', supplier: 'MicroParts Inc.', severity: 'Medium', detail: 'Q4 revenue decline 18%, cash flow concerns', status: 'Under Review', date: 'Mar 20, 2026' },
  { id: 'R-004', type: 'Cybersecurity', supplier: 'SinoTech Ltd.', severity: 'Medium', detail: 'ISO 27001 certification expired', status: 'Action Required', date: 'Mar 19, 2026' },
  { id: 'R-005', type: 'ESG', supplier: 'MidEast Metals', severity: 'Low', detail: 'Environmental compliance report overdue', status: 'Monitoring', date: 'Mar 18, 2026' },
]

const complianceChecks = [
  { label: 'OFAC Sanctions Screening', passed: 127, failed: 1, total: 128 },
  { label: 'KYC Verification', passed: 124, failed: 4, total: 128 },
  { label: 'AML Checks', passed: 126, failed: 2, total: 128 },
  { label: 'ISO Certification Valid', passed: 118, failed: 10, total: 128 },
  { label: 'Tax Documents Filed', passed: 125, failed: 3, total: 128 },
  { label: 'Insurance Coverage', passed: 122, failed: 6, total: 128 },
]

const radarData = [
  { metric: 'Sanctions', score: 88 },
  { metric: 'Financial', score: 74 },
  { metric: 'Cyber', score: 82 },
  { metric: 'Geo-Political', score: 65 },
  { metric: 'ESG', score: 79 },
  { metric: 'Legal', score: 91 },
]

const severityColors: Record<string, string> = {
  Critical: 'chip-red',
  High: 'chip-amber',
  Medium: 'chip-gold',
  Low: 'chip-muted',
}

export default function RiskDashboard() {
  return (
    <div className="space-y-5">
      {/* Top KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="sg-card" style={{ borderColor: 'rgba(212,90,74,0.3)', background: 'rgba(212,90,74,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={14} style={{ color: 'var(--brand-red)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>Critical Alerts</span>
          </div>
          <div className="text-3xl font-black" style={{ color: 'var(--brand-red)' }}>1</div>
          <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Requires immediate action</div>
        </div>
        <div className="sg-card" style={{ borderColor: 'rgba(212,146,74,0.3)', background: 'rgba(212,146,74,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: 'var(--brand-amber)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>High Risk</span>
          </div>
          <div className="text-3xl font-black" style={{ color: 'var(--brand-amber)' }}>4</div>
          <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Under active monitoring</div>
        </div>
        <div className="sg-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} style={{ color: 'var(--brand-green)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>Compliant Suppliers</span>
          </div>
          <div className="text-3xl font-black" style={{ color: 'var(--brand-green)' }}>114</div>
          <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Out of 128 total</div>
        </div>
        <div className="sg-card">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} style={{ color: 'var(--brand-gold)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>Risk Score (Portfolio)</span>
          </div>
          <div className="text-3xl font-black" style={{ color: 'var(--brand-gold)' }}>24</div>
          <div className="text-xs mt-1" style={{ color: 'var(--brand-text-dim)' }}>Low overall risk</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Active Risk Alerts */}
        <div className="col-span-2 sg-card">
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Active Risk Alerts</div>
          <table className="sg-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Supplier</th>
                <th>Severity</th>
                <th>Detail</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {riskAlerts.map((r) => (
                <tr key={r.id} className="cursor-pointer">
                  <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--brand-text-dim)' }}>{r.id}</td>
                  <td style={{ fontSize: '12px' }}>{r.type}</td>
                  <td style={{ fontSize: '12px', fontWeight: 500 }}>{r.supplier}</td>
                  <td><span className={`chip ${severityColors[r.severity]}`} style={{ fontSize: '10px' }}>{r.severity}</span></td>
                  <td style={{ fontSize: '11px', color: 'var(--brand-text-muted)', maxWidth: '160px' }}>
                    <span className="block truncate">{r.detail}</span>
                  </td>
                  <td><span className="chip chip-muted" style={{ fontSize: '10px' }}>{r.status}</span></td>
                  <td style={{ fontSize: '11px', color: 'var(--brand-text-dim)' }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Risk Radar */}
        <div className="sg-card">
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>Risk Profile Radar</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--brand-border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'var(--brand-text-muted)' }} />
              <Radar name="Risk" dataKey="score" stroke="var(--brand-gold)" fill="var(--brand-gold)" fillOpacity={0.1} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance checks */}
      <div className="sg-card">
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Compliance Check Status</div>
        <div className="grid grid-cols-3 gap-4">
          {complianceChecks.map((c) => (
            <div key={c.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: 'var(--brand-text-muted)' }}>{c.label}</span>
                <span style={{ color: 'var(--brand-text-dim)' }}>{c.passed}/{c.total}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(c.passed / c.total) * 100}%`,
                    background: c.failed > 5 ? 'var(--brand-red)' : c.failed > 2 ? 'var(--brand-amber)' : 'var(--brand-green)',
                  }}
                />
              </div>
              {c.failed > 0 && (
                <div className="text-xs mt-1" style={{ color: 'var(--brand-red)', fontSize: '10px' }}>
                  {c.failed} failed
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
