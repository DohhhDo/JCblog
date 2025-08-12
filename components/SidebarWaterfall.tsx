
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { pictureList } from '../lib/pictureList';

const COLUMN_COUNT = 2;
const SCROLL_SPEED = 0.5; // px per frame

function splitColumns(list: string[], columns: number) {
  const cols: string[][] = Array.from({ length: columns }, () => []);
  list.forEach((item, i) => {
    cols[i % columns].push(item);
  });
  return cols;
}

export function SidebarWaterfall() {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [containerHeight, setContainerHeight] = useState(800);

  useEffect(() => {
    setMounted(true);
    setContainerHeight(window.innerHeight);
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
      className="flex gap-4 px-3 pt-32 overflow-hidden relative"
      style={{ height: "100vh" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {columns.map((col, idx) => (
        <div
          key={idx}
          ref={containerRefs[idx]}
          className="flex flex-col w-1/2 overflow-hidden"
          style={{ height: "100%" }}
        >
          {/* 两次渲染图片以实现无缝循环 */}
          {[...col, ...col].map((src, i) => (
            <Image
              key={i}
              width={300}
              height={200}
              src={src}
              priority={i < 4} // 优先加载前4张图片
              alt={`waterfall-${i}`}
              className="mb-4 rounded-lg object-cover w-full h-auto"
              style={{ maxHeight: containerHeight / col.length - 16 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
