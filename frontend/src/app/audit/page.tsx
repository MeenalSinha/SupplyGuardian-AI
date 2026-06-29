import AppLayout from '@/components/shared/AppLayout'
import AuditLog from '@/components/audit/AuditLog'
import { RBACPanel } from '@/lib/rbac'
import AIAssistant from '@/components/shared/AIAssistant'

export default function AuditPage() {
  return (
    <AppLayout activeTab="Analytics">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Audit & Compliance Logs</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Immutable decision trail, agent reasoning, human actions, and RBAC access control</p>
      </div>
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-3">
          <AuditLog />
        </div>
        <div>
          <RBACPanel />
        </div>
      </div>
      <AIAssistant />
    </AppLayout>
  )
}
