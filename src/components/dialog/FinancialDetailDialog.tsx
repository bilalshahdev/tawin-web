"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FinancialDetailDialog({
  transaction,
  open,
  onClose,
  currencySymbol,
}: {
  transaction: any;
  open: boolean;
  onClose: () => void;
  currencySymbol: string;
}) {
  const t = useTranslations("translation");

  if (!transaction) return null;

  const statusColorMap: Record<string, string> = {
    completed: "text-aqua",
    cancelled: "text-red-500",
    pending: "text-amber-500",
    processing: "text-blue-500",
    delivered: "text-green-500",
  };

  const formattedDate = new Date(transaction.createdAt).toLocaleDateString();

  const rows = [
    {
      label: t("transferId"),
      value: `#${transaction._id?.slice(-6).toUpperCase()}`,
    },
    {
      label: t("status"),
      value: transaction.status,
      valueClass: statusColorMap[transaction.status] ?? "text-gray-700",
    },
    {
      label: t("user"),
      value: transaction.user?.email,
    },
    {
      label: t("date"),
      value: formattedDate,
    },
    {
      label: t("total"),
      value: `${currencySymbol}${transaction.totalAmount}`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-800">
            {t("transactionDetails")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Detail Rows */}
          <div className="space-y-2">
            {rows.map(({ label, value, valueClass }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-sm text-gray-500 shrink-0">{label}:</span>
                <span className={cn("text-sm font-medium capitalize", valueClass ?? "text-gray-700")}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {/* <div className="grid grid-cols-2 gap-3 pt-2 max-w-sm mx-auto">
            <Button
              variant="outline"
              className="border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-md h-10 font-medium"
            >
              {t("cancelTransaction")}
            </Button>
            <Button
              variant="primary"
              className="bg-amber-50 border border-amber-400 hover:bg-amber-400/20 text-amber-500 rounded-md h-10 font-medium"
            >
              {t("suspendTemporarily")}
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}