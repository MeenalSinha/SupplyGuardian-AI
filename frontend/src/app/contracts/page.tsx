import AIAssistant from '@/components/shared/AIAssistant'
import AppLayout from '@/components/shared/AppLayout'
import ContractIntelligence from '@/components/contracts/ContractIntelligence'

export default function ContractsPage() {
  return (
    <AppLayout activeTab="Contracts">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Contract Intelligence</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>AI-powered contract analysis, risk highlighting, and clause extraction</p>
        </div>
        <button className="btn-gold text-sm">Upload Contract</button>
      </div>
      <ContractIntelligence />
      <AIAssistant />
    </AppLayout>
  )
}
