"use client"

import Image from "@/components/MyImage"
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";
import { useSettings } from "@/hooks/useSettings";
import { getLocalizedText } from "@/utils/getLocalizedText";
import { useLocale } from "next-intl";

const HeroSection = () => {
    const locale = useLocale();

    const { data, isLoading } = useSettings();

    const settings = data?.header?.home

    if (isLoading) {
        return <HeroSkeleton variant={"home"} />
    }

    return (
        <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden">
            <Image
                src={settings?.image}
                alt="HeroSection"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute inset-0 flex items-center px-4 md:px-12">
                <div className="max-w-xl">
                    <h1 className="text-2xl md:text-4xl font-semibold text-white leading-tight mb-6">
                        {getLocalizedText(settings?.text, locale)}
                    </h1>
                </div>
            </div>
        </section>
    )
}

export default HeroSection