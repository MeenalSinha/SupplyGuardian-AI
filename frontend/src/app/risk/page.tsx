import AIAssistant from '@/components/shared/AIAssistant'
import AppLayout from '@/components/shared/AppLayout'
import RiskDashboard from '@/components/risk/RiskDashboard'

export default function RiskPage() {
  return (
    <AppLayout activeTab="Risk Center">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Risk & Compliance Center</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Sanctions screening, compliance monitoring, and vendor risk management</p>
      </div>
      <RiskDashboard />
      <AIAssistant />
    </AppLayout>
  )
}
