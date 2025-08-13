'use client'

import './blog/[slug]/blog.css'

import { Analytics } from '@vercel/analytics/react'
import { Suspense, useEffect, useState } from 'react'
import { useEffect, useState } from 'react'

import { Footer } from '~/app/(main)/Footer'
import { Header } from '~/app/(main)/Header'
import { QueryProvider } from '~/app/QueryProvider'
import { SidebarWaterfall } from '~/components/SidebarWaterfall'
import { type ReactNode } from 'react'
import { useEffect, useState } from 'react'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 10秒后自动隐藏
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div className="pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]" />
      <span className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_100%)]" />

      {/* Left Sidebar - Entire Page */}
      <div className="hidden xl:block fixed left-0 top-0 w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none" />
      
      {/* Right Sidebar - Entire Page */}
      <div className="hidden xl:block fixed right-0 top-0 w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none" />

      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
        </div>
      </div>

      <QueryProvider>
        <div className="relative text-zinc-800 dark:text-zinc-200">
          <Header />
          
          {/* Toggle Button */}
          <button
            onClick={() => setIsVisible(!isVisible)}
            className={`fixed z-40 top-1/2 transform -translate-y-1/2 transition-all duration-700 ease-in-out 
              ${isVisible 
                ? 'opacity-0 hover:opacity-100' 
                : 'opacity-100'} 
              ${isVisible ? 'left-60' : 'left-0'}`}
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
            }}
          >
            <div className="px-2 py-4 text-sm bg-zinc-100/90 dark:bg-zinc-800/90 rounded-r-lg shadow-lg">
              {isVisible ? '隐藏侧栏' : '显示侧栏'}
            </div>
          </button>
          
          {/* Left Sidebar Waterfall Photos */}
          <div 
            className={`hidden xl:block fixed top-0 bottom-0 pointer-events-auto z-30 transition-all duration-700 ease-in-out ${
              isVisible ? 'left-0 w-64 opacity-100' : '-left-64 w-0 opacity-0'
            }`}
          >
            <SidebarWaterfall position="left" />
          </div>
          
          {/* Right Sidebar Waterfall Photos */}
          <div 
            className={`hidden xl:block fixed top-0 bottom-0 pointer-events-auto z-30 transition-all duration-700 ease-in-out ${
              isVisible ? 'right-0 w-64 opacity-100' : '-right-64 w-0 opacity-0'
            }`}
          >
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
