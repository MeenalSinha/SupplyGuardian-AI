import AppLayout from '@/components/shared/AppLayout'
import DemoFlow from '@/components/demo/DemoFlow'

export default function DemoPage() {
  return (
    <AppLayout activeTab="Home">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Interactive Demo Flow</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
          Watch SupplyGuardian AI autonomously respond to a real supply chain crisis — step by step
        </p>
      </div>
      <DemoFlow />
    </AppLayout>
  )
}
