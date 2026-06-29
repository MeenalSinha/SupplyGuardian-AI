import AppLayout from '@/components/shared/AppLayout'
import AIExplainabilityPanel from '@/components/agents/AIExplainabilityPanel'
import AIAssistant from '@/components/shared/AIAssistant'
export default function ExplainabilityPage() {
  return (
    <AppLayout activeTab="Analytics">
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: 'var(--brand-text)' }}>AI Decision Explainability</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>Full reasoning traces, confidence scores, data sources, and alternatives for every AI decision</p>
      </div>
      <AIExplainabilityPanel />
      <AIAssistant />
    </AppLayout>
  )
}