'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class StudioErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Sanity Studio Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 p-3">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900">
                Studio 加载失败
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Sanity Studio 遇到了一个错误。请尝试刷新页面或清除浏览器缓存。
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  刷新页面
                </button>
                <button
                  onClick={() => {
                    // Clear cache and reload
                    if ('caches' in window) {
                      caches.keys().then((names) => {
                        names.forEach((name) => {
                          caches.delete(name)
                        })
                      })
                    }
                    window.location.reload()
                  }}
                  className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  清除缓存并刷新
                </button>
              </div>
              {this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-xs text-gray-500">
                    错误详情
                  </summary>
                  <pre className="mt-2 max-h-32 overflow-auto rounded bg-gray-100 p-2 text-xs text-gray-700">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
