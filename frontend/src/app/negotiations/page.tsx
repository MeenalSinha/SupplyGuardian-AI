import AppLayout from '@/components/shared/AppLayout'
import NegotiationCenter from '@/components/negotiations/NegotiationCenter'
import NegotiationAnalytics from '@/components/negotiations/NegotiationAnalytics'
import AIAssistant from '@/components/shared/AIAssistant'

export default function NegotiationsPage() {
  return (
    <AppLayout activeTab="Procurement">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Negotiation Center</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>AI-driven negotiations with RFQ generation, multi-supplier comparison, and round-by-round analytics</p>
      </div>
      <div className="space-y-8">
        <NegotiationCenter />
        <NegotiationAnalytics />
      </div>
      <AIAssistant />
    </AppLayout>
  )
}
