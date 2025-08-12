
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { pictureList } from '../lib/pictureList';

interface SidebarWaterfallProps {
  position: 'left' | 'right';
}

const SCROLL_SPEED = 0.5; // px per frame

// 将图片列表分成左右两部分，确保总数是偶数以便均匀分配
function prepareImages() {
  const totalImages = [...pictureList, ...pictureList]; // 复制一份确保足够多的图片
  const midPoint = Math.ceil(totalImages.length / 2);
  return {
    leftImages: totalImages.slice(0, midPoint),
    rightImages: totalImages.slice(midPoint),
  };
}

export function SidebarWaterfall({ position }: SidebarWaterfallProps) {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 准备图片数据
  const { leftImages, rightImages } = prepareImages();
  const images = position === 'left' ? leftImages : rightImages;

  // 无限滚动动画
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    let frame: number;
    let offset = 0;
    const totalHeight = containerRef.current.scrollHeight / 2;
    
    const animate = () => {
      if (!paused && containerRef.current) {
        offset = (offset + SCROLL_SPEED) % totalHeight;
        containerRef.current.style.transform = `translateY(-${offset}px)`;
        
        // 当滚动到底部时，重置位置到顶部
        if (offset >= totalHeight - 1) {
          offset = 0;
        }
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [paused, mounted]);

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
        {/* 渲染两份图片以实现无缝循环 */}
        {[...images, ...images].map((src, i) => (
          <div key={i} className="relative w-28 h-28">
            <Image
              src={src}
              alt={`app-icon-${i}`}
              width={120}
              height={120}
              className="rounded-2xl w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-110 hover:rotate-3"
              style={{
                filter: 'grayscale(0.2) brightness(0.95)',
              }}
              priority={i < 8} // 优先加载更多图片
            />
          </div>
        ))}
      </div>
    </div>
  );
}
