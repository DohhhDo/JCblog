
'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
      <div className="flex items-center justify-center w-full overflow-hidden relative h-[100vh]" 
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 w-full h-24 bg-gradient-to-b dark:from-neutral-900 from-white to-transparent z-10" />
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t dark:from-neutral-900 from-white to-transparent z-10" />
      </div>{ pictureList } from '../lib/pictureList';

interface SidebarWaterfallProps {
  position: 'left' | 'right';
  onImageLeave?: (targetPosition: 'left' | 'right') => void;
}

const SCROLL_SPEED = 0.8; // 稍快的滚动速度
const IMAGE_HEIGHT = 112; // 图片高度(96) + 间距(16)

// 将图片列表分成四列，确保每列都不完全相同
function prepareImagesForColumn(): {
  firstColumn: string[];
  secondColumn: string[];
  thirdColumn: string[];
  fourthColumn: string[];
} {
  // 随机打乱图片列表
  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const images = [...pictureList, ...pictureList]; // 复制两份确保有足够的图片
  const shuffledImages = shuffleArray(images); // 随机打乱
  
  // 确保每列至少有6张图片
  const columnSize = Math.max(6, Math.ceil(shuffledImages.length / 4));
  
  // 将图片分成四份，如果图片不够，循环使用
  const columns = Array.from({ length: 4 }, (_, i) => {
    const start = i * columnSize;
    const columnImages: string[] = [];
    for (let j = 0; j < columnSize; j++) {
      const index = (start + j) % shuffledImages.length;
      columnImages.push(shuffledImages[index]);
    }
    return columnImages;
  });
  
  return {
    firstColumn: columns[0],
    secondColumn: columns[1],
    thirdColumn: columns[2],
    fourthColumn: columns[3]
  };
}

export function SidebarWaterfall({ position, onImageLeave }: SidebarWaterfallProps) {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const frameRef = useRef<number>();
  
  // 初始化图片列配置
  const [imageColumns] = useState<string[][]>(() => {
    const { firstColumn, secondColumn, thirdColumn, fourthColumn } = prepareImagesForColumn();
    // 确保不同位置使用不同的图片组，并且每列重复三次以确保滚动连续性
    const selectedColumns = position === 'left' 
      ? [firstColumn, secondColumn] 
      : [thirdColumn, fourthColumn];
    
    // 对每列的内容重复三次
    return selectedColumns.map(column => [...column, ...column, ...column]);
  });

  // 跟踪当前显示的部分
  const currentSetRef = useRef(0);
  const itemsPerSet = Math.floor(imageColumns[0].length / 3);
  
  // 处理滚动动画
  const updateScroll = useCallback(() => {
    if (!containerRef.current || paused) return;
    
    offsetRef.current += SCROLL_SPEED;
    const singleSetHeight = IMAGE_HEIGHT * itemsPerSet;
    
    // 当滚动到一组图片的末尾时
    if (offsetRef.current >= singleSetHeight) {
      // 更新当前显示的组
      currentSetRef.current = (currentSetRef.current + 1) % 3;
      
      // 重置位置到新的一组的开始
      offsetRef.current = 0;
      
      // 通知父组件
      onImageLeave?.(position === 'left' ? 'right' : 'left');
    }
    
    // 计算实际显示位置，考虑当前显示的组
    const displayOffset = offsetRef.current + (currentSetRef.current * singleSetHeight);
    
    // 应用平滑滚动
    containerRef.current.style.transform = `translateY(-${displayOffset}px)`;
    
    frameRef.current = requestAnimationFrame(updateScroll);
  }, [paused, position, onImageLeave, itemsPerSet]);

  // 启动动画
  useEffect(() => {
    frameRef.current = requestAnimationFrame(updateScroll);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateScroll]);

  return (
    <div 
      className="flex items-center justify-center w-full overflow-hidden relative h-full" 
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 w-full h-12 bg-gradient-to-b dark:from-neutral-900 from-white to-transparent z-10" />
        <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t dark:from-neutral-900 from-white to-transparent z-10" />
      </div>
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-6 will-change-transform"
        style={{
          clipPath: 'inset(1px 0)',
        }}
      >
        <div className="flex flex-row gap-4 w-full justify-center">
          {imageColumns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-6">
              {column.map((src, imgIndex) => (
                <div 
                  key={`${colIndex}-${imgIndex}`} 
                  className="relative w-24 h-24"
                >
                  <Image
                    src={src}
                    alt={`app-icon-${imgIndex}`}
                    width={96}
                    height={96}
                    className="rounded-xl w-full h-full object-contain p-2 transition-all duration-300 hover:scale-110 hover:rotate-3"
                    style={{
                      filter: 'grayscale(0.2) brightness(0.95)',
                      willChange: 'transform',
                    }}
                    priority={true}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
