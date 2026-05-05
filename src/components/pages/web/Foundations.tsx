"use client"

import { useLocale, useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "@/components/MyImage"
import { foundations } from "@/constants/foundations"

const Foundations = () => {
    const locale = useLocale() as "en" | "ar";
    const t = useTranslations("translation");

    return (
        <section className="md:relative pt-24 md:mb-80">
            <div className="hidden md:block md:absolute md:-bottom-50 md:left-1/2 -translate-x-1/2 w-[1300px] md:h-[800px] overflow-hidden">
                <Image
                    src="/foundation-bg.png"
                    alt="Foundation Background"
                    fill
                    className="object-contain"
                />
            </div>

            <div className="hidden md:block md:absolute md:bottom-46 md:left-1/2 -translate-x-1/2 w-6 h-6 overflow-hidden">
                <Image
                    src="/drop_location.svg"
                    alt="location"
                    fill
                    className="object-contain"
                />
            </div>

            <div className="hidden md:block md:absolute md:-bottom-60 md:right-0 w-full md:w-full h-52 md:h-92">
                <Image
                    src="/truck-logo.png"
                    alt="Truck"
                    fill
                    className="object-contain object-bottom-right"
                    priority
                />
            </div>

            {/* Cards + title — always on top */}
            <div className="relative z-10 container mx-auto px-4 max-w-6xl">
                <h2 className="md:text-3xl text-2xl font-semibold text-center mb-12 text-gray-800">
                    {t("foundationsTitle")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch pb-24 md:pb-80">
                    {foundations.map((item, index) => (
                        <Card
                            key={item.id}
                            className="flex flex-col bg-white border border-slate-100 shadow-sm rounded-3xl py-16 px-4 transition-all hover:shadow-lg"
                        >
                            <CardHeader className="flex flex-col items-center justify-center text-center p-0">
                                <div className="flex items-center justify-center">
                                    <Image
                                        src={`/image${index + 1}.png`}
                                        alt={item.title[locale]}
                                        width={58}
                                        height={58}
                                        className="object-contain"
                                    />
                                </div>

                                <CardTitle className="text-xl md:text-2xl font-semibold text-gray-800 mt-8">
                                    {item.title[locale]}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="text-center flex-1 px-4 md:px-12">
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                    {item.description[locale]}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Foundations;