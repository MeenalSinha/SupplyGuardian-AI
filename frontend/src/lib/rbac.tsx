'use client'

// Role-Based Access Control for SupplyGuardian AI

export type Role = 'procurement_director' | 'procurement_manager' | 'analyst' | 'finance' | 'legal' | 'viewer'

export interface Permission {
  canApprove: boolean
  canNegotiate: boolean
  canCreateCases: boolean
  canViewFinancials: boolean
  canViewSanctions: boolean
  canExportAudit: boolean
  canManageSuppliers: boolean
  maxApprovalValue: number
}

export const ROLE_PERMISSIONS: Record<Role, Permission> = {
  procurement_director: {
    canApprove: true, canNegotiate: true, canCreateCases: true,
    canViewFinancials: true, canViewSanctions: true, canExportAudit: true,
    canManageSuppliers: true, maxApprovalValue: Infinity,
  },
  procurement_manager: {
    canApprove: true, canNegotiate: true, canCreateCases: true,
    canViewFinancials: true, canViewSanctions: false, canExportAudit: true,
    canManageSuppliers: true, maxApprovalValue: 500000,
  },
  analyst: {
    canApprove: false, canNegotiate: false, canCreateCases: true,
    canViewFinancials: true, canViewSanctions: false, canExportAudit: false,
    canManageSuppliers: false, maxApprovalValue: 0,
  },
  finance: {
    canApprove: true, canNegotiate: false, canCreateCases: false,
    canViewFinancials: true, canViewSanctions: false, canExportAudit: true,
    canManageSuppliers: false, maxApprovalValue: 250000,
  },
  legal: {
    canApprove: false, canNegotiate: false, canCreateCases: true,
    canViewFinancials: false, canViewSanctions: true, canExportAudit: true,
    canManageSuppliers: false, maxApprovalValue: 0,
  },
  viewer: {
    canApprove: false, canNegotiate: false, canCreateCases: false,
    canViewFinancials: false, canViewSanctions: false, canExportAudit: false,
    canManageSuppliers: false, maxApprovalValue: 0,
  },
}

// Demo: current user is procurement_director
export const CURRENT_ROLE: Role = 'procurement_director'
export const CURRENT_PERMISSIONS = ROLE_PERMISSIONS[CURRENT_ROLE]

const ROLE_LABELS: Record<Role, string> = {
  procurement_director: 'Procurement Director',
  procurement_manager: 'Procurement Manager',
  analyst: 'Analyst',
  finance: 'Finance',
  legal: 'Legal',
  viewer: 'Viewer',
}

const ROLE_COLORS: Record<Role, string> = {
  procurement_director: 'var(--brand-gold)',
  procurement_manager: 'var(--brand-green)',
  analyst: '#4A8CD4',
  finance: 'var(--brand-amber)',
  legal: '#8A4AD4',
  viewer: 'var(--brand-text-dim)',
}

// RoleBadge component
export function RoleBadge({ role = CURRENT_ROLE }: { role?: Role }) {
  return (
    <span
      className="chip"
      style={{
        fontSize: '10px',
        background: `${ROLE_COLORS[role]}15`,
        color: ROLE_COLORS[role],
      }}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}

// PermissionGate - shows children only if user has required permission
export function PermissionGate({
  permission,
  fallback = null,
  children,
}: {
  permission: keyof Permission
  fallback?: React.ReactNode
  children: React.ReactNode
}) {
  const allowed = CURRENT_PERMISSIONS[permission]
  if (!allowed) return <>{fallback}</>
  return <>{children}</>
}

// RBACPanel - shows current role permissions
export function RBACPanel() {
  const perms = CURRENT_PERMISSIONS

  return (
    <div className="sg-card">
      <div className="flex items-center gap-3 mb-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>Access Control</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Logged in as: J. Doe</div>
        </div>
        <RoleBadge />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Approve contracts', value: perms.canApprove },
          { label: 'Run negotiations', value: perms.canNegotiate },
          { label: 'Create cases', value: perms.canCreateCases },
          { label: 'View financials', value: perms.canViewFinancials },
          { label: 'View sanctions', value: perms.canViewSanctions },
          { label: 'Export audit logs', value: perms.canExportAudit },
          { label: 'Manage suppliers', value: perms.canManageSuppliers },
          { label: 'Approval limit', value: true, display: perms.maxApprovalValue === Infinity ? 'Unlimited' : `$${perms.maxApprovalValue.toLocaleString()}` },
        ].map(p => (
          <div key={p.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: p.value ? 'rgba(124,184,74,0.15)' : 'rgba(212,90,74,0.15)' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.value ? 'var(--brand-green)' : 'var(--brand-red)' }} />
            </div>
            <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{p.label}</span>
            {p.display && (
              <span className="text-xs ml-auto font-semibold" style={{ color: 'var(--brand-gold)' }}>{p.display}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
