'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import * as Dialog from '@radix-ui/react-dialog'
import { clsxm } from '@zolplay/utils'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import { ClientOnly } from '~/components/ClientOnly'
import { Commentable } from '~/components/Commentable'

export function PortableTextExternalImage({
  value,
}: PortableTextComponentProps<{
  _key: string
  url: string
  alt?: string
  label?: string
}>) {
  const [isZoomed, setIsZoomed] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const [imageDimensions, setImageDimensions] = React.useState({
    width: 800,
    height: 600,
  })

  const hasLabel = React.useMemo(
    () => value.label && value.label.length > 0,
    [value.label]
  )

  // 处理图片加载
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // 如果图片加载失败，显示备用内容
  if (imageError) {
    return (
      <div data-blockid={value._key} className="group relative pr-3 md:pr-0">
        <ClientOnly>
          <Commentable className="z-30" blockId={value._key} />
        </ClientOnly>
        
        <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-800">
          <div className="flex items-center justify-center rounded-xl bg-zinc-200 p-8 dark:bg-zinc-700">
            <div className="text-center">
              <div className="mb-2 text-2xl">🖼️</div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                图片加载失败
              </p>
              <a
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                查看原图
              </a>
            </div>
          </div>
          {hasLabel && (
            <span className="mt-2 flex w-full items-center justify-center text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {value.label}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div data-blockid={value._key} className="group relative pr-3 md:pr-0">
      <ClientOnly>
        <Commentable className="z-30" blockId={value._key} />
      </ClientOnly>

      <Dialog.Root open={isZoomed} onOpenChange={setIsZoomed}>
        {isZoomed && (
          <div
            className="relative"
            style={{
              width: imageDimensions.width,
              height: imageDimensions.height,
            }}
          />
        )}

        <AnimatePresence>
          {!isZoomed && (
            <div
              className={clsxm(
                hasLabel ? 'rounded-2xl bg-zinc-100 p-2 dark:bg-zinc-800' : ''
              )}
            >
              <motion.div className="relative" layoutId={`external_image_${value._key}`}>
                <Dialog.Trigger>
                  <div className="relative">
                    <img
                      src={value.url}
                      className={clsxm(
                        'relative z-20 cursor-zoom-in dark:brightness-75 dark:transition-[filter] dark:hover:brightness-100',
                        hasLabel ? 'rounded-xl' : 'rounded-xl md:rounded-3xl'
                      )}
                      alt={value.alt || '外链图片'}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                      }}
                    />
                    {/* 外链图片标识 */}
                    <div className="absolute right-2 top-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      外链图片
                    </div>
                  </div>
                </Dialog.Trigger>
              </motion.div>
              {hasLabel && (
                <span className="mt-1 flex w-full items-center justify-center text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {value.label}
                </span>
              )}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isZoomed && (
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 transform">
                <motion.div
                  layoutId={`external_image_${value._key}`}
                  className="relative"
                >
                  <img
                    src={value.url}
                    className="rounded-xl object-contain"
                    alt={value.alt || '外链图片'}
                    style={{
                      maxWidth: '90vw',
                      maxHeight: '90vh',
                      width: 'auto',
                      height: 'auto',
                    }}
                  />
                  <Dialog.Close className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M12.5 3.5a.5.5 0 0 0-.707 0L8 7.293 4.207 3.5a.5.5 0 1 0-.707.707L7.293 8l-3.793 3.793a.5.5 0 0 0 .707.707L8 8.707l3.793 3.793a.5.5 0 0 0 .707-.707L8.707 8l3.793-3.793a.5.5 0 0 0 0-.707z"/>
                    </svg>
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  )
}
