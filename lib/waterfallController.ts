'use client'

// 全局瀑布流动画控制器
class WaterfallController {
  private isActive = false
  private isLoading = false
  private listeners = new Set<(state: WaterfallState) => void>()
  private geometryPauseListeners = new Set<(paused: boolean) => void>()
  
  // 瀑布流状态
  getState(): WaterfallState {
    return {
      isActive: this.isActive,
      isLoading: this.isLoading,
    }
  }
  
  // 订阅状态变化
  subscribe(listener: (state: WaterfallState) => void) {
    this.listeners.add(listener)
    // 立即发送当前状态
    listener(this.getState())
    
    return () => {
      this.listeners.delete(listener)
    }
  }
  
  // 订阅几何动画暂停状态
  subscribeGeometryPause(listener: (paused: boolean) => void) {
    this.geometryPauseListeners.add(listener)
    return () => {
      this.geometryPauseListeners.delete(listener)
    }
  }
  
  // 通知状态变化
  private notifyListeners() {
    const state = this.getState()
    this.listeners.forEach(listener => listener(state))
  }
  
  // 通知几何动画暂停状态变化
  private notifyGeometryPause(paused: boolean) {
    this.geometryPauseListeners.forEach(listener => listener(paused))
  }
  
  // 开始瀑布流动画
  async start() {
    if (this.isActive || this.isLoading) return
    
    this.isLoading = true
    this.notifyListeners()
    
    try {
      // 暂停几何动画
      this.notifyGeometryPause(true)
      
      // 预加载图片
      await this.preloadImages()
      
      // 开始动画
      this.isLoading = false
      this.isActive = true
      this.notifyListeners()
      
      // 10秒后自动停止
      setTimeout(() => {
        this.stop()
      }, 10000)
      
    } catch (error) {
      console.error('Failed to start waterfall animation:', error)
      this.isLoading = false
      this.notifyListeners()
      // 如果失败，恢复几何动画
      this.notifyGeometryPause(false)
    }
  }
  
  // 停止瀑布流动画
  stop() {
    if (!this.isActive) return
    
    this.isActive = false
    this.isLoading = false
    this.notifyListeners()
    
    // 延迟10秒后恢复几何动画（如果瀑布流没有重新启动）
    setTimeout(() => {
      if (!this.isActive) {
        this.notifyGeometryPause(false)
      }
    }, 10000)
  }
  
  // 预加载图片
  private async preloadImages(): Promise<void> {
    const { pictureList } = await import('~/lib/pictureList')
    
    const imageLoadPromises = pictureList.map((src) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
        img.src = src
      })
    })
    
    // 等待所有图片加载完成
    await Promise.all(imageLoadPromises)
  }
}

export interface WaterfallState {
  isActive: boolean
  isLoading: boolean
}

// 创建全局实例
export const waterfallController = new WaterfallController()
