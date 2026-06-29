'use client'

export function Skeleton({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: 'var(--brand-border)', ...style }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="sg-card space-y-3">
      <Skeleton style={{ height: '16px', width: '40%' }} />
      <Skeleton style={{ height: '32px', width: '60%' }} />
      <Skeleton style={{ height: '12px', width: '80%' }} />
      <Skeleton style={{ height: '12px', width: '50%' }} />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="sg-card">
      <Skeleton style={{ height: '16px', width: '30%', marginBottom: '16px' }} />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton style={{ height: '14px', flex: 2 }} />
            <Skeleton style={{ height: '14px', flex: 1 }} />
            <Skeleton style={{ height: '14px', flex: 1 }} />
            <Skeleton style={{ height: '14px', flex: 1 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="sg-card">
      <Skeleton style={{ height: '16px', width: '40%', marginBottom: '16px' }} />
      <Skeleton style={{ height: '180px', width: '100%', borderRadius: '8px' }} />
    </div>
  )
}
