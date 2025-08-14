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
import { Suspense } from 'react'

import config from '~/sanity.config'

import { StudioErrorBoundary } from './ErrorBoundary'

function StudioLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <p className="text-gray-600">Loading Sanity Studio...</p>
      </div>
    </div>
  )
}

export default function Studio() {
  return (
    <StudioErrorBoundary>
      <Suspense fallback={<StudioLoading />}>
        <NextStudio config={config} />
      </Suspense>
    </StudioErrorBoundary>
  )
}
