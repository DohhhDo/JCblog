'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { TravellingIcon } from '~/assets'
import { Tooltip } from '~/components/ui/Tooltip'

export function TravellingButton() {
  const [open, setOpen] = React.useState(false)

  return (
    <Tooltip.Provider disableHoverableContent>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <a
            href="https://travellings.link/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="开往 Travelling"
            className="group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition hover:from-zinc-100/50 hover:to-white/95 dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
          >
            <TravellingIcon className="h-6 w-6 p-0.5 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-200" />
          </a>
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
                  开往 Travelling
                </motion.div>
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </AnimatePresence>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}


