
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { pictureList } from '../lib/pictureList';

interface SidebarWaterfallProps {
  position: 'left' | 'right';
}

const SCROLL_SPEED = 0.5; // px per frame
const COLUMNS_PER_SIDE = 2; // 每侧2列

// 将图片列表分成多列，确保每列数量相近
function distributeImages() {
  // 确保有足够的图片用于循环
  const totalImages = [...pictureList, ...pictureList, ...pictureList];
  const totalColumns = COLUMNS_PER_SIDE * 2; // 总共4列（左2右2）
  
  // 计算每列应该有多少图片
  const imagesPerColumn = Math.ceil(totalImages.length / totalColumns);
  
  // 分配图片到每一列
  const columns = Array.from({ length: totalColumns }, (_, columnIndex) => {
    const start = columnIndex * imagesPerColumn;
    const end = start + imagesPerColumn;
    return totalImages.slice(start, end);
  });

  // 返回左右两侧的列
  return {
    leftColumns: columns.slice(0, COLUMNS_PER_SIDE),
    rightColumns: columns.slice(COLUMNS_PER_SIDE),
  };
}

export function SidebarWaterfall({ position }: SidebarWaterfallProps) {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 准备图片数据
  const { leftColumns, rightColumns } = distributeImages();
  const columns = position === 'left' ? leftColumns : rightColumns;

  // 无限滚动动画
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    let frame: number;
    let offset = scrollPosition;
    const container = containerRef.current;
    const totalHeight = container.scrollHeight / 2;
    
    const animate = () => {
      if (!paused) {
        offset = (offset + SCROLL_SPEED) % totalHeight;
        setScrollPosition(offset);
        
        // 应用变换
        container.style.transform = `translateY(-${offset}px)`;
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [paused, mounted, scrollPosition]);

  if (!mounted) return null;

  return (
    <div
      className={`flex items-center justify-center w-full pt-32 overflow-hidden relative`}
      style={{ height: "100vh" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-8 overflow-hidden"
        style={{ height: "200%" }}
      >
        {/* 渲染两份内容以实现无缝循环 */}
        {[...Array(2)].map((_, setIndex) => (
          <div key={setIndex} className="flex flex-row gap-4 w-full justify-center">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-6">
                {column.map((src, imgIndex) => (
                  <div key={`${setIndex}-${colIndex}-${imgIndex}`} className="relative w-24 h-24">
                    <Image
                      src={src}
                      alt={`app-icon-${imgIndex}`}
                      width={96}
                      height={96}
                      className="rounded-xl w-full h-full object-contain p-2 transition-all duration-300 hover:scale-110 hover:rotate-3"
                      style={{
                        filter: 'grayscale(0.2) brightness(0.95)',
                      }}
                      priority={setIndex === 0 && imgIndex < 4} // 只优先加载第一组的前几张
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
