"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
// 1. 引入自动播放插件
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

// 🔧 延迟加载 Lightbox 组件 - 仅在用户点击放大时才加载 (~30kB)
const LightboxComponent = dynamic(
  () => import("yet-another-react-lightbox"),
  { ssr: false }
)

interface ImageSliderClientProps {
  images: string[]
  className?: string
  aspectRatio?: string
  delay?: number // 2. 新增 delay 参数 (单位 ms)
}

export function ImageSliderClient({ 
  images, 
  className, 
  aspectRatio = "16/9", 
  delay = 3000 // 默认 3 秒
}: ImageSliderClientProps) {
  
  // 3. 配置 Embla 自动播放
  // stopOnInteraction: false 表示用户手动划过之后，自动播放是否继续（建议 false，即继续播放）
  // stopOnMouseEnter: true 表示鼠标悬停时暂停（可选，提升体验）
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true }, 
    [Autoplay({ delay, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const ratioStyle = aspectRatio.includes("/") 
    ? { aspectRatio: aspectRatio.replace(":", "/") }
    : { height: aspectRatio }

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const openLightbox = (idx: number) => {
    setIndex(idx)
    setOpen(true)
  }

  if (!images || images.length === 0) return null

  return (
    <>
      <div className={cn("relative group my-8 mx-auto", className)}>
        <div 
          className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-muted shadow-sm" 
          ref={emblaRef}
        >
          <div className="flex touch-pan-y">
            {images.map((src, i) => (
              <div 
                className="flex-[0_0_100%] min-w-0 relative cursor-pointer" 
                key={src}
                style={ratioStyle}
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={src}
                  alt={`Slide ${i + 1}`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              onClick={(e) => { e.stopPropagation(); scrollNext(); }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {open && (
        <LightboxComponent
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images.map(src => ({ src }))}
          styles={{ container: { backgroundColor: "rgba(0, 0, 0, .9)" } }}
          on={{
              view: ({ index: currentIndex }) => setIndex(currentIndex) 
          }}
        />
      )}
    </>
  )
}