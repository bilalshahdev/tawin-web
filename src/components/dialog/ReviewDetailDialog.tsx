"use client";

import { cn } from "@/lib/utils";
import { Star, Hash, Package, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ReviewDetailDialog({
  review,
  open,
  onClose,
}: {
  review: any;
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("translation");

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
        {/* Header */}
        <DialogHeader className="border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-800">
            {t("reviewDetails")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Code */}
          <div className="flex items-center gap-3">
            <Hash className="text-gray-400" size={16} />
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">{t("productCode")}</span>
              <span className="text-sm font-medium text-gray-800">
                #{review._id?.slice(-6) || "N/A"}
              </span>
            </div>
          </div>

          {/* Product */}
          <div className="flex items-center gap-3">
            <Package className="text-gray-400" size={16} />
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">{t("product")}</span>
              <span className="text-sm font-medium text-gray-800">
                {review.product
                  ? review.product.title?.[locale] || review.product.title?.en
                  : "—"
                }
              </span>
            </div>
          </div>

          {/* User Name */}
          <div className="flex items-center gap-3">
            <User className="text-gray-400" size={16} />
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">{t("userName")}</span>
              <span className="text-sm font-medium text-gray-800">
                {review.user?.firstName} {review.user?.lastName}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <Star className="text-gray-400" size={16} />
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">{t("rating")}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{review.rating}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={cn(
                        i < review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" size={16} />
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">{t("date")}</span>
              <span className="text-sm font-medium text-gray-800">
                {new Date(review.createdAt?.$date || review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <span className="text-xs text-gray-500 block mb-2">{t("comment")}</span>
            <div className="border border-gray-100 rounded-lg px-4 py-3 bg-gray-50">
              <p className="text-sm text-gray-700 leading-relaxed">
                {review.comment || "No comment provided"}
              </p>
            </div>
          </div>

          {/* Actions */}
          {/* <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-md h-10 font-medium"
            >
              {t("deleteReview")}
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}