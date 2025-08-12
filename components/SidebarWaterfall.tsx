
'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { pictureList } from '../lib/pictureList';

interface SidebarWaterfallProps {
  position: 'left' | 'right';
}

const COLUMN_COUNT = 2;
const SCROLL_SPEED = 0.5; // px per frame

function splitColumns(list: string[], columns: number) {
  const cols: string[][] = Array.from({ length: columns }, () => []);
  list.forEach((item, i) => {
    cols[i % columns].push(item);
  });
  return cols;
}

export function SidebarWaterfall({ position }: SidebarWaterfallProps) {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // 分别创建两个 ref
  const firstColRef = useRef<HTMLDivElement>(null);
  const secondColRef = useRef<HTMLDivElement>(null);
  
  // 使用 useMemo 缓存 refs 数组
  const containerRefs = useMemo(
    () => [firstColRef, secondColRef],
    [firstColRef, secondColRef]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // 拆分图片到两列
  const columns = splitColumns(pictureList, COLUMN_COUNT);

  // 无限滚动动画
  useEffect(() => {
    if (!mounted) return;
    let frame: number;
    let offset = 0;
    const animate = () => {
      if (!paused) {
        offset += SCROLL_SPEED;
        containerRefs.forEach((ref) => {
          if (ref.current) {
            const totalHeight = ref.current.scrollHeight / 2;
            ref.current.style.transform = `translateY(-${offset % totalHeight}px)`;
          }
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [paused, mounted, containerRefs]);

  if (!mounted) return null;

  return (
    <div
      className={`flex gap-4 ${position === 'left' ? 'justify-start' : 'justify-end'} px-3 pt-32 overflow-hidden relative`}
      style={{ height: "100vh" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {columns.map((col, idx) => (
        <div
          key={idx}
          ref={containerRefs[idx]}
          className={`flex flex-col w-1/2 overflow-hidden ${position === 'right' ? 'order-first' : ''}`}
          style={{ height: "100%" }}
        >
          {/* 两次渲染图片以实现无缝循环 */}
          {[...col, ...col].map((src, i) => (
            <Image
              key={i}
              width={64}
              height={64}
              src={src}
              priority={i < 4} // 优先加载前4张图片
              alt={`app-icon-${i}`}
              className="mb-6 rounded-xl w-16 h-16 transition-transform duration-300 hover:scale-110 hover:rotate-3"
              style={{
                filter: 'grayscale(0.2) brightness(0.95)',
              }}
              unoptimized
            />
          ))}
        </div>
      ))}
    </div>
  );
}
