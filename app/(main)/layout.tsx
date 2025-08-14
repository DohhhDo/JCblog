'use client'

import './blog/[slug]/blog.css'

import { Analytics } from '@vercel/analytics/react'
import { Suspense, useEffect, useState } from 'react'

import { Footer } from '~/app/(main)/Footer'
import { Header } from '~/app/(main)/Header'
import { QueryProvider } from '~/app/QueryProvider'
import { SidebarWaterfall } from '~/components/SidebarWaterfall'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showHiddenDivs, setShowHiddenDivs] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHiddenDivs(false);
    }, 10000); // 10秒后隐藏

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]" />
      <span className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_100%)]" />

      {/* Left Sidebar - Entire Page */}
      {showHiddenDivs && (
        <div className="hidden xl:block fixed left-0 top-0 w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none" />
      )}
      
      {/* Right Sidebar - Entire Page */}
      {showHiddenDivs && (
        <div className="hidden xl:block fixed right-0 top-0 w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none" />
      )}

      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
        </div>
      </div>

      <QueryProvider>
        <div className="relative text-zinc-800 dark:text-zinc-200">
          <Header />
          
          {/* Left Sidebar Waterfall Photos */}
          <div className="hidden xl:block fixed left-0 top-0 w-64 h-full pointer-events-auto z-30">
            <SidebarWaterfall position="left" />
          </div>
          
          {/* Right Sidebar Waterfall Photos */}
          <div className="hidden xl:block fixed right-0 top-0 w-64 h-full pointer-events-auto z-30">
            <SidebarWaterfall position="right" />
          </div>
          
          <main>{children}</main>
          <Suspense>
            <Footer />
          </Suspense>
        </div>
      </QueryProvider>

      <Analytics />
    </>
  )
}
