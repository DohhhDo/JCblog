'use client'

import Image from 'next/image'
import React from 'react'

import { SparkleIcon } from '~/assets'

export function DailyWaifu() {
  const [imageUrl, setImageUrl] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [refreshKey, setRefreshKey] = React.useState(0)

  React.useEffect(() => {
    setIsLoading(true)
    setError(false)
    // 直接使用API URL，添加时间戳避免缓存
    const apiUrl = `https://app.zichen.zone/api/acg/api.php?t=${Date.now()}&r=${refreshKey}`
    setImageUrl(apiUrl)
    
    // 简单的预加载检测
    const img = new window.Image()
    img.onload = () => {
      setIsLoading(false)
    }
    img.onerror = () => {
      setError(true)
      setIsLoading(false)
    }
    img.src = apiUrl
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="relative rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <SparkleIcon className="h-5 w-5 flex-none" />
        <span className="ml-2">每日老婆</span>
      </h2>
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 md:text-sm">
        每日随机更新的精美二次元图片 ✨
      </p>
      
      <div className="mt-4 relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <SparkleIcon className="mx-auto h-12 w-12 text-zinc-400" />
              <p className="mt-2 text-sm text-zinc-500">图片加载失败</p>
            </div>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt="每日老婆"
            fill
            className="object-cover"
            unoptimized
            onError={() => setError(true)}
          />
        )}
      </div>
      
      {!isLoading && !error && (
        <button
          onClick={handleRefresh}
          className="mt-3 w-full rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          换一张
        </button>
      )}
    </div>
  )
}
