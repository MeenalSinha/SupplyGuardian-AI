import AIAssistant from '@/components/shared/AIAssistant'
import AppLayout from '@/components/shared/AppLayout'
import ApprovalCenter from '@/components/approvals/ApprovalCenter'

export default function ApprovalsPage() {
  return (
    <AppLayout activeTab="Procurement">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Approval Center</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Human-in-the-loop governance for high-stakes procurement decisions</p>
      </div>
      <ApprovalCenter />
      <AIAssistant />
    </AppLayout>
  )
}
