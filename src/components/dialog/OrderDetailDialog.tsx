"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Image from "@/components/MyImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OrderDetailDialog({
  order,
  open,
  onClose,
  currencySymbol,
}: {
  order: any;
  open: boolean;
  onClose: () => void;
  currencySymbol: string;
}) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("translation");

  if (!order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleDateString();
  const isCOD = order.paymentMethod === "COD";

  const rows = [
    { label: t("orderId"), value: `#${order._id.slice(-6).toUpperCase()}` },
    { label: t("customer"), value: `${order.user?.firstName} ${order.user?.lastName}` },
    { label: t("phone"), value: order.phone },
    { label: t("date"), value: formattedDate },
    { label: t("totalPrice"), value: `${currencySymbol}${order.finalAmount}` },
    {
      label: t("payment"),
      value: order.paymentMethod,
      valueClass: isCOD ? "text-orange-500 font-semibold" : "text-aqua font-semibold",
    },
    {
      label: t("status"),
      value: order.status,
      valueClass: cn(
        "font-semibold capitalize",
        order.status === "pending" ? "text-orange-600" : "text-green-600"
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
        {/* Header */}
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-base font-bold text-gray-800">
            {t("orderDetails")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-4">
          {/* Product(s) Preview */}
          <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-hide pr-1">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2.5">
                <div className="h-10 w-10 relative overflow-hidden rounded-md shrink-0 bg-gray-50">
                  <Image
                    src={item.product?.photo || ""}
                    alt={item.product?.title?.[locale]}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    {item.product?.title?.[locale]}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t("qty")}: {item.quantity} × {currencySymbol}{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Rows */}
          <div className="space-y-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
            {rows.map(({ label, value, valueClass }) => (
              <div key={label} className="flex justify-between items-center gap-1.5">
                <span className="text-xs text-gray-500 shrink-0">{label}:</span>
                <span className={cn("text-xs font-medium text-gray-700 text-end", valueClass)}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-200 text-gray-500 hover:bg-gray-50 rounded-md h-10 font-medium"
            >
              {t("close")}
            </Button>
            <Button
              variant="primary"
              className="bg-aqua border border-aqua hover:bg-aqua/90 text-white rounded-md h-10 font-medium"
            >
              {t("trackOrder")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}