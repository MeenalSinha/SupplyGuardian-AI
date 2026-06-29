import AppLayout from '@/components/shared/AppLayout'
import SupplyChainIntelligence from '@/components/supply-chain/SupplyChainIntelligence'
import ScenarioSimulator from '@/components/supply-chain/ScenarioSimulator'
import AIAssistant from '@/components/shared/AIAssistant'
export default function IntelligencePage() {
  return (
    <AppLayout activeTab="Analytics">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Supply Chain Intelligence</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Live commodity prices, currency risk, port congestion, and scenario simulation</p>
      </div>
      <div className="space-y-8"><SupplyChainIntelligence /><ScenarioSimulator /></div>
      <AIAssistant />
    </AppLayout>
  )
}