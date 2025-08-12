
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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
  const [scrollPosition, setScrollPosition] = useState(0);
  const transitionRef = useRef<boolean>(false);
  
  // 使用 useMemo 来缓存初始列配置
  const [imageColumns, setImageColumns] = useState(() => {
    const { firstColumn, secondColumn, thirdColumn, fourthColumn } = prepareImagesForColumn();
    return position === 'left' 
      ? [firstColumn, secondColumn] 
      : [thirdColumn, fourthColumn];
  });

  // 用于存储当前偏移量的ref
  const offsetRef = useRef(scrollPosition);
  
  // 防止闪烁的过渡动画控制
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    if (transitionRef.current) {
      container.style.transition = 'transform 0.3s ease-out';
    } else {
      container.style.transition = 'none';
    }
  }, [scrollPosition]);

  // 无限滚动动画
  useEffect(() => {
    if (!containerRef.current) return;

    let frame: number;
    const container = containerRef.current;
    const startPosition = scrollPosition;
    offsetRef.current = startPosition;
    
    const animate = () => {
      if (!paused) {
        offsetRef.current += SCROLL_SPEED;
        
        // 当一个图片即将完全滚出可视区域时
        if (offsetRef.current >= IMAGE_HEIGHT - 10) { // 提前开始过渡
          // 标记开始过渡
          if (!transitionRef.current) {
            transitionRef.current = true;
            
            // 通知父组件需要将图片移到另一侧
            onImageLeave?.(position === 'left' ? 'right' : 'left');
            
            // 准备下一组图片
            requestAnimationFrame(() => {
              setImageColumns(prev => {
                const [col1, col2] = prev;
                return [
                  [...col1.slice(1), col1[0]],
                  [...col2.slice(1), col2[0]]
                ];
              });
            });

            // 在过渡结束后重置状态
            setTimeout(() => {
              offsetRef.current = 0;
              setScrollPosition(0);
              transitionRef.current = false;
            }, 300);
          }
        } else {
          setScrollPosition(offsetRef.current);
        }
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [paused, position, onImageLeave]);

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
          transform: `translateY(-${scrollPosition}px)`,
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
