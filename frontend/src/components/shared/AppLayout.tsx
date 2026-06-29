'use client'

import Sidebar from '@/components/shared/Sidebar'
import TopNav from '@/components/shared/TopNav'

export default function AppLayout({ children, activeTab }: { children: React.ReactNode; activeTab?: string }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--brand-carbon)' }}>
      <Sidebar />
      <TopNav activeTab={activeTab} />
      <main className="ml-[200px] pt-14 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
