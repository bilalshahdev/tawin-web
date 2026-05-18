"use client"

import { Button } from "@/components/ui/button"
import StarRating from "@/components/StarRating"
import { useLocale, useTranslations } from "next-intl"
import Image from "@/components/MyImage"
import { Product } from "@/types/product"
import { LoginDialog } from "@/components/dialog/LoginDialog"
import { InactiveProfileDialog } from "@/components/dialog/InactiveProfileDialog" // Added import
import { useUserProfile } from "@/hooks/useAuth" // Added import
import { useState } from "react"

export function ReviewHeader({
  product
}: { product: Product }) {
  const t = useTranslations("translation");
  const locale = useLocale() as "en" | "ar";

  return (
    <div className="flex flex-col items-start space-y-1">
      <span className="text-sm text-gray-500">{t("customerExperience")}</span>
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <StarRating />
        <span className="text-sm font-bold text-gray-900">{product.reviewCount} {t("reviewsCount")}</span>
      </div>
      <span className="text-sm text-gray-500 font-medium">{product.title?.[locale]}</span>
    </div>
  )
}

export function WriteReviewButton({ onClick }: { onClick?: () => void }) {
  const t = useTranslations("translation");
  const [loginOpen, setLoginOpen] = useState(false);
  const [inactiveOpen, setInactiveOpen] = useState(false); // Added visibility state

  // User Profile Hook to verify status
  const { data: userProfile } = useUserProfile();
  const isVerified = userProfile?.data?.isVerified ?? false;

  const handleClick = () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoginOpen(true); return; }
    
    // Check if user account is inactive/unverified
    if (!isVerified) { setInactiveOpen(true); return; }

    onClick?.();
  };

  return (
    <>
      <div className="w-full border border-gray-200 rounded-2xl p-8 flex items-center shadow-sm">
        <Button
          onClick={handleClick}
          className="bg-black text-white px-10 hover:bg-gray-800 border-0 rounded-full"
          size="sm"
        >
          {t("writeReview")}
        </Button>
      </div>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <InactiveProfileDialog open={inactiveOpen} onOpenChange={setInactiveOpen} />
    </>
  )
}

export function ReviewCard({ review }: { review: any }) {

  const reviewerName = `${review.user?.firstName || ""} ${review.user?.lastName || ""}`;
  const reviewerComment = review.comment;

  return (
    <div className="flex flex-col items-start group">
      <div className="flex items-center space-x-4 mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
          <Image
            src={review.user?.avatar}
            alt={reviewerName}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900">{reviewerName}</h4>
          <StarRating rating={review.rating} />
        </div>
      </div>
      <p className="text-gray-600 text-[15px] leading-relaxed max-w-4xl capitalize">
        {reviewerComment}
      </p>
      <span className="text-xs text-gray-400 mt-2 font-medium italic">
        {new Date(review.createdAt).toLocaleDateString()}
      </span>
    </div>
  )
}