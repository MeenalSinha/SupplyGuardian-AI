import AppLayout from '@/components/shared/AppLayout'
import ExecutiveBriefing from '@/components/agents/ExecutiveBriefing'
import AIAssistant from '@/components/shared/AIAssistant'
export default function BriefingPage() {
  return (
    <AppLayout activeTab="Home">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>Executive Briefing</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>One-click AI-generated executive summary with decisions required, risk register, and agent actions</p>
      </div>
      <ExecutiveBriefing />
      <AIAssistant />
    </AppLayout>
  )
}