import AppLayout from '@/components/shared/AppLayout'
import CaseManagement from '@/components/cases/CaseManagement'
import AIAssistant from '@/components/shared/AIAssistant'

export default function CasesPage() {
  return (
    <AppLayout activeTab="Procurement">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Case Management</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
          Dynamic cases with configurable stages, full audit history, and escalation workflows
        </p>
      </div>
      <CaseManagement />
      <AIAssistant />
    </AppLayout>
  )
}
