"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import Image from "@/components/MyImage"

export function ProductImageGallery({ images, isNew, discount }: any) {
  const t = useTranslations("translation");
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length)
  const next = () => setCurrent((i) => (i + 1) % images.length)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-152 w-full overflow-hidden bg-secondary/30">
        <Image
          src={images[current]}
          alt="Product Display"
          fill
          className="object-cover"
          priority
        />

        {/* Floating Badges */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          {isNew && <Badge className="bg-white text-black hover:bg-white">{t("new")}</Badge>}
          {discount > 0 && <Badge className="bg-aqua text-white">-{discount}%</Badge>}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full bg-white/80 backdrop-blur-sm">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full bg-white/80 backdrop-blur-sm">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img: string, idx: number) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              "relative aspect-square overflow-hidden border-2 transition-all",
              current === idx ? "border-foreground" : "border-transparent opacity-60"
            )}
          >
            <Image src={img} alt="Thumbnail" fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

