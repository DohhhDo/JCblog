
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

// 准备图片列表并分成两列
function prepareImagesForColumn() {
  // 复制两份图片列表以确保有足够的图片进行循环
  const images = [...pictureList, ...pictureList];
  const columnLength = Math.ceil(images.length / 2);
  return {
    firstColumn: images.slice(0, columnLength),
    secondColumn: images.slice(columnLength),
  };
}

export function SidebarWaterfall({ position, onImageLeave }: SidebarWaterfallProps) {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [imageColumns, setImageColumns] = useState(() => {
    const { firstColumn, secondColumn } = prepareImagesForColumn();
    return position === 'left' ? [firstColumn, secondColumn] : [secondColumn, firstColumn];
  });

  // 无限滚动动画
  useEffect(() => {
    if (!containerRef.current) return;

    let frame: number;
    // 使用 ref 来存储当前偏移量，避免闭包问题
    const offsetRef = useRef(scrollPosition);
    const container = containerRef.current;
    
    const animate = () => {
      if (!paused) {
        offsetRef.current += SCROLL_SPEED;
        
        // 当一个图片完全滚动出可视区域时
        if (offsetRef.current >= IMAGE_HEIGHT) {
          // 通知父组件需要将图片移到另一侧
          onImageLeave?.(position === 'left' ? 'right' : 'left');
          // 循环图片
          setImageColumns(prev => {
            const [col1, col2] = prev;
            return [
              [...col1.slice(1), col1[0]],
              [...col2.slice(1), col2[0]]
            ];
          });
          // 重置滚动位置
          offsetRef.current = 0;
        }
        
        setScrollPosition(offsetRef.current);
        container.style.transform = `translateY(-${offsetRef.current}px)`;
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [paused, position, onImageLeave]);

  return (
    <div 
      className="flex items-center justify-center w-full overflow-hidden relative" 
      style={{ height: 'calc(100vh - 4rem)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-6"
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
                    }}
                    priority={imgIndex < 4}
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
