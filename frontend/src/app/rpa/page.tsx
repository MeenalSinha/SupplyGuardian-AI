import AppLayout from '@/components/shared/AppLayout'
import RPAPanel from '@/components/shared/RPAPanel'
import AIAssistant from '@/components/shared/AIAssistant'

export default function RPAPage() {
  return (
    <AppLayout activeTab="Procurement">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>UiPath RPA Execution</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
          Deterministic robot automation across SAP, Oracle, Salesforce, Outlook, and Microsoft Teams
        </p>
      </div>
      <RPAPanel />
      <AIAssistant />
    </AppLayout>
  )
}
