import AIAssistant from '@/components/shared/AIAssistant'
import AppLayout from '@/components/shared/AppLayout'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <AppLayout activeTab="Analytics">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Analytics & Reports</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Executive-level procurement insights and ROI tracking</p>
      </div>
      <AnalyticsDashboard />
      <AIAssistant />
    </AppLayout>
  )
}
