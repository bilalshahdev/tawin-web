"use client"

import { Button } from "@/components/ui/button"
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { useTranslations } from "next-intl"
import Image from "@/components/MyImage";

export default function PromotionSection() {
    const t = useTranslations("translation");

    return (
        <div className="w-full overflow-hidden">

            {/* 1. Limited Offers Section */}
            {/* <section className="flex flex-col lg:flex-row min-h-[500px]">
                <div className="w-full lg:w-1/2 relative min-h-[500px]">
                    <Image
                        src="/promotion.png"
                        alt="Living Room Decoration"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="w-full lg:w-1/2 bg-[#141718] flex flex-col justify-center p-8 md:p-16 lg:p-24 space-y-4 text-left rtl:text-right">
                    <span className="text-aqua font-semibold text-sm uppercase tracking-wider">
                        {t("limitedOffers")}
                    </span>
                    <h2 className="text-4xl font-semibold text-white leading-tight">
                        {t("offerTitle")}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        {t("offerSubtitle")}
                    </p>

                    <div className="space-y-4">
                        <p className="text-gray-400 text-xs">
                            {t("offerEndsIn")}:
                        </p>
                        <div className="flex gap-3 ltr:justify-start rtl:justify-end">
                            {[
                                { val: "02", label: t("days") },
                                { val: "12", label: t("hours") },
                                { val: "45", label: t("minutes") },
                                { val: "05", label: t("seconds") }
                            ].map((time, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="bg-white text-black w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-2xl font-semibold shadow-lg">
                                        {time.val}
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-2 uppercase font-semibold tracking-tighter">
                                        {time.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        className="w-fit h-12 px-10"
                    >
                        {t("shopNow")}
                    </Button>
                </div>
            </section> */}

            {/* 2. App Download Section */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="w-full md:w-1/2 hidden sm:flex justify-end">
                        <div className="relative w-64 h-[350px]">
                            <Image
                                src="/mobe.jpg"
                                alt="App Mockup"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 text-center md:text-left rtl:md:text-right">
                        <h3 className="text-3xl font-semibold text-gray-900 leading-tight">
                            {t("downloadAppTitle")}
                        </h3>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-7 justify-start">

                            {/* Google Play Button */}
                            <div className="flex items-center gap-4 bg-black px-6 py-3 rounded-2xl border border-gray-200 shadow-sm cursor-pointer w-full sm:w-auto">
                                <FaGooglePlay className="w-6 h-6 text-white" />
                                <div className="flex flex-col items-start rtl:items-end leading-none">
                                    <span className="text-[10px] uppercase text-gray-400 font-semibold">{t("getItOn")}</span>
                                    <span className="text-lg font-semibold text-white">Google Play</span>
                                </div>
                            </div>

                            {/* App Store Button */}
                            <div className="flex items-center gap-4 bg-black px-6 py-3 rounded-2xl border border-gray-200 shadow-sm cursor-pointer w-full sm:w-auto">
                                <FaApple className="w-8 h-8 text-white" />
                                <div className="flex flex-col items-start rtl:items-end leading-none">
                                    <span className="text-[10px] uppercase text-gray-400 font-semibold">{t("downloadOn")}</span>
                                    <span className="text-lg font-semibold text-white">App Store</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 italic mt-4">
                            {t("appAvailability")}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}