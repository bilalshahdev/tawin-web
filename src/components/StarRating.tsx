"use client"

import { Star } from "lucide-react"
import { useState } from "react"

interface StarRatingProps {
  rating?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}

export default function StarRating({ rating = 0, onChange, readOnly = true, size = "sm" }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  const sizeClass = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-7 w-7"
  }[size]

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1
        const filled = value <= (hovered || rating)

        return (
          <Star
            key={i}
            className={`${sizeClass} transition-colors ${filled ? "fill-black text-black" : "fill-none text-gray-300"} ${!readOnly ? "cursor-pointer" : ""}`}
            onMouseEnter={() => !readOnly && setHovered(value)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => !readOnly && onChange?.(value)}
          />
        )
      })}
    </div>
  )
}