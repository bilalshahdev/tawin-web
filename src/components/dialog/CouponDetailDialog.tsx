"use client";

import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CouponDetailDialog({
  coupon,
  open,
  onClose,
  currencySymbol,
}: {
  coupon: any;
  open: boolean;
  onClose: () => void;
  currencySymbol: string;
}) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("translation");

  if (!coupon) return null;

  const isActive = coupon.isActive;

  // Resolve "Applies To" label
  const appliesToLabel =
    coupon.appliesTo === "category"
      ? t("category")
      : coupon.appliesTo === "product"
      ? t("product")
      : t("all");

  // Resolve category names (handles both populated objects & plain IDs)
  const categoryNames: string[] =
    Array.isArray(coupon.categories) && coupon.categories.length > 0
      ? coupon.categories.map((c: any) =>
          typeof c === "string" ? c : c?.name?.[locale] || c?.name?.en || c?.slug || c?._id || "-"
        )
      : [];

  // Resolve product names (handles both populated objects & plain IDs)
  const productNames: string[] =
    Array.isArray(coupon.products) && coupon.products.length > 0
      ? coupon.products.map((p: any) =>
          typeof p === "string" ? p : p?.title?.[locale] || p?.title?.en || p?.slug || p?._id || "-"
        )
      : [];

  const rows = [
    {
      label: t("status"),
      value: isActive ? t("active") : t("cancelled"),
      valueClass: isActive
        ? "text-aqua font-semibold"
        : "text-red-500 font-semibold",
    },
    { label: t("couponCode"), value: coupon.code },
    { label: t("type"), value: coupon.type || "-" },
    {
      label: t("discountRate"),
      value:
        coupon.type === "percentage"
          ? `${coupon.value}%`
          : `${currencySymbol}${coupon.value}`,
    },
    {
      label: t("minOrder"),
      value: `${currencySymbol}${coupon.minOrderAmount || 0}`,
    },
    {
      label: t("usageLimit"),
      value: `${coupon.usedCount || 0} / ${coupon.usageLimit || 0}`,
    },
    {
      label: t("expiryDate"),
      value: coupon.expiryDate
        ? new Date(coupon.expiryDate).toLocaleDateString(
            locale === "ar" ? "ar-EG" : "en-GB"
          )
        : "-",
    },
    { label: t("appliesTo"), value: appliesToLabel },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-800">
            {t("couponDetails")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Detail Rows */}
          <div className="space-y-2">
            {rows.map(({ label, value, valueClass }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-sm text-gray-500 shrink-0">{label}:</span>
                <span
                  className={cn(
                    "text-sm font-medium text-gray-700 capitalize",
                    valueClass
                  )}
                >
                  {value}
                </span>
              </div>
            ))}

            {/* Categories chips — show whenever categories exist */}
            {categoryNames.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-sm text-gray-500 shrink-0">
                  {t("selectCategories")}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {categoryNames.map((name, idx) => (
                    <span
                      key={`cat-${name}-${idx}`}
                      className="inline-flex items-center bg-[#004d40]/10 text-[#004d40] text-xs font-medium rounded-full px-3 py-1"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Products chips — show whenever products exist */}
            {productNames.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-sm text-gray-500 shrink-0">
                  {t("selectProducts")}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {productNames.map((name, idx) => (
                    <span
                      key={`prod-${name}-${idx}`}
                      className="inline-flex items-center bg-[#004d40]/10 text-[#004d40] text-xs font-medium rounded-full px-3 py-1"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}