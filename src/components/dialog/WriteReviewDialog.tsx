"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCreateReview } from "@/hooks/useReviews"
import { cn } from "@/lib/utils"

export default function WriteReviewDialog({
  open,
  onOpenChange,
  productId
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  productId: string
}) {
  const t = useTranslations("translation");
  const { mutate: createReview, isPending } = useCreateReview();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0 || !comment.trim()) return;

    createReview({
      product: productId,
      rating,
      comment
    }, {
      onSuccess: () => {
        setRating(0);
        setComment("");
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-2">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">{t("writeReview")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Star Rating Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{t("yourRating")}</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={cn(
                      "transition-colors",
                      (hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{t("yourComment")}</Label>
            <Textarea
              placeholder={t("reviewPlaceholder")}
              className="min-h-[120px] rounded-xl border-gray-200 focus-visible:ring-aqua/40"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-gray-200"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              className="flex-1 bg-black text-white hover:bg-gray-800 rounded-full border-none"
              onClick={handleSubmit}
              disabled={isPending || rating === 0 || !comment.trim()}
            >
              {isPending ? t("submitting") : t("submit")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}