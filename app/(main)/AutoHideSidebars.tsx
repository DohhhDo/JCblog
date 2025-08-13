'use client'

import { motion } from 'framer-motion'
import { type ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'

export function AutoHideSidebars({ children }: { children: ReactElement[] }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // 10秒后自动隐藏
    const timer = setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [isHovered])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    setIsVisible(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  if (!children || !Array.isArray(children) || children.length !== 2) {
    return null
  }

  const [leftSidebar, rightSidebar] = children

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          opacity: isVisible ? 1 : 0,
          x: isVisible ? 0 : -256, // w-64 = 256px
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {leftSidebar}
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          opacity: isVisible ? 1 : 0,
          x: isVisible ? 0 : 256, // w-64 = 256px
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {rightSidebar}
      </motion.div>
    </>
  )
}
