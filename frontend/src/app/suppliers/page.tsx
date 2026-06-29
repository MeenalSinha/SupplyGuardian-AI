import AppLayout from '@/components/shared/AppLayout'
import SupplierMarketplace from '@/components/suppliers/SupplierMarketplace'
import VendorIntelligence from '@/components/suppliers/VendorIntelligence'
import AIAssistant from '@/components/shared/AIAssistant'

export default function SuppliersPage() {
  return (
    <AppLayout activeTab="Suppliers">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Supplier Discovery & Intelligence</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Search, evaluate, and onboard global suppliers with AI-powered vendor intelligence</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm">Import List</button>
          <button className="btn-gold text-sm">Discover Suppliers</button>
        </div>
      </div>
      <div className="space-y-8">
        <SupplierMarketplace />
        <VendorIntelligence />
      </div>
      <AIAssistant />
    </AppLayout>
  )
}
