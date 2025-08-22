'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import React from 'react'

import { UserArrowLeftIcon } from '~/assets'
import { Tooltip } from '~/components/ui/Tooltip'

export function FriendSubscribeButton() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const handleClick = React.useCallback(() => {
    router.push('/guestbook')
  }, [router])

  return (
    <Tooltip.Provider disableHoverableContent>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label="新朋友来了"
            className="group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-4 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition hover:from-zinc-100/50 hover:to-white/95 dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20 dark:hover:from-zinc-800/50 dark:hover:to-zinc-700/90"
            onClick={handleClick}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <UserArrowLeftIcon className="h-4 w-4" />
              新朋友来了
            </span>
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
                  前往留言墙申请友链
                </motion.div>
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </AnimatePresence>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
