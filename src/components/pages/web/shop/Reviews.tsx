"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WriteReviewButton, ReviewCard } from "./ReviewComponents"
import { useLocale, useTranslations } from "next-intl"
import { SpinnerLoader } from "@/components/common/SpinnerLoader"
import WriteReviewDialog from "@/components/dialog/WriteReviewDialog"
import { getLocalizedText } from "@/utils/getLocalizedText"

export default function Reviews({ product, reviews, isReviewsLoading }: {
  product: any,
  reviews: any[],
  isReviewsLoading: boolean
}) {
  const t = useTranslations("translation");
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState("reviews")
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false)

  // No hook here, just use props directly
  const tabs = [
    { key: "reviews", label: t("reviewsTab") },
    { key: "product_info", label: t("productInfoTab") }
  ]

  return (
    <div className="text-gray-800 bg-white">
      <div className="flex justify-start space-x-12 border-b border-gray-200 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-medium transition-all ${activeTab === tab.key
              ? "border-b-2 border-black text-black"
              : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "reviews" && (
        <div className="space-y-8">
          <WriteReviewButton onClick={() => setIsWriteDialogOpen(true)} />

          <WriteReviewDialog
            open={isWriteDialogOpen}
            onOpenChange={setIsWriteDialogOpen}
            productId={product._id}
          />

          <div className="flex justify-between items-center pt-2">
            <Select>
              <SelectTrigger className="h-9 w-54 rounded-md border border-border bg-background text-sm text-foreground shadow-none focus:ring-0">
                <SelectValue placeholder={t("latest")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("latest")}</SelectItem>
                <SelectItem value="interior">{t("oldest")}</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-400 font-medium">{reviews.length} {t("comments")}</span>
          </div>

          <div className="space-y-10 pt-4">
            {isReviewsLoading ? (
              <div className="py-10 flex justify-center"><SpinnerLoader /></div>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-400 py-10">{t("noReviews") ?? "No reviews yet."}</p>
            ) : (
              reviews.map((review: any) => (
                <ReviewCard key={review._id} review={review} />
              ))
            )}
          </div>

          {reviews.length > 5 && (
            <div className="flex items-center justify-center">
              <Button
                className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-10 rounded-full"
                size="sm"
              >
                {t("more")}
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === "product_info" && (
        <div className="text-gray-600 text-[15px] leading-relaxed">
          {getLocalizedText(product?.description, locale) ?? "No description available."}
        </div>
      )}
    </div>
  )
}