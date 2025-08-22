'use client'

import React from 'react'

import { SidebarWaterfall } from '~/components/SidebarWaterfall'
import { waterfallController, type WaterfallState } from '~/lib/waterfallController'

export function WaterfallLayout() {
  const [waterfallState, setWaterfallState] = React.useState<WaterfallState>({
    isActive: false,
    isLoading: false,
  })

  React.useEffect(() => {
    const unsubscribe = waterfallController.subscribe(setWaterfallState)
    return unsubscribe
  }, [])

  const shouldShowSidebars = waterfallState.isActive

  return (
    <>
      {/* Left Sidebar - 只在瀑布流活跃时显示 */}
      {shouldShowSidebars && (
        <div className="hidden xl:block fixed left-0 top-0 z-10 w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none animate-[fadeOut_10s_ease-in-out_forwards]" />
      )}
      
      {/* Right Sidebar - 只在瀑布流活跃时显示 */}
      {shouldShowSidebars && (
        <div className="hidden xl:block fixed right-0 top-0 z-10 w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none animate-[fadeOut_10s_ease-in-out_forwards]" />
      )}
      
      {/* Left Sidebar Waterfall Photos */}
      {shouldShowSidebars && (
        <div className="hidden xl:block fixed left-0 top-0 w-64 h-full pointer-events-auto z-10">
          <SidebarWaterfall position="left" />
        </div>
      )}
      
      {/* Right Sidebar Waterfall Photos */}
      {shouldShowSidebars && (
        <div className="hidden xl:block fixed right-0 top-0 w-64 h-full pointer-events-auto z-10">
          <SidebarWaterfall position="right" />
        </div>
      )}
    </>
  )
}
