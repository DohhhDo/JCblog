'use client'

import Image from 'next/image'
import React from 'react'

import { deferAnalytics } from '~/lib/defer'

const appLabels: { [app: string]: string } = {
  slack: 'Slack',
  arc: 'Arc',
  craft: 'Craft',
  tower: 'Tower',
  vscode: 'VS Code',
  webstorm: 'WebStorm',
  linear: 'Linear',
  figma: 'Figma',
  telegram: 'Telegram',
  wechat: '微信',
  discord: 'Discord',
  cron: 'Cron',
  mail: '邮件',
  safari: 'Safari',
  music: 'Apple Music',
  finder: '访达',
  messages: '信息',
  live: 'Ableton Live',
  screenflow: 'ScreenFlow',
  resolve: 'DaVinci Resolve',
}
export function Activity() {
  const [data, setData] = React.useState<{ app: string } | null>(null)
  const [isEnabled, setIsEnabled] = React.useState(false)

  React.useEffect(() => {
    // Only enable on production site and defer loading
    deferAnalytics(() => {
      const enabled = typeof window !== 'undefined' && 
        new URL(window.location.href).hostname === 'jcblog.com.cn'
      
      setIsEnabled(enabled)
      
      if (enabled) {
        // Initial fetch
        fetch('/api/activity')
          .then((res) => res.json())
          .then(setData)
          .catch(() => {}) // Silently fail for non-essential feature
        
        // Set up polling with lower frequency to reduce main thread work
        const interval = setInterval(() => {
          fetch('/api/activity')
            .then((res) => res.json())
            .then(setData)
            .catch(() => {})
        }, 10000) // Reduced from 5s to 10s
        
        return () => clearInterval(interval)
      }
    }, 3000) // Defer by 3 seconds
  }, [])

  if (!isEnabled || !data) {
    return null
  }

  const { app } = data

  return (
    <div className="pointer-events-auto relative flex items-center" title={`JC 在使用 ${appLabels[app] ?? app}`}>
      {/* Simple CSS animation instead of framer-motion */}
      <div 
        className="absolute left-1 top-1 h-6 w-6 select-none rounded-[6px] bg-zinc-500/10 dark:bg-zinc-200/10 animate-pulse"
        style={{
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      <Image
        width={32}
        height={32}
        src={`/apps_webP/${app}.webp`}
        alt={app}
        unoptimized
        className="pointer-events-none select-none"
      />
    </div>
  )
}
