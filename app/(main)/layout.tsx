import './blog/[slug]/blog.css'

import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'

import { Footer } from '~/app/(main)/Footer'
import { Header } from '~/app/(main)/Header'
import { QueryProvider } from '~/app/QueryProvider'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]" />
      <span className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_100%)]" />

      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          {/* Left Sidebar */}
          <div className="hidden xl:block w-64 bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
          
          {/* Center Content Area */}
          <div className="flex-1 bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
          
          {/* Right Sidebar */}
          <div className="hidden xl:block w-64 bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
        </div>
      </div>

      <QueryProvider>
        <div className="relative text-zinc-800 dark:text-zinc-200">
          <Header />
          <main className="relative z-10">
            {/* Left Sidebar Content */}
            <div className="hidden xl:block fixed left-8 top-32 w-64 h-[calc(100vh-8rem)] pointer-events-none">
              <div className="w-full h-full bg-transparent" />
            </div>
            
            {/* Main Content */}
            <div className="relative z-20">
              {children}
            </div>
            
            {/* Right Sidebar Content */}
            <div className="hidden xl:block fixed right-8 top-32 w-64 h-[calc(100vh-8rem)] pointer-events-none">
              <div className="w-full h-full bg-transparent" />
            </div>
          </main>
          <Suspense>
            <Footer />
          </Suspense>
        </div>
      </QueryProvider>

      <Analytics />
    </>
  )
}
