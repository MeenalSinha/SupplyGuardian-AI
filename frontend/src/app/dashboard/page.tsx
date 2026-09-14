import AppLayout from '@/components/shared/AppLayout'
import HeroBanner from '@/components/dashboard/HeroBanner'
import MarchReport from '@/components/dashboard/MarchReport'
import RecentProcurement from '@/components/dashboard/RecentProcurement'
import ActiveNegotiations from '@/components/dashboard/ActiveNegotiations'
import RiskAlerts from '@/components/dashboard/RiskAlerts'
import CommandCenter from '@/components/dashboard/CommandCenter'
import AIAssistant from '@/components/shared/AIAssistant'

export default function DashboardPage() {
  return (
    <AppLayout activeTab="Home">
      <div className="space-y-5">
        {/* Hero Banner */}
        <HeroBanner />

        {/* March Report */}
        <MarchReport />

        {/* Bottom 3-column tables */}
        <div className="grid grid-cols-3 gap-4">
          <RecentProcurement />
          <ActiveNegotiations />
          <RiskAlerts />
        </div>

        {/* Judge Mode / Command Center — kept at bottom */}
        <CommandCenter />
      </div>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </AppLayout>
  )
}
