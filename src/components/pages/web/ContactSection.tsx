"use client"

import ContactForm from "@/components/form/ContactForm"
import { useTranslations } from "next-intl"

const ContactSection = () => {
  const t = useTranslations("translation")

  return (
    <div className="relative mb-10 lg:mb-70">

      <section className="pt-18 px-4 w-full bg-[#B6D7C4] space-y-10 pb-20 lg:pb-0 h-auto lg:h-[600px]">
        <div className="max-w-7xl mx-auto flex flex-col">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            {t("aboutUsTitle")}
          </h2>
          <p className="text-sm md:text-base text-gray-800 max-w-4xl leading-relaxed">
            {t("aboutUsDescription2")}
          </p>
        </div>
      </section>

      <div className="relative px-4 max-w-7xl mx-auto -mt-16 lg:mt-0 lg:absolute lg:top-48 lg:left-0 lg:right-0">
        <div className="max-w-7xl mx-auto">
          <ContactForm isHome={true} />
        </div>
      </div>
    </div>
  )
}

export default ContactSection