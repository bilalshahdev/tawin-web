"use client"

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
import { Label } from "@/components/ui/label"
import { viewModes } from "@/constants/viewModes"
import { useTranslations, useLocale } from "next-intl"
import { useGetCategories } from "@/hooks/useCategories"
import { ChevronDownIcon, Check } from "lucide-react"

interface FilterBarProps {
    viewMode: string
    onViewModeChange: (mode: string) => void
    activeCategory: string
    onCategoryChange: (id: string) => void
}

export function FilterBar({
    viewMode,
    onViewModeChange,
    activeCategory,
    onCategoryChange
}: FilterBarProps) {
    const t = useTranslations("translation");
    const locale = useLocale() as "en" | "ar";

    const { data: categoriesData } = useGetCategories();
    const categories = categoriesData?.data || [];

    const getActiveCategoryLabel = () => {
        if (!activeCategory || activeCategory === "all") return t("allCategories");
        for (const cat of categories) {
            if (cat._id === activeCategory) return cat.name[locale];
            const sub = cat.subcategories?.find((s: any) => s._id === activeCategory);
            if (sub) return sub.name[locale];
        }
        return t("allCategories");
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between gap-1 md:justify-start">
                <div className="flex items-center gap-1">
                    {viewModes.map(({ mode, icon }) => (
                        <button
                            key={mode}
                            onClick={() => onViewModeChange(mode)}
                            className={`flex h-8 w-8 items-center justify-center rounded transition-colors
                                ${viewMode === mode
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end md:gap-4">

                {/* Category — matches SelectTrigger exactly */}
                <div className="flex flex-col gap-2 flex-1 sm:flex-none">
                    <Label>{t("categories")}</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-[52px] px-4 rounded-full bg-gray-50 border border-transparent cursor-pointer flex w-full sm:w-54 items-center justify-between gap-2 text-sm outline-none focus:ring focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-50 ltr:text-left rtl:text-right">
                                <span className="line-clamp-1">{getActiveCategoryLabel()}</span>
                                <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align={locale === "ar" ? "end" : "start"}
                            className="w-54"
                        >
                            {/* All categories */}
                            <DropdownMenuItem
                                onSelect={() => onCategoryChange("all")}
                                className="cursor-pointer flex items-center justify-between py-2.5 ltr:pl-2 ltr:pr-8 rtl:pr-2 rtl:pl-8 focus:bg-purple-50 text-sm"
                            >
                                {t("allCategories")}
                                {(!activeCategory || activeCategory === "all") && (
                                    <Check className="size-4 text-aqua shrink-0" />
                                )}
                            </DropdownMenuItem>

                            {categories.map((category: any) => {
                                const hasSubcategories =
                                    category.subcategories && category.subcategories.length > 0;

                                if (hasSubcategories) {
                                    return (
                                        <DropdownMenuSub key={category._id}>
                                            <DropdownMenuSubTrigger className="cursor-pointer">
                                                <span>{category.name[locale]}</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent className="w-48">
                                                    {category.subcategories.map((sub: any) => (
                                                        <DropdownMenuItem
                                                            key={sub._id}
                                                            onSelect={() => onCategoryChange(sub._id)}
                                                            className="cursor-pointer flex items-center justify-between"
                                                        >
                                                            {sub.name[locale]}
                                                            {activeCategory === sub._id && (
                                                                <Check className="size-4 text-aqua" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    );
                                }

                                return (
                                    <DropdownMenuItem
                                        key={category._id}
                                        onSelect={() => onCategoryChange(category._id)}
                                        className="cursor-pointer flex items-center justify-between"
                                    >
                                        <span>{category.name[locale]}</span>
                                        {activeCategory === category._id && (
                                            <Check className="size-4 text-aqua shrink-0" />
                                        )}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Brand — unchanged */}
                {/* <div className="flex flex-col gap-2 flex-1 sm:flex-none">
                    <Label>{t("brand")}</Label>
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-54">
                            <SelectValue placeholder={t("all")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t("all")}</SelectItem>
                            <SelectItem value="brand1">{t("brandA")}</SelectItem>
                            <SelectItem value="brand2">{t("brandB")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div> */}
            </div>
        </div>
    )
}