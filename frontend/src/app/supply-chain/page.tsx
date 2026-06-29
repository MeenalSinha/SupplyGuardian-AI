import AIAssistant from '@/components/shared/AIAssistant'
import AppLayout from '@/components/shared/AppLayout'
import SupplyChainMap from '@/components/supply-chain/SupplyChainMap'

export default function SupplyChainPage() {
  return (
    <AppLayout activeTab="Suppliers">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Supply Chain Control Tower</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Real-time global shipment tracking and factory monitoring</p>
      </div>
      <SupplyChainMap />
      <AIAssistant />
    </AppLayout>
  )
}
