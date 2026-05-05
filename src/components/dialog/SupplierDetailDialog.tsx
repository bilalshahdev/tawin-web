"use client";

import { cn } from "@/lib/utils";
import { Copy, Phone, MapPin, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function SupplierDetailDialog({
  supplier,
  open,
  onClose,
}: {
  supplier: any;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("translation");

  if (!supplier) return null;

  const isActive = supplier.isActive;
  const formattedDate = supplier.createdAt
    ? new Date(supplier.createdAt).toLocaleDateString()
    : "N/A";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm rounded-2xl overflow-hidden border border-gray-100 shadow-xl"
      >
        {/* Header */}
        <DialogHeader className="relative">
          <DialogTitle>
            {supplier.name}
          </DialogTitle>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-gray-400 truncate max-w-[200px]">{supplier.email}</span>
            <button
              onClick={() => handleCopy(supplier.email)}
              className="text-purple-500 hover:text-aqua transition-colors"
            >
              <Copy size={12} />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Supplier Info Section */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2">
              {t("supplierInfo")}
            </p>
            <div className="space-y-2">
              {/* Phone */}
              <div className="flex items-center gap-3 border border-gray-50 bg-gray-50/30 rounded-lg py-2.5">
                <Phone size={14} className="text-gray-400" />
                <span className="text-sm text-gray-700 font-medium">
                  {supplier.phone}
                </span>
              </div>

              {/* Address */}
              <div className="flex items-center gap-3 border border-gray-50 bg-gray-50/30 rounded-lg py-2.5">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-sm text-gray-700 font-medium line-clamp-1">
                  {supplier.address}
                </span>
              </div>

              {/* Code */}
              <div className="flex items-center gap-3 border border-gray-50 bg-gray-50/30 rounded-lg py-2.5">
                <Hash size={14} className="text-gray-400" />
                <span className="text-sm text-gray-700 font-medium">
                  {supplier.code}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{t("status")}:</span>
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  isActive ? "bg-aqua/10 text-aqua" : "bg-red-50 text-red-500"
                )}
              >
                {isActive ? t("active") : t("inactive")}
              </span>
            </div>
          </div>

          {/* Sales Summary (If data exists in API) */}
          {supplier.salesSummary && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                {t("salesSummary")}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="border border-gray-100 rounded-xl py-2 px-1">
                  <p className="text-base font-bold text-gray-800">{supplier.salesSummary.total || 0}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t("total")}</p>
                </div>
                <div className="border border-gray-100 rounded-xl py-2 px-1">
                  <p className="text-base font-bold text-gray-800">{supplier.salesSummary.completed || 0}</p>
                  <p className="text-[10px] text-aqua font-medium mt-0.5">{t("done")}</p>
                </div>
                <div className="border border-gray-100 rounded-xl py-2 px-1">
                  <p className="text-base font-bold text-gray-800">{supplier.salesSummary.cancelled || 0}</p>
                  <p className="text-[10px] text-red-400 mt-0.5">{t("void")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg h-10 text-sm font-medium"
            >
              {t("close")}
            </Button>
            <Button
              variant="primary"
              className={cn(
                "rounded-lg h-10 text-sm font-medium transition-all",
                isActive
                  ? "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100"
                  : "bg-aqua text-white hover:bg-aqua/90"
              )}
            >
              {isActive ? t("deactivate") : t("activate")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}