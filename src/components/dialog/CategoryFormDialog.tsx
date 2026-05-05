"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultilingualInput } from "../form/MultilingualInput";
import { useCreateCategory, useUpdateCategory, useGetCategories } from "@/hooks/useCategories";
import { Category } from "@/types/category";
import { ImagePlus } from "lucide-react";
import MyImage from "../MyImage";
import { ca } from "zod/v4/locales";

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  category?: any;
}

const CategoryFormDialog = ({ open, onClose, category }: CategoryFormDialogProps) => {
  const t = useTranslations("translation");
  const locale = useLocale() as "en" | "ar";
  const isEdit = !!category;

  const { data: categoriesData } = useGetCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  // State to hold the preview URL
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  const methods = useForm({
    defaultValues: {
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      parentCategory: "none",
      type: "category",
    },
  });

  const { reset, handleSubmit, setValue, watch } = methods;
  const selectedType = watch("type");
  const currentParent = watch("parentCategory");

  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: { en: category.name?.en || "", ar: category.name?.ar || "" },
          description: { en: category.description?.en || "", ar: category.description?.ar || "" },
          parentCategory: category.parentCategory?._id || "none",
          type: category.type || "category",
        });
        setThumbPreview(category.thumbnail || null);
      } else {
        reset({
          name: { en: "", ar: "" },
          description: { en: "", ar: "" },
          parentCategory: "none",
          type: "category",
        });
        setThumbPreview(null);
      }
    }
  }, [category, open, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a temporary object URL which is more reliable for previews than base64
      const objectUrl = URL.createObjectURL(file);
      setThumbPreview(objectUrl);
      
      // Cleanup memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const onSubmit = async (values: any) => {
    const data = new FormData();
    data.append("name[en]", values.name.en);
    data.append("name[ar]", values.name.ar);
    data.append("description[en]", values.description.en);
    data.append("description[ar]", values.description.ar);
    data.append("type", values.type);

    if (values.type === "subCategory" && values.parentCategory !== "none") {
      data.append("parentCategory", values.parentCategory);
    }

    const thumbFile = (document.getElementById("thumbnail-input") as HTMLInputElement)?.files?.[0];
    if (thumbFile) data.append("thumbnail", thumbFile);

    if (isEdit && category?._id) {
      updateMutation.mutate(
        { id: category._id, formData: data },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(
        data,
        { onSuccess: () => onClose() }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-700">
            {isEdit ? t("editCategory") : t("addNewCategory")}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">

            {/* Show all fields for create mode, only name and thumbnail for edit mode */}
            {!isEdit && (
              <>
                <div className="space-y-2">
                  <Label>{t("type")}</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(v) => {
                      setValue("type", v);
                      if (v === "category") setValue("parentCategory", "none");
                    }}
                  >
                    <SelectTrigger className="rounded-md h-10 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category">{t("category")}</SelectItem>
                      <SelectItem value="subCategory">{t("subCategory")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedType === "subCategory" && (
                  <div className="space-y-2">
                    <Label>{t("parentCategory")}</Label>
                    <Select
                      value={currentParent}
                      onValueChange={(v) => setValue("parentCategory", v)}
                    >
                      <SelectTrigger className="rounded-md h-10 border-gray-200">
                        <SelectValue placeholder={t("selectParent")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t("selectParentCategory")}</SelectItem>
                        {categoriesData?.data?.filter((cat: Category) => cat._id !== category?._id).map((cat: Category) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name[locale]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            {/* Name field - always shown */}
            <MultilingualInput
              label={t("categoryName")}
              name="name"
              placeholderEn={t("placeholderNameEn")}
              placeholderAr={t("placeholderNameAr")}
            />

            <MultilingualInput
                  label={t("description")}
                  name="description"
                  type="textarea"
                  placeholderEn={t("placeholderDescEn")}
                  placeholderAr={t("placeholderDescAr")}
                />

            {/* Thumbnail field - always shown */}
            <div className="space-y-3 pt-2">
              <Label>{t("thumbnail")}</Label>
              <div className="relative group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl hover:border-aqua/50 transition-all bg-gray-50/50 overflow-hidden">
                {thumbPreview ? (
                  <MyImage
                    src={thumbPreview}
                    alt="Preview"
                    width={160}
                    height={160}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImagePlus size={32} strokeWidth={1.5} />
                    <span className="text-xs mt-2 font-medium">{t("uploadImage")}</span>
                    <span className="text-[10px] text-gray-300">PNG, JPG up to 5MB</span>
                  </div>
                )}
                <Input
                  id="thumbnail-input"
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="w-full rounded-full"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full rounded-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? t("saving")
                  : (isEdit ? t("update") : t("create"))
                }
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;