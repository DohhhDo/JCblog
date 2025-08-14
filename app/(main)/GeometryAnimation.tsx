'use client'

import React from 'react'

interface Shape {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  type: 'circle' | 'square' | 'triangle'
}

export function GeometryAnimation() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [shapes, setShapes] = React.useState<Shape[]>([])
  const animationRef = React.useRef<number>()
  const containerRef = React.useRef<HTMLDivElement>(null)

  // 柔和的几何颜色 (测试用更明显的颜色)
  const colors = [
    'rgba(156, 163, 175, 0.8)', // zinc-400
    'rgba(209, 213, 219, 0.8)', // zinc-300
    'rgba(107, 114, 128, 0.8)', // zinc-500
    'rgba(75, 85, 99, 0.8)',    // zinc-600
    'rgba(148, 163, 184, 0.8)', // slate-400
    'rgba(203, 213, 225, 0.8)', // slate-300
  ]

  // 3秒后显示动画 (测试用)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      console.log('几何动画开始显示')
      setIsVisible(true)
    }, 3000) // 3秒测试

    return () => clearTimeout(timer)
  }, [])

  // 初始化几何形状
  React.useEffect(() => {
    if (!isVisible || !containerRef.current) {
      console.log('几何动画条件不满足:', { isVisible, hasContainer: !!containerRef.current })
      return
    }

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const centerWidth = Math.min(1200, containerRect.width * 0.7) // 中间内容区域宽度
    const sideWidth = (containerRect.width - centerWidth) / 2 // 每侧空白区域宽度

    console.log('容器信息:', { containerRect, centerWidth, sideWidth })

    if (sideWidth < 100) {
      console.log('侧边区域太小，不显示动画')
      return // 如果侧边区域太小就不显示
    }

    const newShapes: Shape[] = []
    
    // 在左右两侧各创建3-5个几何形状
    for (let side = 0; side < 2; side++) {
      const shapeCount = 3 + Math.floor(Math.random() * 3)
      for (let i = 0; i < shapeCount; i++) {
        const shape: Shape = {
          id: side * 10 + i,
          x: side === 0 
            ? Math.random() * (sideWidth - 60) + 30
            : containerRect.width - sideWidth + Math.random() * (sideWidth - 60) + 30,
          y: Math.random() * (containerRect.height - 60) + 30,
          vx: (Math.random() - 0.5) * 2, // 速度范围 -1 到 1
          vy: (Math.random() - 0.5) * 2,
          size: 20 + Math.random() * 30, // 大小20-50px
          color: colors[Math.floor(Math.random() * colors.length)],
          type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle'
        }
        newShapes.push(shape)
      }
    }

    console.log('创建了几何形状:', newShapes.length, newShapes)
    setShapes(newShapes)
  }, [isVisible])

  // 动画循环
  React.useEffect(() => {
    if (!isVisible || shapes.length === 0 || !containerRef.current) return

    const animate = () => {
      const container = containerRef.current
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const centerWidth = Math.min(1200, containerRect.width * 0.7)
      const sideWidth = (containerRect.width - centerWidth) / 2
      const leftBoundary = sideWidth
      const rightBoundary = containerRect.width - sideWidth

      setShapes(prevShapes => {
        return prevShapes.map(shape => {
          let newX = shape.x + shape.vx
          let newY = shape.y + shape.vy
          let newVx = shape.vx
          let newVy = shape.vy

          // 检查边界碰撞
          // 左侧区域
          if (shape.x < leftBoundary) {
            if (newX <= 0 || newX >= leftBoundary - shape.size) {
              newVx = -newVx
              newX = Math.max(0, Math.min(leftBoundary - shape.size, newX))
            }
          }
          // 右侧区域
          else if (shape.x > rightBoundary) {
            if (newX <= rightBoundary || newX >= containerRect.width - shape.size) {
              newVx = -newVx
              newX = Math.max(rightBoundary, Math.min(containerRect.width - shape.size, newX))
            }
          }

          // 上下边界
          if (newY <= 0 || newY >= containerRect.height - shape.size) {
            newVy = -newVy
            newY = Math.max(0, Math.min(containerRect.height - shape.size, newY))
          }

          // 与其他几何形状的碰撞检测
          prevShapes.forEach(otherShape => {
            if (otherShape.id !== shape.id) {
              const dx = newX - otherShape.x
              const dy = newY - otherShape.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              const minDistance = (shape.size + otherShape.size) / 2

              if (distance < minDistance) {
                // 简单的弹性碰撞
                const angle = Math.atan2(dy, dx)
                newVx = Math.cos(angle) * Math.abs(newVx)
                newVy = Math.sin(angle) * Math.abs(newVy)
              }
            }
          })

          return {
            ...shape,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, shapes.length])

  // 渲染几何形状
  const renderShape = (shape: Shape) => {
    const style = {
      position: 'absolute' as const,
      left: shape.x,
      top: shape.y,
      width: shape.size,
      height: shape.size,
      backgroundColor: shape.type === 'circle' ? shape.color : undefined,
      borderRadius: shape.type === 'circle' ? '50%' : undefined,
      transition: 'none',
      pointerEvents: 'none' as const,
    }

    if (shape.type === 'square') {
      return (
        <div
          key={shape.id}
          style={{
            ...style,
            backgroundColor: shape.color,
          }}
        />
      )
    }

    if (shape.type === 'triangle') {
      return (
        <div
          key={shape.id}
          style={{
            ...style,
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderLeft: `${shape.size / 2}px solid transparent`,
            borderRight: `${shape.size / 2}px solid transparent`,
            borderBottom: `${shape.size}px solid ${shape.color}`,
          }}
        />
      )
    }

    return <div key={shape.id} style={style} />
  }

  if (!isVisible) {
    console.log('几何动画不可见')
    return null
  }

  console.log('渲染几何动画，形状数量:', shapes.length)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        backgroundColor: 'rgba(255,0,0,0.1)', // 临时红色背景用于调试
        zIndex: 999 // 确保在最高层级
      }}
    >
      {shapes.map(renderShape)}
    </div>
  )
}
