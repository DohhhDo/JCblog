'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { Layers3Icon } from '~/assets'
import { Tooltip } from '~/components/ui/Tooltip'
import { waterfallController, type WaterfallState } from '~/lib/waterfallController'

export function WaterfallTrigger() {
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState<WaterfallState>({
    isActive: false,
    isLoading: false,
  })

  React.useEffect(() => {
    setMounted(true)
    
    // 订阅瀑布流状态变化
    const unsubscribe = waterfallController.subscribe(setState)
    return unsubscribe
  }, [])

  const handleClick = React.useCallback(() => {
    if (state.isActive || state.isLoading) return
    void waterfallController.start()
  }, [state.isActive, state.isLoading])

  if (!mounted) {
    return null
  }

  const getTooltipText = () => {
    if (state.isLoading) return '正在加载图片...'
    if (state.isActive) return '瀑布流动画进行中'
    return '启动瀑布流动画'
  }

  const isDisabled = state.isActive || state.isLoading

  return (
    <Tooltip.Provider disableHoverableContent>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label="启动瀑布流动画"
            className={`group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20 ${
              isDisabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-zinc-100/50 hover:to-white/95 dark:hover:from-zinc-800/50 dark:hover:to-zinc-700/90'
            }`}
            onClick={handleClick}
            disabled={isDisabled}
          >
            <motion.div
              animate={state.isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={state.isLoading ? { 
                duration: 1, 
                repeat: Infinity, 
                ease: 'linear' 
              } : { duration: 0.2 }}
            >
              <Layers3Icon 
                className={`h-6 w-6 p-0.5 transition ${
                  state.isActive 
                    ? 'stroke-blue-500 dark:stroke-blue-400' 
                    : state.isLoading 
                    ? 'stroke-orange-500 dark:stroke-orange-400'
                    : 'stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-200'
                }`} 
              />
            </motion.div>
          </button>
        </Tooltip.Trigger>
        <AnimatePresence>
          {open && (
            <Tooltip.Portal forceMount>
              <Tooltip.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {getTooltipText()}
                </motion.div>
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </AnimatePresence>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
