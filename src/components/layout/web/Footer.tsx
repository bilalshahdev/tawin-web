"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useSettings } from "@/hooks/useSettings";
import { getLocalizedText } from "@/utils/getLocalizedText";

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("translation");
  const locale = useLocale();
  const pathname = usePathname();

  const { data: settings } = useSettings();

  const isHome = pathname === "/" || pathname === "/en" || pathname === "/ar";

  const whatsappNumber = settings?.socialLinks?.whatsapp;
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#";

  if (isHome) {
    return (
      <footer className="bg-white text-[#2D3E50] py-6">
        <div>
          <div className="flex flex-col md:flex-row md:justify-between items-start gap-12 mb-16 mx-auto max-w-7xl px-4 md:px-12">
            {/* 1. Brand Section */}
            <div className="space-y-4 md:w-1/3">
              <h2 className="text-base font-bold text-[#2D3E50]">
                {getLocalizedText(settings?.businessName, locale)}
              </h2>
              <p className="text-[13px] text-gray-500 max-w-xs leading-relaxed">
                {getLocalizedText(settings?.tagline, locale)}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href={settings?.socialLinks?.youtube || "#"}
                  className="text-[#00C1C1] hover:opacity-80 transition-opacity"
                >
                  <Youtube size={20} />
                </Link>
                <Link
                  href={settings?.socialLinks?.facebook || "#"}
                  className="text-[#00C1C1] hover:opacity-80 transition-opacity"
                >
                  <Facebook size={20} />
                </Link>
                <Link
                  href={settings?.socialLinks?.instagram || "#"}
                  className="text-[#00C1C1] hover:opacity-80 transition-opacity"
                >
                  <Instagram size={20} />
                </Link>
                <Link
                  href={whatsappLink}
                  target="_blank"
                  className="text-[#00C1C1] hover:opacity-80 transition-opacity"
                >
                  <WhatsAppIcon size={20} />
                </Link>
              </div>
            </div>

            {/* Right Side Container */}
            <div className="flex flex-row gap-20 md:gap-32">
              {/* 2. Address Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#2D3E50]">
                  {t("addressTitle")}
                </h3>
                <ul className="space-y-2 text-[13px] text-gray-500">
                  <li>{t("city")}</li>
                  <li>{t("district")}</li>
                  <li>{t("country")}</li>
                  <li className="pt-2">
                    <a
                      href="mailto:info@ta3awin.com"
                      className="text-[#2D3E50] underline underline-offset-4 font-medium"
                    >
                      info@ta3awin.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* 3. Pages Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#2D3E50]">
                  {t("pagesTitle")}
                </h3>
                <ul className="space-y-3 text-[13px] text-gray-500">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-[#00C1C1] transition-colors"
                    >
                      {t("home")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="hover:text-[#00C1C1] transition-colors"
                    >
                      {t("shop")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-[#00C1C1] transition-colors"
                    >
                      {t("contact")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-gray-200" />

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-[11px] text-gray-400 mx-auto max-w-7xl px-8">
            <p className="text-gray-800">{t("copyrightText")}</p>
            <span className="hidden md:block h-3 w-px bg-gray-300" />
            <div className="flex items-center gap-4">
              <Link
                href="/privacyPolicy"
                className="hover:underline transition-all"
              >
                {t("privacyPolicy")}
              </Link>
              <Link
                href="/termsAndConditions"
                className="hover:underline transition-all"
              >
                {t("termsAndConditions")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-white">
              {getLocalizedText(settings?.businessName, locale)}
            </span>
            <div className="h-5 w-px bg-white/30" />
            <span className="text-sm font-medium text-white">
              {getLocalizedText(settings?.tagline, locale)}
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-6 md:gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {t("home")}
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {t("contact")}
            </Link>
            <Link
              href="/shop"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {t("shop")}
            </Link>
          </nav>
        </div>
      </div>
      <Separator className="bg-white/10" />
      <div className="mx-auto max-w-7xl px-8 py-6">
        <div className="flex flex-col-reverse items-start justify-between gap-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/50">{t("copyrightText")}</p>
          <div className="flex items-center gap-6">
            <Link
              href={settings?.socialLinks?.instagram || "#"}
              className="hover:opacity-80 transition-opacity"
            >
              <Instagram className="h-4 w-4" />
            </Link>
            <Link
              href={settings?.socialLinks?.facebook || "#"}
              className="hover:opacity-80 transition-opacity"
            >
              <Facebook className="h-4 w-4" />
            </Link>
            <Link
              href={settings?.socialLinks?.youtube || "#"}
              className="hover:opacity-80 transition-opacity"
            >
              <Youtube className="h-4 w-4" />
            </Link>
            <Link
              href={whatsappLink}
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <WhatsAppIcon size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
