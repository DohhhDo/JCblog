'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

interface WaterfallPhotosProps {
  photos: string[]
  position: 'left' | 'right'
}

export function WaterfallPhotos({ photos, position }: WaterfallPhotosProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // 将图片分成两列，实现瀑布流效果
  const leftColumn = photos.filter((_, index) => index % 2 === 0)
  const rightColumn = photos.filter((_, index) => index % 2 === 1)

  const renderColumn = (columnPhotos: string[], delay: number) => (
    <div className="flex flex-col gap-3">
      {columnPhotos.map((photo, index) => (
        <motion.div
          key={`${position}-${index}`}
          className="relative w-full aspect-square overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700/50 shadow-sm"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: delay + index * 0.1,
            duration: 0.6,
            type: 'spring',
            damping: 20,
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          <Image
            src={photo}
            alt=""
            width={100}
            height={100}
            className="h-full w-full object-cover"
            priority={index < 2}
          />
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="flex gap-3 px-3 pt-32">
      {renderColumn(leftColumn, 0)}
      {renderColumn(rightColumn, 0.1)}
    </div>
  )
}
