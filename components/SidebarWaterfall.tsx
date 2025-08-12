'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

interface SidebarWaterfallProps {
  position: 'left' | 'right'
}

export function SidebarWaterfall({ position }: SidebarWaterfallProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // 使用一些示例图片来展示瀑布流效果
  // 在实际使用中，这些图片应该从主页面传递过来
  const samplePhotos = [
    '/apps/arc.png',
    '/apps/craft.png',
    '/apps/cron.png',
    '/apps/discord.png',
    '/apps/figma.png',
    '/apps/finder.png',
    '/apps/linear.png',
    '/apps/live.png',
    '/apps/mail.png',
    '/apps/messages.png',
    '/apps/music.png',
    '/apps/resolve.png',
    '/apps/safari.png',
    '/apps/screenflow.png',
    '/apps/slack.png',
    '/apps/telegram.png',
    '/apps/tower.png',
    '/apps/vscode.png',
    '/apps/warp.png',
    '/apps/webstorm.png',
    '/apps/wechat.png',
  ]

  // 将图片分成两列，实现瀑布流效果
  const leftColumn = samplePhotos.filter((_, index) => index % 2 === 0)
  const rightColumn = samplePhotos.filter((_, index) => index % 2 === 1)

  // 为了创建无限滚动效果，我们需要复制图片数组
  const createInfiniteScroll = (photos: string[]) => {
    return [...photos, ...photos, ...photos] // 复制三次以确保无缝滚动
  }

  const infiniteLeftColumn = createInfiniteScroll(leftColumn)
  const infiniteRightColumn = createInfiniteScroll(rightColumn)

  // 生成随机延迟，让动画更自然
  const getRandomDelay = (baseDelay: number) => {
    return baseDelay + Math.random() * 0.5
  }

  const renderColumn = (columnPhotos: string[], delay: number, direction: 'up' | 'down', speed: number) => (
    <motion.div 
      className="flex flex-col gap-3"
      animate={{
        y: direction === 'up' ? [speed, 0] : [0, -speed]
      }}
      transition={{
        duration: speed * 0.12, // 根据速度计算持续时间
        repeat: Infinity,
        ease: "linear",
        delay: delay
      }}
    >
      {columnPhotos.map((photo, index) => (
        <motion.div
          key={`${position}-${index}`}
          className="relative w-full aspect-square overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700/50 shadow-sm hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotate: index % 2 === 0 ? 1 : -1 // 轻微旋转增加动态感
          }}
          transition={{
            delay: getRandomDelay(delay + index * 0.03),
            duration: 0.6,
            type: 'spring',
            damping: 20,
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.1,
            rotate: 0,
            transition: { duration: 0.3 }
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
          {/* 添加渐变遮罩效果 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          {/* 添加微妙的发光效果 */}
          <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        </motion.div>
      ))}
    </motion.div>
  )

  return (
    <div className="flex gap-3 px-3 pt-32 overflow-hidden relative">
      {/* 添加渐变遮罩来创造淡入淡出效果 */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-zinc-50/90 to-transparent dark:from-zinc-900/80 pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-zinc-50/90 to-transparent dark:from-zinc-900/80 pointer-events-none z-10" />
      
      {renderColumn(infiniteLeftColumn, 0, position === 'left' ? 'up' : 'down', 200)}
      {renderColumn(infiniteRightColumn, 0.1, position === 'left' ? 'down' : 'up', 160)}
    </div>
  )
}
