"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import React from "react"

type BreadcrumbItem = {
  title: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  // Added variant prop
  variant?: "default" | "white" 
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, variant = "default" }) => {
  if (!items || items.length === 0) return null

  // Define dynamic classes based on variant
  const isWhite = variant === "white"
  const activeColor = isWhite ? "text-white" : "text-solid"
  const linkColor = isWhite ? "text-white/80 hover:text-white" : "text-gray-900"
  const separatorColor = isWhite ? "text-white/60" : "text-foreground"

  return (
    <nav className="text-sm" aria-label="breadcrumb">
      <ol className="flex items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className={isLast ? activeColor : ""}>
              {isLast ? (
                <span className="truncate capitalize">{item.title}</span>
              ) : (
                <div className="flex items-center">
                  <Link 
                    href={item.href || "#"} 
                    className={`${linkColor} truncate hover:underline capitalize transition-colors`}
                  >
                    {item?.title}
                  </Link>
                  <ChevronRight className={`mx-2 ${separatorColor} w-3 h-3 rtl:rotate-180`} />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb