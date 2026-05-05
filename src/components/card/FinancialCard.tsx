"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export const FinancialCard = ({
  data,
  currencySymbol,
  isLoading = false,
}: {
  data?: any;
  currencySymbol?: string;
  isLoading?: boolean;
}) => {
  const t = useTranslations("translation");

  // --- 1:1 SKELETON LOADER ---
  if (isLoading) {
    return (
      <Card className="border shadow-none h-full">
        <CardContent>
          {/* Mirrors: flex justify-between items-center mb-2 > span(text-sm) + Button(h-8 w-8) */}
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-4 w-28" />   {/* paymentMethod label: text-sm */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* MoreVertical icon button */}
          </div>

          {/* Mirrors: grid grid-cols-1 md:grid-cols-2 gap-8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* LEFT COLUMN placeholder (empty in actual, keep space consistent) */}
            <div />

            {/* RIGHT COLUMN: Mirrors space-y-1 block + trend span */}
            <div className="flex flex-col justify-between">
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />   {/* cashOnDelivery: text-xs font-semibold */}
                <Skeleton className="h-3 w-16" />   {/* statusActive: text-xs text-aqua */}
                <div className="flex items-center gap-1 mt-1" /> {/* empty gap div */}
                <Skeleton className="h-8 w-48" />   {/* revenue h4: text-2xl font-bold */}
                <Skeleton className="h-3 w-10" />   {/* change % badge: text-xs */}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    );
  }

  // --- ACTUAL DATA DESIGN ---
  return (
    <Card className="border shadow-none h-full">
      <CardContent>
        {/* Header: Title Left, Menu Right */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400 font-medium">{t("paymentMethod")}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} />
          </Button>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT COLUMN: Card + Add Button */}


          {/* RIGHT COLUMN: Info + Deactivate Button */}
          <div className="flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold">{t("cashOnDelivery")}</p>
              <p className="text-aqua text-xs font-semibold">{t("statusActive")}</p>
              <div className="flex items-center gap-1 mt-1">
              </div>
              <h4 className="text-2xl font-bold text-gray-900 leading-tight">{t("revenue")}: {currencySymbol}{data?.revenue || 0}</h4>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${data?.change?.type === "increase" ? "text-green-500" : "text-red-500"}`}>
                {data?.change?.type === "increase"
                  ? <TrendingUp className="h-3 w-3" />
                  : <TrendingDown className="h-3 w-3" />
                }
                {data?.change?.percentage ?? 0}%
              </span>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};