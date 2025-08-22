import './blog/[slug]/blog.css'

import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'

import { Footer } from '~/app/(main)/Footer'
import { GeometryAnimation } from '~/app/(main)/GeometryAnimation'
import { Header } from '~/app/(main)/Header'
import { WaterfallLayout } from '~/app/(main)/WaterfallLayout'
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

      <WaterfallLayout />

      <QueryProvider>
        <div className="relative z-[40] text-zinc-800 dark:text-zinc-200">
          <div className="relative z-[50] pointer-events-auto">
            <Header />
          </div>
          {/* Center Opaque Background: fixed full-viewport layer above waterfalls, below content/header/footer */}
          <div className="fixed inset-0 z-[30] flex justify-center sm:px-8">
            <div className="flex w-full max-w-7xl lg:px-8 h-full">
              <div className="w-full h-full bg-zinc-50 ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-400/20" />
            </div>
          </div>
          
          <div className="relative z-[40]">
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
