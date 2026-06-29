import AIAssistant from '@/components/shared/AIAssistant'
import AppLayout from '@/components/shared/AppLayout'
import DisruptionCenter from '@/components/disruption/DisruptionCenter'

export default function DisruptionPage() {
  return (
    <AppLayout activeTab="Suppliers">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Disruption Command Center</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Real-time disruption detection, prediction, and automated response</p>
        </div>
        <button className="btn-gold text-sm">Run Simulation</button>
      </div>
      <DisruptionCenter />
      <AIAssistant />
    </AppLayout>
  )
}
