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
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;

          if (hasSubcategories) {
            return (
              <DropdownMenuSub key={category._id}>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <span>{category.name[locale]}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-48">
                    {category.subcategories.map((sub: any) => (
                      <DropdownMenuItem key={sub._id} asChild>
                        <Link href={`/shop?category=${sub._id}`} className="cursor-pointer">
                          {sub?.name?.[locale]}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          }

          // If no subcategories, render as a direct navigation link to category
          return (
            <DropdownMenuItem key={category._id} asChild>
              <Link href={`/shop?category=${category._id}`} className="cursor-pointer w-full">
                {category?.name?.[locale]}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}