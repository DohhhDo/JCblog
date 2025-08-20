import './blog/[slug]/blog.css'

import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'

import { Footer } from '~/app/(main)/Footer'
import { GeometryAnimation } from '~/app/(main)/GeometryAnimation'
import { Header } from '~/app/(main)/Header'
import { QueryProvider } from '~/app/QueryProvider'
import { SidebarWaterfall } from '~/components/SidebarWaterfall'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]" />
      <span className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_100%)]" />

      {/* Left Sidebar - Entire Page */}
      <div className="hidden xl:block fixed left-0 top-0 z-10 w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none animate-[fadeOut_10s_ease-in-out_forwards]" />
      
      {/* Right Sidebar - Entire Page */}
      <div className="hidden xl:block fixed right-0 top-0 z-10 w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none animate-[fadeOut_10s_ease-in-out_forwards]" />

      {/* moved center opaque background inside content stacking context below */}

      <QueryProvider>
        <div className="relative z-[40] text-zinc-800 dark:text-zinc-200">
          <div className="relative z-[50] pointer-events-auto">
            <Header />
          </div>
          {/* Center Opaque Background: constrained to main content height */}
          
          {/* Left Sidebar Waterfall Photos */}
          <div className="hidden xl:block fixed left-0 top-0 w-64 h-full pointer-events-auto z-10">
            <SidebarWaterfall position="left" />
          </div>
          
          {/* Right Sidebar Waterfall Photos */}
          <div className="hidden xl:block fixed right-0 top-0 w-64 h-full pointer-events-auto z-10">
            <SidebarWaterfall position="right" />
          </div>
          
          <div className="relative z-[40]">
            <div className="pointer-events-none absolute inset-0 z-[30] flex justify-center sm:px-8">
              <div className="flex w-full max-w-7xl lg:px-8">
                <div className="w-full h-full bg-zinc-50 ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-400/20" />
              </div>
            </div>
            <main className="relative z-[40]">{children}</main>
          </div>
          <Suspense>
            <Footer />
          </Suspense>
        </div>
      </QueryProvider>

      <GeometryAnimation />
      <Analytics />
    </>
  )
}
