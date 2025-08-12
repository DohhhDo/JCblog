
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
function prepareImagesForColumn() {
  // 随机打乱图片列表
  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  const images = [...pictureList];
  const columnSize = Math.ceil(images.length / 4); // 四等分
  const shuffledImages = shuffleArray([...images]); // 随机打乱
  
  // 将图片分成四份
  const columns = Array.from({ length: 4 }, (_, i) => 
    shuffledImages.slice(i * columnSize, (i + 1) * columnSize)
  );
  
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
  const transitionRef = useRef<boolean>(false);
  const offsetRef = useRef(0);
  const frameRef = useRef<number>();
  
  // 使用 useMemo 来缓存初始列配置
  const [imageColumns, setImageColumns] = useState(() => {
    const { firstColumn, secondColumn, thirdColumn, fourthColumn } = prepareImagesForColumn();
    return position === 'left' 
      ? [firstColumn, secondColumn] 
      : [thirdColumn, fourthColumn];
  });

  // 处理滚动动画
  const updateScroll = useCallback(() => {
    if (!containerRef.current || paused || transitionRef.current) return;
    
    offsetRef.current += SCROLL_SPEED;
    
    // 当一个图片即将完全滚出可视区域时
    if (offsetRef.current >= IMAGE_HEIGHT - 10) {
      transitionRef.current = true;
      
      // 通知父组件
      onImageLeave?.(position === 'left' ? 'right' : 'left');
      
      // 准备下一组图片
      setImageColumns(prev => {
        const [col1, col2] = prev;
        return [
          [...col1.slice(1), col1[0]],
          [...col2.slice(1), col2[0]]
        ];
      });

      // 重置位置
      containerRef.current.style.transition = 'transform 0.3s ease-out';
      containerRef.current.style.transform = `translateY(-${IMAGE_HEIGHT}px)`;
      
      // 在过渡结束后重置状态
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = 'none';
          containerRef.current.style.transform = 'translateY(0)';
          offsetRef.current = 0;
          transitionRef.current = false;
        }
      }, 300);
    } else {
      containerRef.current.style.transform = `translateY(-${offsetRef.current}px)`;
    }
    
    frameRef.current = requestAnimationFrame(updateScroll);
  }, [paused, position, onImageLeave]);

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
        <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-white to-transparent z-10" />
        <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10" />
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
                  <div className="absolute inset-0 rounded-xl" style={{ 
                    background: 'linear-gradient(to bottom, transparent, white 50%, transparent)',
                    opacity: transitionRef.current ? 0.1 : 0,
                    transition: 'opacity 0.3s ease-out',
                  }} />
                  <Image
                    src={src}
                    alt={`app-icon-${imgIndex}`}
                    width={96}
                    height={96}
                    className="rounded-xl w-full h-full object-contain p-2 transition-all duration-300 hover:scale-110 hover:rotate-3"
                    style={{
                      filter: 'grayscale(0.2) brightness(0.95)',
                      willChange: 'transform',
                      transform: transitionRef.current ? 'translateY(-2px)' : 'none',
                      transition: 'transform 0.3s ease-out',
                    }}
                    priority={imgIndex < 4}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* 复制第一行到底部以实现无缝滚动 */}
        <div className="flex flex-row gap-4 w-full justify-center" style={{ marginTop: '-1px' }}>
          {imageColumns.map((column, colIndex) => (
            <div key={`bottom-${colIndex}`} className="flex flex-col gap-6">
              {column.slice(0, 1).map((src, imgIndex) => (
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
                      opacity: 0,
                    }}
                    priority
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
