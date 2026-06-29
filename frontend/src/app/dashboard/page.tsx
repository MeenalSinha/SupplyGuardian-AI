import AppLayout from '@/components/shared/AppLayout'
import HeroBanner from '@/components/dashboard/HeroBanner'
import KPICards from '@/components/dashboard/KPICards'
import MarchReport from '@/components/dashboard/MarchReport'
import RecentProcurement from '@/components/dashboard/RecentProcurement'
import ActiveNegotiations from '@/components/dashboard/ActiveNegotiations'
import RiskAlerts from '@/components/dashboard/RiskAlerts'
import AgentActivity from '@/components/dashboard/AgentActivity'
import LiveFeed from '@/components/dashboard/LiveFeed'
import AIAssistant from '@/components/shared/AIAssistant'
import AgentFlowDiagram from '@/components/agents/AgentFlowDiagram'

export default function DashboardPage() {
  return (
    <AppLayout activeTab="Home">
      <div className="space-y-5">
        {/* Hero + KPI row */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <HeroBanner />
          </div>
          <div className="flex flex-col gap-3">
            <KPICards />
          </div>
        </div>

        {/* March Report section */}
        <MarchReport />

        {/* Bottom tables row */}
        <div className="grid grid-cols-3 gap-5">
          <RecentProcurement />
          <ActiveNegotiations />
          <RiskAlerts />
        </div>

        {/* Live feed + Agent flow */}
        <div className="grid grid-cols-2 gap-5">
          <LiveFeed />
          <AgentFlowDiagram />
        </div>

        {/* Full agent ecosystem */}
        <AgentActivity />
      </div>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </AppLayout>
  )
}
