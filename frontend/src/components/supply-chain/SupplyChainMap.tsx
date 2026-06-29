'use client'

import { useEffect, useRef } from 'react'
import { Truck, Factory, AlertTriangle, CheckCircle } from 'lucide-react'

const shipments = [
  { id: 'SHP-001', supplier: 'VoltX Energy', origin: 'Seoul', destination: 'Los Angeles', status: 'In Transit', eta: '5 days', value: '$128K' },
  { id: 'SHP-002', supplier: 'Nordic Metals', origin: 'Oslo', destination: 'Hamburg', status: 'Customs', eta: '2 days', value: '$180K' },
  { id: 'SHP-003', supplier: 'CapEx Solutions', origin: 'Munich', destination: 'Chicago', status: 'In Transit', eta: '8 days', value: '$67K' },
  { id: 'SHP-004', supplier: 'SinoTech Ltd.', origin: 'Shenzhen', destination: 'Vancouver', status: 'Delayed', eta: '+3 days', value: '$220K' },
  { id: 'SHP-005', supplier: 'EuroMetals AG', origin: 'Vienna', destination: 'Rotterdam', status: 'Delivered', eta: 'Arrived', value: '$145K' },
]

const factories = [
  { name: 'VoltX Energy Plant', city: 'Seoul, South Korea', status: 'Operational', capacity: 94 },
  { name: 'Nordic Mining HQ', city: 'Oslo, Norway', status: 'Operational', capacity: 78 },
  { name: 'SinoTech Fab', city: 'Shenzhen, China', status: 'Risk Alert', capacity: 45 },
  { name: 'CapEx Mfg', city: 'Munich, Germany', status: 'Operational', capacity: 88 },
  { name: 'EuroMetals Smelter', city: 'Vienna, Austria', status: 'Maintenance', capacity: 62 },
]

const statusColors: Record<string, string> = {
  'In Transit': 'chip-gold',
  'Customs': 'chip-amber',
  'Delayed': 'chip-red',
  'Delivered': 'chip-green',
  'Operational': 'chip-green',
  'Risk Alert': 'chip-red',
  'Maintenance': 'chip-amber',
}

export default function SupplyChainMap() {
  return (
    <div className="space-y-5">
      {/* Map placeholder with visual */}
      <div className="sg-card overflow-hidden" style={{ padding: 0, height: '400px' }}>
        <div className="relative w-full h-full" style={{
          background: 'linear-gradient(180deg, #0a1628 0%, #0e1f3d 50%, #0a1628 100%)',
        }}>
          {/* World map SVG approximation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--brand-text-dim)' }}>
                GLOBAL SUPPLY CHAIN MAP
              </div>
              <div className="text-xs" style={{ color: 'var(--brand-text-dim)' }}>
                Live shipment tracking · {shipments.length} active shipments
              </div>
            </div>
          </div>

          {/* Overlay dots representing supplier locations */}
          <div className="absolute inset-0">
            {/* Seoul */}
            <div className="absolute" style={{ top: '38%', left: '78%' }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--brand-green)' }} />
              <div className="text-xs mt-1 whitespace-nowrap" style={{ color: 'var(--brand-text-muted)', fontSize: '9px' }}>Seoul</div>
            </div>
            {/* Oslo */}
            <div className="absolute" style={{ top: '25%', left: '48%' }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--brand-green)' }} />
              <div className="text-xs mt-1 whitespace-nowrap" style={{ color: 'var(--brand-text-muted)', fontSize: '9px' }}>Oslo</div>
            </div>
            {/* Shenzhen */}
            <div className="absolute" style={{ top: '45%', left: '75%' }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--brand-red)' }} />
              <div className="text-xs mt-1 whitespace-nowrap" style={{ color: 'var(--brand-text-muted)', fontSize: '9px' }}>Shenzhen</div>
            </div>
            {/* Munich */}
            <div className="absolute" style={{ top: '33%', left: '50%' }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--brand-green)' }} />
              <div className="text-xs mt-1 whitespace-nowrap" style={{ color: 'var(--brand-text-muted)', fontSize: '9px' }}>Munich</div>
            </div>
            {/* Los Angeles */}
            <div className="absolute" style={{ top: '43%', left: '14%' }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--brand-gold)' }} />
              <div className="text-xs mt-1 whitespace-nowrap" style={{ color: 'var(--brand-text-muted)', fontSize: '9px' }}>Los Angeles</div>
            </div>
            {/* Chicago */}
            <div className="absolute" style={{ top: '38%', left: '19%' }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--brand-gold)' }} />
              <div className="text-xs mt-1 whitespace-nowrap" style={{ color: 'var(--brand-text-muted)', fontSize: '9px' }}>Chicago</div>
            </div>

            {/* Shipping routes (SVG lines) */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }}>
              {/* Seoul to LA */}
              <path d="M 78% 40% Q 60% 20% 14% 45%" stroke="var(--brand-gold)" strokeWidth="1" fill="none" strokeDasharray="4,4" />
              {/* Munich to Chicago */}
              <path d="M 50% 35% Q 35% 15% 19% 40%" stroke="var(--brand-blue, #4A8CD4)" strokeWidth="1" fill="none" strokeDasharray="4,4" />
              {/* Shenzhen to Vancouver */}
              <path d="M 75% 47% Q 55% 25% 12% 36%" stroke="var(--brand-red)" strokeWidth="1" fill="none" strokeDasharray="4,4" />
            </svg>
          </div>

          {/* Risk alert overlay */}
          <div className="absolute top-4 right-4 alert-banner" style={{ maxWidth: '220px' }}>
            <AlertTriangle size={13} style={{ color: 'var(--brand-red)', flexShrink: 0 }} />
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--brand-red)' }}>Disruption Alert</div>
              <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Fire risk elevated in Shenzhen. SHP-004 delayed.</div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 rounded-lg p-3" style={{ background: 'rgba(17,16,16,0.9)', border: '1px solid var(--brand-border)' }}>
            <div className="space-y-1.5">
              {[
                { color: 'var(--brand-green)', label: 'Operational Supplier' },
                { color: 'var(--brand-gold)', label: 'Destination Port' },
                { color: 'var(--brand-red)', label: 'Risk Detected' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: 'var(--brand-text-muted)', fontSize: '10px' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Active Shipments */}
        <div className="sg-card">
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Active Shipments</div>
          <table className="sg-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Route</th>
                <th>Status</th>
                <th>ETA</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--brand-text-dim)' }}>{s.id}</td>
                  <td style={{ fontSize: '11px' }}>
                    <div style={{ color: 'var(--brand-text)' }}>{s.origin}</div>
                    <div style={{ color: 'var(--brand-text-dim)' }}>{s.destination}</div>
                  </td>
                  <td><span className={`chip ${statusColors[s.status]}`} style={{ fontSize: '10px' }}>{s.status}</span></td>
                  <td style={{ fontSize: '11px', color: s.status === 'Delayed' ? 'var(--brand-red)' : 'var(--brand-text-muted)' }}>{s.eta}</td>
                  <td style={{ fontSize: '11px', fontWeight: 600 }}>{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Factory Status */}
        <div className="sg-card">
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Factory Status</div>
          <div className="space-y-3">
            {factories.map((f) => (
              <div key={f.name} className="flex items-center gap-3">
                <Factory size={14} style={{ color: 'var(--brand-text-dim)', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate" style={{ color: 'var(--brand-text)' }}>{f.name}</span>
                    <span className={`chip ${statusColors[f.status]} ml-2`} style={{ fontSize: '9px', flexShrink: 0 }}>{f.status}</span>
                  </div>
                  <div className="text-xs mb-1" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>{f.city}</div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{
                      width: `${f.capacity}%`,
                      background: f.capacity > 80 ? 'var(--brand-green)' : f.capacity > 50 ? 'var(--brand-amber)' : 'var(--brand-red)',
                    }} />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-dim)', fontSize: '10px' }}>
                    {f.capacity}% capacity
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
