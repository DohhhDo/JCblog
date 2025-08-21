// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - in app dir React is globally available, types are resolved at usage sites
import * as React from 'react'

/**
 * Enable animations only after the first user interaction or after an idle delay.
 * Also respects prefers-reduced-motion.
 */
export function useMotionOnFirstInteraction(options?: { idleDelayMs?: number }) {
  const { idleDelayMs = 3000 } = options ?? {}
  const [enabled, setEnabled] = React.useState(false)

  React.useEffect(() => {
    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    let done = false
    function enable() {
      if (done) return
      done = true
      setEnabled(true)
      cleanup()
    }

    const events: Array<keyof DocumentEventMap> = [
      'pointerdown',
      'keydown',
      'wheel',
      'touchstart',
      'scroll',
    ]

    const opts = { passive: true } as AddEventListenerOptions
    events.forEach((e) => document.addEventListener(e, enable, opts))

    const useRIC = 'requestIdleCallback' in window
    let idleId: number
    if (useRIC) {
      idleId = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(
        () => enable()
      )
    } else {
      idleId = window.setTimeout(() => enable(), idleDelayMs)
    }

    function cleanup() {
      events.forEach((e) => document.removeEventListener(e, enable))
      if (!useRIC) window.clearTimeout(idleId)
      else
        (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(
          idleId
        )
    }

    return cleanup
  }, [idleDelayMs])

  return enabled
}


