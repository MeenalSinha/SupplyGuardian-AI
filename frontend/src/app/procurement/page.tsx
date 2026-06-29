import AppLayout from '@/components/shared/AppLayout'
import ProcurementKanban from '@/components/procurement/ProcurementKanban'
import BPMNEnhanced from '@/components/procurement/BPMNEnhanced'
import AIAssistant from '@/components/shared/AIAssistant'

export default function ProcurementPage() {
  return (
    <AppLayout activeTab="Procurement">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Procurement Pipeline</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>UiPath Maestro BPMN orchestration with XOR gateways, timers, and exception handlers</p>
        </div>
        <button className="btn-gold text-sm">+ New Case</button>
      </div>
      <div className="space-y-5">
        <BPMNEnhanced />
        <ProcurementKanban />
      </div>
      <AIAssistant />
    </AppLayout>
  )
}
