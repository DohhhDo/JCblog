'use client'

import { useEffect, useMemo, useState } from 'react'

import { SidebarWaterfall } from '~/components/SidebarWaterfall'

// helper removed: inline calculation is used inside recalc()

export function ResponsiveSidebars() {
  const sidebarWidthPx = 256 // Tailwind w-64 = 16rem = 256px (base 16px)
  const gapPx = 16 // 每侧间隔，按 10-20px 取 16px
  const requiredWidth = useMemo(() => sidebarWidthPx * 2, [sidebarWidthPx])

  const [showSidebars, setShowSidebars] = useState(false)
  const [debugEnabled, setDebugEnabled] = useState(false)
  const [debugInfo, setDebugInfo] = useState<{
    totalWidth: number
    centerWidth: number
    leftSpace: number
    rightSpace: number
    available: number
    need: number
    showing: boolean
  } | null>(null)

  // Enable debug via URL query: ?sidebarDebug=1
  useEffect(() => {
    function readDebugFlag() {
      try {
        const params = new URLSearchParams(window.location.search)
        const v = params.get('sidebarDebug')
        return v === '1' || v === 'true'
      } catch {
        return false
      }
    }
    setDebugEnabled(readDebugFlag())
    const onPopState = () => setDebugEnabled(readDebugFlag())
    window.addEventListener('popstate', onPopState)
    window.addEventListener('hashchange', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('hashchange', onPopState)
    }
  }, [])

  useEffect(() => {
    function recalc() {
      const totalWidth = document.documentElement.clientWidth || window.innerWidth
      const centerEl =
        document.querySelector('[data-center-width="content"]') ||
        document.querySelector('main')
      const rect = centerEl?.getBoundingClientRect()
      const centerWidth = rect?.width ?? 0
      const leftSpace = rect?.left ?? 0
      const rightSpace = rect ? totalWidth - rect.right : 0
      const available = totalWidth - centerWidth
      const need = 2 * (sidebarWidthPx + gapPx)
      const showing = available >= need

      setShowSidebars(showing)
      if (debugEnabled) {
        setDebugInfo({
          totalWidth,
          centerWidth,
          leftSpace,
          rightSpace,
          available,
          need,
          showing,
        })
      }
    }

    // Initial calculation (double RAF to ensure layout is ready)
    requestAnimationFrame(() => requestAnimationFrame(recalc))

    // Observe window resize
    window.addEventListener('resize', recalc)

    // Observe center element size changes as well
    const centerEl =
      document.querySelector('[data-center-width="content"]') ||
      document.querySelector('main')
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => recalc()) : undefined
    if (centerEl && ro) {
      ro.observe(centerEl)
    }

    return () => {
      window.removeEventListener('resize', recalc)
      if (centerEl && ro) ro.unobserve(centerEl)
    }
  }, [requiredWidth, debugEnabled])

  // MutationObserver 已不需要，逻辑足够稳健

  if (!showSidebars) return null

  return (
    <>
      {debugEnabled && debugInfo && (
        <div className="fixed bottom-4 left-4 z-[70] max-w-[90vw] rounded-md border border-zinc-200 bg-white/90 p-3 text-xs text-zinc-800 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-200">
          <div className="font-semibold mb-2">Sidebar Debug</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>viewport:</div>
            <div>{Math.round(debugInfo.totalWidth)} px</div>
            <div>center:</div>
            <div>{Math.round(debugInfo.centerWidth)} px</div>
            <div>left:</div>
            <div>{Math.round(debugInfo.leftSpace)} px</div>
            <div>right:</div>
            <div>{Math.round(debugInfo.rightSpace)} px</div>
            <div>available:</div>
            <div>{Math.round(debugInfo.available)} px</div>
            <div>need:</div>
            <div>{Math.round(debugInfo.need)} px</div>
            <div>showing:</div>
            <div>{debugInfo.showing ? 'true' : 'false'}</div>
          </div>
        </div>
      )}
      {/* Left Sidebar - Entire Page background */}
      <div className="fixed left-0 top-0 z-[50] w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none animate-[fadeOut_10s_ease-in-out_forwards]" />

      {/* Right Sidebar - Entire Page background */}
      <div className="fixed right-0 top-0 z-[50] w-64 h-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20 pointer-events-none animate-[fadeOut_10s_ease-in-out_forwards]" />

      {/* Left Sidebar Waterfall Photos */}
      <div className="fixed left-0 top-0 w-64 h-full pointer-events-auto z-[60]">
        <SidebarWaterfall position="left" autoHide={false} />
      </div>

      {/* Right Sidebar Waterfall Photos */}
      <div className="fixed right-0 top-0 w-64 h-full pointer-events-auto z-[60]">
        <SidebarWaterfall position="right" autoHide={false} />
      </div>
    </>
  )
}


