'use client'

import React from 'react'

interface SidebarWaterfallProps {
  position: 'left' | 'right'
}

export function SidebarWaterfall({ position: _position }: SidebarWaterfallProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex gap-4 px-3 pt-32 overflow-hidden relative" style={{ height: 'calc(100vh - 10rem)' }}>
      {/* 空的瀑布流容器 */}
    </div>
  )
}
