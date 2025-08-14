'use client'

import Image from 'next/image'
import React from 'react'

import { SparkleIcon } from '~/assets'

export function DailyWaifu() {
  const [imageUrl, setImageUrl] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [refreshKey, setRefreshKey] = React.useState(0)
  const [showToast, setShowToast] = React.useState(false)

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
    // 显示提示消息
    setShowToast(true)
    
    // 2秒后自动隐藏提示
    setTimeout(() => {
      setShowToast(false)
    }, 2000)
    
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      {/* Toast 提示 */}
      {showToast && (
        <div className="absolute left-1/2 top-4 z-50 -translate-x-1/2 transform animate-pulse rounded-lg bg-pink-100 px-4 py-2 text-sm font-medium text-pink-800 shadow-lg dark:bg-pink-900/50 dark:text-pink-200">
          渣男，不可以花心喔～ 💕
        </div>
      )}
      
      <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <SparkleIcon className="h-5 w-5 flex-none" />
        <span className="ml-2">每日老婆</span>
      </h2>
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 md:text-sm">
        <span>每天一张随机二次元美图，放松一下心情。</span>
      </p>
      
      <div className="mt-4 flex-1 relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
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
