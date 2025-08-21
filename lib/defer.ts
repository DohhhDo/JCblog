import React from 'react'

/**
 * Defer execution of non-critical code to reduce main thread blocking
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deferExecution<T extends (...args: any[]) => any>(
  fn: T,
  delay = 0
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return (...args: Parameters<T>) => {
    return new Promise<ReturnType<T>>((resolve) => {
      if ('requestIdleCallback' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).requestIdleCallback(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          resolve(fn(...args))
        })
      } else {
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          resolve(fn(...args))
        }, delay)
      }
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deferComponent<P extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ComponentType<P>
): React.ComponentType<P> {
  // eslint-disable-next-line react/display-name
  return (props: P) => {
    const [Component, setComponent] = React.useState<React.ComponentType<P> | null>(null)
    
    React.useEffect(() => {
      if ('requestIdleCallback' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).requestIdleCallback(() => {
          void importFn().then(({ default: C }) => setComponent(() => C))
        })
      } else {
        setTimeout(() => {
          void importFn().then(({ default: C }) => setComponent(() => C))
        }, 100)
      }
    }, [])

    if (!Component) {
      return fallback ? React.createElement(fallback, props) : null
    }

    return React.createElement(Component, props)
  }
}

/**
 * Defer analytics and non-essential tracking
 */
export function deferAnalytics(fn: () => void, delay = 2000) {
  if ('requestIdleCallback' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).requestIdleCallback(fn, { timeout: delay })
  } else {
    setTimeout(fn, delay)
  }
}

/**
 * Break up long-running tasks
 */
export async function yieldToMain() {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

/**
 * Process array items with yielding to prevent blocking
 */
export async function processWithYield<T, R>(
  items: T[],
  processor: (item: T, index: number) => R,
  batchSize = 5
): Promise<R[]> {
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    
    for (let j = 0; j < batch.length; j++) {
      results.push(processor(batch[j], i + j))
    }
    
    // Yield to main thread after each batch
    if (i + batchSize < items.length) {
      await yieldToMain()
    }
  }
  
  return results
}
