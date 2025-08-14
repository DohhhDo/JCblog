'use client'

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio'
import { Suspense, useEffect, useState } from 'react'

import config from '~/sanity.config'

import { StudioErrorBoundary } from './ErrorBoundary'

function StudioLoading() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Loading Sanity Studio{dots}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          This may take a moment...
        </p>
      </div>
    </div>
  )
}

export default function Studio() {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = () => {
    setIsRetrying(true)
    setRetryCount(prev => prev + 1)
    
    // Force a fresh load by adding a timestamp
    setTimeout(() => {
      const url = new URL(window.location.href)
      url.searchParams.set('_retry', Date.now().toString())
      window.history.replaceState({}, '', url.toString())
      window.location.reload()
    }, 100)
  }

  useEffect(() => {
    // Add global error handler for chunk loading errors
    const handleChunkError = (event: ErrorEvent) => {
      if (event.error?.name === 'ChunkLoadError' && !isRetrying) {
        console.warn('Studio chunk error detected, preparing to retry...')
        event.preventDefault()
        handleRetry()
      }
    }

    window.addEventListener('error', handleChunkError)
    
    return () => {
      window.removeEventListener('error', handleChunkError)
    }
  }, [isRetrying])

  if (isRetrying) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Retrying... (Attempt {retryCount})
          </p>
        </div>
      </div>
    )
  }

  return (
    <StudioErrorBoundary onRetry={handleRetry}>
      <Suspense fallback={<StudioLoading />}>
        <NextStudio config={config} />
      </Suspense>
    </StudioErrorBoundary>
  )
}
