"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetCategories } from "@/hooks/useCategories"
import { getLocalizedText } from "@/utils/getLocalizedText"

export function ShopDropdown({ isMain }: { isMain: boolean }) {
  const locale = useLocale() as "en" | "ar"
  const t = useTranslations("translation")

  const { data: categoriesData } = useGetCategories()
  const categories = categoriesData?.data || []

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1 text-sm font-medium transition-all cursor-pointer relative pb-1 outline-none",
            isMain
              ? "text-white/80 hover:text-white"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          {t("shop")}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={locale === "ar" ? "end" : "start"}
        className="w-56"
      >
        {categories.map((category: any) => {
          const categoryName = getLocalizedText(category?.name, locale)

          // hide if no translation exists at all
          if (!categoryName) return null

          const validSubcategories =
            category?.subcategories?.filter((sub: any) =>
              getLocalizedText(sub?.name, locale)
            ) || []

          const hasSubcategories = validSubcategories.length > 0

          if (hasSubcategories) {
            return (
              <DropdownMenuSub key={category._id}>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <span>{categoryName}</span>
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-48">
                    {validSubcategories.map((sub: any) => (
                      <DropdownMenuItem key={sub._id} asChild>
                        <Link
                          href={`/shop?category=${sub._id}`}
                          className="cursor-pointer"
                        >
                          {getLocalizedText(sub?.name, locale)}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )
          }

          return (
            <DropdownMenuItem key={category._id} asChild>
              <Link
                href={`/shop?category=${category._id}`}
                className="cursor-pointer w-full"
              >
                {categoryName}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}