"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Image from "@/components/MyImage";
import { usePromotionalCoupons } from "@/hooks/useCoupon";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";

export default function PromotionSection() {
  const t = useTranslations("translation");

  const { data: couponResponse, isLoading } = usePromotionalCoupons();

  const showPromoSection = !isLoading && couponResponse?.data;

  const storeButtons = useMemo(
    () => [
      {
        icon: <FaGooglePlay className="w-6 h-6 text-white" />,
        label: t("getItOn"),
        title: t("googlePlay"),
      },
      {
        icon: <FaApple className="w-8 h-8 text-white" />,
        label: t("downloadOn"),
        title: t("appStore"),
      },
    ],
    [t],
  );

  const renderTitle = () => {
    if (!couponResponse?.data) return "";

    const { appliesTo, value, type } = couponResponse.data;

    const discountLabel = type === "percentage" ? `${value}%` : `$${value}`;

    switch (appliesTo) {
      case "all":
        return t("discountAllItems", {
          discount: discountLabel,
        });

      case "product":
      case "products":
        return t("discountProducts", {
          discount: discountLabel,
        });

      case "category":
      case "categories":
        return t("discountCategories", {
          discount: discountLabel,
        });

      default:
        return t("discountLimited", {
          discount: discountLabel,
        });
    }
  };

  const renderSubtitle = () => {
    if (!couponResponse?.data) {
      return t("offerSubtitle") || "";
    }

    const { appliesTo, value, type } = couponResponse.data;

    const discountLabel = type === "percentage" ? `${value}%` : `$${value}`;

    switch (appliesTo) {
      case "all":
        return t("subtitleAllItems", {
          discount: discountLabel,
        });

      case "product":
      case "products":
        return t("subtitleProducts", {
          discount: discountLabel,
        });

      case "category":
      case "categories":
        return t("subtitleCategories", {
          discount: discountLabel,
        });

      default:
        return t("subtitleLimited", {
          discount: discountLabel,
        });
    }
  };

  const path = "/shop";

  return (
    <div className="w-full overflow-hidden">
      {/* Promo Section */}
      {showPromoSection && (
        <section className="flex flex-col lg:flex-row min-h-125">
          <div className="w-full lg:w-1/2 relative min-h-125">
            <Image
              src={couponResponse.data.thumbnail || "/promotion.png"}
              alt="Living Room Decoration"
              fill
              className="object-cover"
            />
          </div>

          <div className="w-full lg:w-1/2 bg-[#141718] flex flex-col justify-center p-8 md:p-16 lg:p-24 space-y-4 text-left rtl:text-right">
            <span className="text-aqua font-semibold text-sm uppercase tracking-wider">
              {t("limitedOffers")} (
              {couponResponse.data.type === "percentage"
                ? `${couponResponse.data.value}%`
                : `$${couponResponse.data.value}`}{" "}
              {t("off") || "OFF"})
            </span>

            <h2 className="text-4xl font-semibold text-white leading-tight capitalize">
              {renderTitle()} ({couponResponse.data.code})
            </h2>

            <p className="text-gray-400 text-sm md:text-base">
              {renderSubtitle()}
            </p>

            {/* Optimized Countdown */}
            <CountdownTimer expiryDate={couponResponse.data.expiryDate} />

            <Link href={path}>
              <Button variant="primary" className="w-fit h-12 px-10">
                {t("shopNow")}
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* App Download Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 hidden sm:flex justify-end">
            <div className="relative w-64 h-87.5">
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
              {storeButtons.map((store, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-black px-6 py-3 rounded-2xl border border-gray-200 shadow-sm cursor-pointer w-full sm:w-auto"
                >
                  {store.icon}

                  <div className="flex flex-col items-start rtl:items-end leading-none">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold">
                      {store.label}
                    </span>

                    <span className="text-lg font-semibold text-white">
                      {store.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-400 italic mt-4">
              {t("appAvailability")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
