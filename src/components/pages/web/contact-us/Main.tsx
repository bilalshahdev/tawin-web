"use client"

import { MapPin, Phone, Mail, Truck, ShieldCheck, Lock, Headphones } from "lucide-react"
import ContactForm from "@/components/form/ContactForm"
import { useTranslations } from "next-intl"
import Link from "next/link"
import Image from "@/components/MyImage"
import { useSettings } from "@/hooks/useSettings"
import { useLocale } from "next-intl"
import HtmlContent from "@/components/common/HtmlContent"

export default function ContactUs() {
  const t = useTranslations("translation");
  const locale = useLocale();

  const { data: settings, isLoading } = useSettings();

  return (
    <div className="w-full bg-white font-sans text-gray-800 space-y-10 pt-10">
      <section className="max-w-7xl mx-auto px-2 sm:px-6 text-center ltr:md:text-left rtl:md:text-right">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight text-gray-900">
              {t("contactHeroTitle")}
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
              {t("contactHeroDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* 2. About Us Image Section */}
      <section className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex flex-col md:flex-row items-stretch bg-gray-100 overflow-hidden">
          <div className="relative w-full md:w-1/2 min-h-[400px]">
            <Image
              src="/about-us.png"
              alt="Construction Site"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-6 sm:p-12 flex flex-col justify-center space-y-6">
            {isLoading ? (
              <>
                <div className="animate-pulse bg-gray-200 rounded h-12 w-1/3" />
                <div className="space-y-2">
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-5/6" />
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-4/6" />
                </div>
                <div className="animate-pulse bg-gray-200 rounded h-4 w-24" />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-semibold">{t("aboutUs")}</h2>
                <HtmlContent content={settings?.pages?.about?.[locale]} />
                <Link
                  href="/shop"
                  className="text-sm font-semibold border-b-2 border-black w-fit pb-1 hover:text-gray-600 transition-colors">
                  {t("shopNow")} &rarr;
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-2 sm:px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">{t("contact")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <MapPin className="w-8 h-8 mx-auto mb-4" />,
              title: t("address"),
              content: "baghdadKarrada"
            },
            {
              icon: <Phone className="w-8 h-8 mx-auto mb-4" />,
              title: t("phone"),
              content: "+964 234 567 890"
            },
            {
              icon: <Mail className="w-8 h-8 mx-auto mb-4" />,
              title: t("email"),
              content: "ta3wan@gmail.com"
            },
          ].map((card, i) => (
            <div key={i} className="bg-gray-100 p-10 border border-gray-100">
              {card.icon}
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">
                {card.title}
              </h4>
              <p className="font-semibold" dir="ltr">
                {card.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <ContactForm />
      </section>

      {/* 5. Features Footer Bar */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Truck className="w-8 h-8 mx-auto mb-4" />, key: "shipping" },
              { icon: <ShieldCheck className="w-8 h-8 mx-auto mb-4" />, key: "guarantee" },
              { icon: <Lock className="w-8 h-8 mx-auto mb-4" />, key: "payment" },
              { icon: <Headphones className="w-8 h-8 mx-auto mb-4" />, key: "support" },
            ].map((feature, i) => (
              <div key={i} className="space-y-1">
                {feature.icon}
                <h4 className="font-semibold text-sm md:text-base">
                  {t(`${feature.key}Label`)}
                </h4>
                <p className="text-[10px] md:text-xs text-gray-400">
                  {t(`${feature.key}Sub`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}