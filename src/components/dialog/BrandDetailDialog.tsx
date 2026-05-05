"use client";

import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MyImage from "../MyImage";

export default function BrandDetailDialog({
  brand,
  open,
  onClose,
}: {
  brand: any;
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("translation");

  if (!brand) return null;

  const isActive = brand.isActive;
  const displayName = brand.name[locale] || brand.name['en'];
  const displayDesc = brand.description[locale] || brand.description['en'];
  const regDate = new Date(brand.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden relative">
              {brand.image ? (
                <MyImage
                  src={brand.image}
                  alt={displayName}
                  width={256}
                  height={256}
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  {displayName.charAt(0)}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-gray-800 leading-snug">
                {displayName}
              </DialogTitle>
              {/* <div className="flex items-center gap-1.5 mt-0.5">
                <Globe size={11} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-400 truncate">
                  {`www.${brand.slug}.com`}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(`www.${brand.slug}.com`)}
                  className="text-purple-500 hover:text-aqua transition-colors shrink-0"
                >
                  <Copy size={12} />
                </button>
              </div> */}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Detail Rows */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-500 shrink-0">{t("status")}:</span>
              <span className={cn("text-sm font-semibold", isActive ? "text-aqua" : "text-red-500")}>
                {isActive ? t("active") : t("closed")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-500 shrink-0">{t("registrationDate")}:</span>
              <span className="text-sm font-medium text-gray-700">{regDate}</span>
            </div>
            {displayDesc && (
               <div className="space-y-1">
                 <span className="text-sm text-gray-500">{t("description")}:</span>
                 <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md italic">
                    {displayDesc}
                 </p>
               </div>
            )}
          </div>

          {/* Action Buttons */}
          {/* <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              variant="outline"
              className="border-red-200 bg-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md h-10 font-medium"
            >
              {t("block")}
            </Button>
            <Button
              variant="primary"
              className="bg-amber-50 border border-amber-400 hover:bg-amber-100 text-amber-500 rounded-md h-10 font-medium"
            >
              {t("suspend")}
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}