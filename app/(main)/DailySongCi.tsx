'use client'

import React from 'react'

import { ScriptIcon } from '~/assets'

interface SongCiResponse {
  poem: string
  success: boolean
  error?: string
}

export function DailySongCi() {
  const [poem, setPoem] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [refreshKey, setRefreshKey] = React.useState(0)

  React.useEffect(() => {
    setIsLoading(true)
    setError(false)
    
    const fetchPoem = async () => {
      try {
        // 调用本地API获取宋词
        const response = await fetch(`/api/songci?t=${Date.now()}&r=${refreshKey}`)
        const data: SongCiResponse = await response.json()
        
        if (data.success && data.poem) {
          setPoem(data.poem)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Failed to fetch poem:', err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchPoem()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="relative rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <ScriptIcon className="h-5 w-5 flex-none" />
        <span className="ml-2">每日宋词</span>
      </h2>
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 md:text-sm">
        <span>品味经典宋词之美，感受千年文学魅力。</span>
      </p>
      
      <div className="mt-4 min-h-[120px] rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
        {isLoading && (
          <div className="flex items-center justify-center h-[120px]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-500"></div>
          </div>
        )}
        {error && !isLoading && (
          <div className="flex items-center justify-center h-[120px]">
            <span className="text-red-500 text-sm">诗词加载失败，请重试。</span>
          </div>
        )}
        {!isLoading && !error && poem && (
          <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {poem.split('\n').map((line, index) => (
              line.trim() && (
                <div key={index} className="mb-2 last:mb-0">
                  {line.trim()}
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {!isLoading && (
        <button
          onClick={handleRefresh}
          className="mt-3 w-full rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          换一首
        </button>
      )}
    </div>
  )
}
