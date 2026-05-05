"use client"

import { useLocale, useTranslations } from "next-intl"
import { useGetCategoryById } from "@/hooks/useCategories"
import Breadcrumb from '@/components/ui/breadcrumb'
import Image from '@/components/MyImage'
import { useSettings } from "@/hooks/useSettings"
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton"

interface HeroProps {
    activeCategory: string | null;
    isLoading?: boolean;
}

const Hero = ({ activeCategory, isLoading }: HeroProps) => {
    const locale = useLocale() as "en" | "ar";
    const t = useTranslations("shop");

    const { data: settingsData } = useSettings();

    const { data: categoryData, isLoading: isCategoryLoading } = useGetCategoryById(activeCategory || "");

    if (isLoading || isCategoryLoading) {
        return <HeroSkeleton variant="shop" />
    }

    const title = categoryData?.name[locale] || settingsData?.header?.shop?.text?.[locale];
    const subTitle = categoryData?.description[locale] || "";
    const backgroundImage = categoryData?.thumbnail || settingsData?.header?.shop?.image;

    return (
        <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden">
            <Image
                src={backgroundImage}
                alt={title || ""}
                fill
                className="object-cover"
                sizes="100vw"
                priority
            />

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-0 flex h-full items-center justify-center">
                <div className="flex flex-col items-center space-y-4 text-center px-4">
                    <Breadcrumb
                        variant="white"
                        items={[
                            { title: t("home"), href: "/home" },
                            { title: t("breadcrumbShop") },
                        ]}
                    />
                    <h1 className="text-2xl md:text-4xl font-semibold text-white leading-tight capitalize">
                        {title}
                    </h1>
                    <p className="text-base max-w-2xl mx-auto text-white/90 first-letter:uppercase">
                        {subTitle}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Hero;