import AppLayout from '@/components/shared/AppLayout'
import CommandCenter from '@/components/dashboard/CommandCenter'
import AIAssistant from '@/components/shared/AIAssistant'

export default function DashboardPage() {
  return (
    <AppLayout activeTab="Home">
      <div className="space-y-5">
        <CommandCenter />
      </div>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </AppLayout>
  )
}

