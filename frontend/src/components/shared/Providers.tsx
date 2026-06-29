'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#272420',
            color: '#F5F2E8',
            border: '1px solid #333128',
            borderRadius: '8px',
            fontSize: '13px',
          },
          success: {
            iconTheme: { primary: '#7CB84A', secondary: '#272420' },
          },
          error: {
            iconTheme: { primary: '#D45A4A', secondary: '#272420' },
          },
        }}
      />
    </QueryClientProvider>
  )
}
