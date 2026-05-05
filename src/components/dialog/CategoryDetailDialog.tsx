"use client";

import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import MyImage from "../MyImage";
import { Category } from "@/types/category";

interface CategoryDetailDialogProps {
  category: Category | null;
  open: boolean;
  onClose: () => void;
}

const CategoryDetailDialog = ({ category, open, onClose }: CategoryDetailDialogProps) => {
  const t = useTranslations("translation");
  const locale = useLocale() as "en" | "ar";

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {t("categoryDetails")}
          </DialogTitle>
        </DialogHeader>

        {/* Icon Section - Simple centered view */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-50 overflow-hidden border flex items-center justify-center p-2">
            <MyImage
              src={category?.thumbnail}
              alt="category icon"
              width={256}
              height={256}
              className="object-contain"
            />
          </div>
        </div>

        {/* Data Section */}
        <div className="space-y-6">
          <div className="space-y-1">
            <Label>
              {t("categoryName")}
            </Label>
            <p className="text-sm">
              {category.name[locale]}
            </p>
          </div>

          <div className="space-y-1">
            <Label>
              {t("description")}
            </Label>
            <p className="text-sm">
              {category.description[locale]}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetailDialog;