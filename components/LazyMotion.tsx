'use client'

import React from 'react'
import { useMotionOnFirstInteraction } from '~/lib/motion'

interface MotionDivProps extends React.HTMLAttributes<HTMLDivElement> {
  initial?: any
  animate?: any
  transition?: any
  exit?: any
  layout?: boolean
  layoutId?: string
  whileHover?: any
  children: React.ReactNode
}

interface MotionH1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  initial?: any
  animate?: any
  transition?: any
  children: React.ReactNode
}

interface MotionPProps extends React.HTMLAttributes<HTMLParagraphElement> {
  initial?: any
  animate?: any
  transition?: any
  exit?: any
  children: React.ReactNode
}

const LazyMotionDiv = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ initial, animate, transition, exit, layout, layoutId, whileHover, children, ...props }, ref) => {
    const motionEnabled = useMotionOnFirstInteraction({ idleDelayMs: 1500 })
    const [MotionComponent, setMotionComponent] = React.useState<any>(null)

    React.useEffect(() => {
      if (motionEnabled && !MotionComponent) {
        import('framer-motion').then(({ motion }) => {
          setMotionComponent(() => motion.div)
        })
      }
    }, [motionEnabled, MotionComponent])

    if (!motionEnabled || !MotionComponent) {
      return (
        <div ref={ref} {...props}>
          {children}
        </div>
      )
    }

    return (
      <MotionComponent
        ref={ref}
        initial={initial}
        animate={animate}
        transition={transition}
        exit={exit}
        layout={layout}
        layoutId={layoutId}
        whileHover={whileHover}
        {...props}
      >
        {children}
      </MotionComponent>
    )
  }
)

LazyMotionDiv.displayName = 'LazyMotionDiv'

const LazyMotionH1 = React.forwardRef<HTMLHeadingElement, MotionH1Props>(
  ({ initial, animate, transition, children, ...props }, ref) => {
    const motionEnabled = useMotionOnFirstInteraction({ idleDelayMs: 1500 })
    const [MotionComponent, setMotionComponent] = React.useState<any>(null)

    React.useEffect(() => {
      if (motionEnabled && !MotionComponent) {
        import('framer-motion').then(({ motion }) => {
          setMotionComponent(() => motion.h1)
        })
      }
    }, [motionEnabled, MotionComponent])

    if (!motionEnabled || !MotionComponent) {
      return (
        <h1 ref={ref} {...props}>
          {children}
        </h1>
      )
    }

    return (
      <MotionComponent
        ref={ref}
        initial={initial}
        animate={animate}
        transition={transition}
        {...props}
      >
        {children}
      </MotionComponent>
    )
  }
)

LazyMotionH1.displayName = 'LazyMotionH1'

const LazyMotionP = React.forwardRef<HTMLParagraphElement, MotionPProps>(
  ({ initial, animate, transition, exit, children, ...props }, ref) => {
    const motionEnabled = useMotionOnFirstInteraction({ idleDelayMs: 1500 })
    const [MotionComponent, setMotionComponent] = React.useState<any>(null)

    React.useEffect(() => {
      if (motionEnabled && !MotionComponent) {
        import('framer-motion').then(({ motion }) => {
          setMotionComponent(() => motion.p)
        })
      }
    }, [motionEnabled, MotionComponent])

    if (!motionEnabled || !MotionComponent) {
      return (
        <p ref={ref} {...props}>
          {children}
        </p>
      )
    }

    return (
      <MotionComponent
        ref={ref}
        initial={initial}
        animate={animate}
        transition={transition}
        exit={exit}
        {...props}
      >
        {children}
      </MotionComponent>
    )
  }
)

LazyMotionP.displayName = 'LazyMotionP'

interface LazyAnimatePresenceProps {
  mode?: 'wait' | 'sync' | 'popLayout'
  children: React.ReactNode
}

const LazyAnimatePresence: React.FC<LazyAnimatePresenceProps> = ({ mode, children }) => {
  const motionEnabled = useMotionOnFirstInteraction({ idleDelayMs: 1500 })
  const [AnimatePresenceComponent, setAnimatePresenceComponent] = React.useState<any>(null)

  React.useEffect(() => {
    if (motionEnabled && !AnimatePresenceComponent) {
      import('framer-motion').then(({ AnimatePresence }) => {
        setAnimatePresenceComponent(() => AnimatePresence)
      })
    }
  }, [motionEnabled, AnimatePresenceComponent])

  if (!motionEnabled || !AnimatePresenceComponent) {
    return <>{children}</>
  }

  return (
    <AnimatePresenceComponent mode={mode}>
      {children}
    </AnimatePresenceComponent>
  )
}

export const LazyMotion = {
  div: LazyMotionDiv,
  h1: LazyMotionH1,
  p: LazyMotionP,
  AnimatePresence: LazyAnimatePresence,
}
