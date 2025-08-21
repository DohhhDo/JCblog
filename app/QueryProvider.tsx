'use client'

import React from 'react'

let QueryClientProvider: React.ComponentType<any> | null = null
let queryClient: any = null

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    void import('react-query').then(({ QueryClient, QueryClientProvider: QCP }) => {
      if (!queryClient) {
        queryClient = new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: 5 * 60 * 1000, // 5 minutes
              refetchOnWindowFocus: false,
            },
          },
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      QueryClientProvider = QCP as any
      setIsLoaded(true)
    })
  }, [])

  if (!isLoaded || !QueryClientProvider) {
    return <>{children}</>
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
