
'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { pictureList } from '../lib/pictureList';

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
  const [imageColumns, setImageColumns] = useState<string[][]>(() => {
    const { firstColumn, secondColumn, thirdColumn, fourthColumn } = prepareImagesForColumn();
    // 确保不同位置使用不同的图片组
    return position === 'left' 
      ? [firstColumn, secondColumn] 
      : [thirdColumn, fourthColumn];
  });

  // 处理滚动动画
  const updateScroll = useCallback(() => {
    if (!containerRef.current || paused) return;
    
    offsetRef.current += SCROLL_SPEED;
    const totalHeight = IMAGE_HEIGHT * imageColumns[0].length; // 使用实际内容高度
    
    // 实现无缝循环
    if (offsetRef.current >= IMAGE_HEIGHT) {
      // 计算新的偏移量，保持滚动位置
      const newOffset = offsetRef.current - IMAGE_HEIGHT;
      offsetRef.current = newOffset;
      
      // 通知父组件
      onImageLeave?.(position === 'left' ? 'right' : 'left');
      
      // 重新排列图片顺序
      setImageColumns(prevColumns => 
        prevColumns.map(column => {
          const [first, ...rest] = column;
          return [...rest, first];
        })
      );
    }
    
    // 应用平滑滚动
    containerRef.current.style.transform = `translateY(-${offsetRef.current}px)`;
    
    frameRef.current = requestAnimationFrame(updateScroll);
  }, [paused, position, onImageLeave, imageColumns]);

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
      className="flex items-center justify-center w-full overflow-hidden relative" 
      style={{ height: 'calc(100vh - 4rem)' }}
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
        {/* 在底部添加第一张图片用于无缝过渡 */}
        <div className="flex flex-row gap-4 w-full justify-center" style={{ marginTop: '0' }}>
          {imageColumns.map((column, colIndex) => (
            <div key={`bottom-${colIndex}`} className="flex flex-col gap-6">
              {[column[0]].map((src, imgIndex) => (
                <div 
                  key={`bottom-${colIndex}-${imgIndex}`} 
                  className="relative w-24 h-24"
                >
                  <Image
                    src={src}
                    alt={`app-icon-clone-${imgIndex}`}
                    width={96}
                    height={96}
                    className="rounded-xl w-full h-full object-contain p-2"
                    style={{
                      filter: 'grayscale(0.2) brightness(0.95)',
                      opacity: 0.99, // 轻微降低重复图片的不透明度
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
