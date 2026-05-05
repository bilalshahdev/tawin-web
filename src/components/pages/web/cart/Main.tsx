"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Step1 from "@/components/pages/web/cart/Step1"
import Step2 from "@/components/pages/web/cart/Step2"
import { useTranslations } from "next-intl"
import { useSettings } from "@/hooks/useSettings"

const steps = [
    { id: "1", label: "Cart" },
    { id: "2", label: "Checkout" },
]

export default function Cart() {
    const t = useTranslations("translation");
    const router = useRouter()
    const searchParams = useSearchParams();

    const { data: settingData } = useSettings();

    const currentStep = searchParams.get("step") || "1"

    const setStep = (step: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("step", step)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 font-sans text-gray-800">
            <h1 className="text-3xl font-semibold text-center mb-12">
                {t(`cartStep${currentStep}`)}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-8 md:mb-16 px-4">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        onClick={() => setStep(step.id)}
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer relative pb-2"
                    >
                        {/* Circle Number */}
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm transition-colors shrink-0 ${currentStep === step.id ? "bg-aqua" : "bg-gray-300"}`}>
                            {step.id}
                        </div>

                        {/* Label */}
                        <span className={`text-xs md:text-sm font-medium whitespace-nowrap ${currentStep === step.id ? "text-black" : "text-gray-400"}`}>
                            {t(`cartStep${step.id}`)}
                        </span>

                        {/* Underline Indicator - Adjusted for mobile */}
                        {currentStep === step.id && (
                            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-aqua" />
                        )}
                    </div>
                ))}
            </div>

            {currentStep === "1" ? (
                <Step1 currencySymbol={settingData?.currencySymbol || "$"} />
            ) : (
                <Step2 currencySymbol={settingData?.currencySymbol || "$"} />
            )}
        </div>
    )
}