"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import Image from "@/components/MyImage"
import { useEffect, useState } from "react"
import { useSettings } from "@/hooks/useSettings"
import { useLocale } from "next-intl"
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton"
import { getLocalizedText } from "@/utils/getLocalizedText"

const HeroSection = () => {
    const t = useTranslations("translation");
    const locale = useLocale();
    const router = useRouter();

    const { data, isLoading } = useSettings();
    const settings = data?.header?.landing_page

    const [token, setToken] = useState<string | null>(null)
    const [tokenLoaded, setTokenLoaded] = useState(false)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        setToken(storedToken)
        setTokenLoaded(true)
    }, [])

    if (isLoading || !tokenLoaded) {
        return <HeroSkeleton variant="main" />
    }

    function handleClick() {
        router.push("/auth/signin")
    }

    return (
        <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden">
            <Image
                src={settings?.image}
                alt="Construction scaffolding background"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute inset-0 flex items-center px-4 md:px-12">
                <div className="max-w-xl">
                    <h1 className="text-2xl md:text-4xl font-semibold text-white leading-tight mb-6">
                       {getLocalizedText(settings?.text, locale)}
                    </h1>

                    {!token && (
                        <Button
                            variant="outline"
                            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 mt-4"
                            onClick={handleClick}
                        >
                            {t("heroButton")}
                        </Button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default HeroSection