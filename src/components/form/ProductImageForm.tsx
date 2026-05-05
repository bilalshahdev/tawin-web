"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, RotateCcw, Image as ImageIcon, Check, X } from "lucide-react";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations, useLocale } from "next-intl";
import { useRef, useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useGetCategories } from "@/hooks/useCategories";
import { HexColorPicker } from "react-colorful";
import MyImage from "@/components/MyImage";
import { productFormSchema } from "@/validations/product";
import z from "zod";
import { ChevronDownIcon } from "lucide-react";

interface ProductImageFormProps {
  existingPhoto?: string;
  existingImages?: string[];
  isEdit?: boolean;
}

type ProductFormValues = z.infer<typeof productFormSchema>;

const ProductImageForm = ({ existingPhoto, existingImages = [], isEdit = false }: ProductImageFormProps) => {
  const t = useTranslations("translation");
  const locale = useLocale() as "en" | "ar";
  const { control, watch, setValue, formState: { errors } } = useFormContext<ProductFormValues>();

  const mainInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [pendingColor, setPendingColor] = useState("#6366f1");

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories();

  const photo = watch("photo");
  const images = watch("images") || [];
  const selectedCategory = watch("category");
  // const selectedColors: string[] = watch("colors") ?? [];

  useEffect(() => {
    if (isEdit) {
      if (existingPhoto && !photo) setValue("photo", existingPhoto);
      if (existingImages?.length > 0 && images.length === 0) setValue("images", existingImages);
    }
  }, [isEdit, existingPhoto, existingImages, setValue]);

  const categories = categoriesData?.data || [];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setValue("photo", file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setValue("images", [...images, ...files]);
  };

  const removeGalleryImage = (idx: number) => {
    const updated = [...images];
    updated.splice(idx, 1);
    setValue("images", updated);
  };

  const getPreview = (item: any) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return URL.createObjectURL(item);
  };

  // const handleAddColor = () => {
  //   if (!selectedColors.includes(pendingColor)) {
  //     setValue("colors", [...selectedColors, pendingColor]);
  //   }
  //   setShowPicker(false);
  // };

  // Get display label for active category (same logic as FilterBar)
  const getActiveCategoryLabel = () => {
    if (!selectedCategory) return categoriesLoading ? "Loading..." : t("selectCategory");
    for (const cat of categories) {
      if (cat._id === selectedCategory) return cat.name[locale] || cat.name?.en || cat.name;
      const sub = cat.subcategories?.find((s: any) => s._id === selectedCategory);
      if (sub) return sub.name[locale] || sub.name?.en || sub.name;
    }
    return t("selectCategory");
  };

  const ErrorMessage = ({ error }: { error: any }) => (
    error ? <p className="text-red-500 text-xs mt-1 font-medium">{error.message}</p> : null
  );

  return (
    <div className="lg:col-span-3 space-y-6">
      <Card className="border shadow-none h-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-700">
            {isEdit ? t("editProductImages") : t("uploadProductImage")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <input ref={mainInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          <input ref={thumbInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />

          {/* Main Photo Section */}
          <div className="space-y-2">
            <Label>{t("productImage")}</Label>
            <div className={`relative aspect-video w-full rounded-2xl border border-dashed flex items-center justify-center overflow-hidden transition-colors ${errors.photo ? "border-red-500 bg-red-50/10" : "border-gray-200 bg-gray-50/40"}`}>
              {photo ? (
                <MyImage src={getPreview(photo)} alt="Product Photo" width={400} height={400} className="object-contain p-10 w-full h-full" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <ImageIcon size={36} />
                  <span className="text-sm">{t("noImageUploaded")}</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <Button type="button" variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm gap-2 rounded-lg" onClick={() => mainInputRef.current?.click()}>
                  <ImageIcon size={14} /> {t("browse")}
                </Button>
                <Button type="button" variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm gap-2 rounded-lg" onClick={() => mainInputRef.current?.click()}>
                  {t("replace")} <RotateCcw size={14} />
                </Button>
              </div>
            </div>
            <ErrorMessage error={errors.photo} />
          </div>

          {/* Gallery Section */}
          <div className="grid grid-cols-3 gap-4">
            {images.map((item, i) => (
              <div key={i} className="relative aspect-square border rounded-xl overflow-hidden">
                <MyImage src={getPreview(item)} alt="Gallery Image" width={400} height={400} className="object-contain p-2 w-full h-full" />
                <button type="button" className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm hover:bg-red-500 hover:text-white transition-colors" onClick={() => removeGalleryImage(i)}>
                  <X size={12} />
                </button>
              </div>
            ))}
            <div className={`aspect-square border border-dashed rounded-xl flex flex-col items-center justify-center text-aqua cursor-pointer hover:bg-aqua/5 transition-colors ${errors.images ? "border-red-500" : "border-aqua/40"}`} onClick={() => thumbInputRef.current?.click()}>
              <Plus size={20} />
              <span className="text-sm mt-1">{t("addImage")}</span>
            </div>
          </div>

          {/* Category — with flyout subcategories, same as FilterBar */}
          {!isEdit && (
            <div className="space-y-2 pt-2">
              <Label>{t("productCategory")}</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        disabled={categoriesLoading}
                        className={`h-[52px] px-4 rounded-md bg-gray-50 flex w-full items-center justify-between gap-2 text-sm outline-none ${errors.category ? "border-red-500" : "border-transparent"}`}
                      >
                        <span className="line-clamp-1">{getActiveCategoryLabel()}</span>
                        <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align={locale === "ar" ? "end" : "start"}
                      className="w-full min-w-(--radix-dropdown-menu-trigger-width)"
                    >
                      {categories.map((category: any) => {
                        const hasSubcategories =
                          category.subcategories && category.subcategories.length > 0;

                        if (hasSubcategories) {
                          return (
                            <DropdownMenuSub key={category._id}>
                              <DropdownMenuSubTrigger className="cursor-pointer">
                                {category.name[locale] || category.name?.en || category.name}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent className="w-48">
                                  {category.subcategories.map((sub: any) => (
                                    <DropdownMenuItem
                                      key={sub._id}
                                      onSelect={() => field.onChange(sub._id)}
                                      className="cursor-pointer flex items-center justify-between"
                                    >
                                      {sub.name[locale] || sub.name?.en || sub.name}
                                      {field.value === sub._id && (
                                        <Check className="size-4 text-aqua shrink-0" />
                                      )}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          );
                        }

                        return (
                          <DropdownMenuItem
                            key={category._id}
                            onSelect={() => field.onChange(category._id)}
                            className="cursor-pointer flex items-center justify-between"
                          >
                            {category.name[locale] || category.name?.en || category.name}
                            {field.value === category._id && (
                              <Check className="size-4 text-aqua shrink-0" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              />
              <ErrorMessage error={errors.category} />
            </div>
          )}

          {/* Colors */}
          {/* <div className="space-y-2 pt-2">
            <Label>{t("selectAvailableColors")}</Label>
            <div className="flex flex-wrap gap-2.5">
              {selectedColors.map((hex) => (
                <div key={hex} onClick={() => setValue("colors", selectedColors.filter(c => c !== hex))} className="h-10 w-10 rounded-md cursor-pointer border hover:ring-2 ring-aqua/20 transition-all flex items-center justify-center" style={{ backgroundColor: hex }}>
                  <Check size={12} className="text-white drop-shadow" />
                </div>
              ))}
              <div className="relative">
                <div onClick={() => setShowPicker((prev) => !prev)} className={`h-10 w-10 rounded-md cursor-pointer border-2 border-dashed transition-all flex items-center justify-center ${errors.colors ? "border-red-500 text-red-500" : "border-gray-200 text-gray-400 hover:border-aqua"}`}>
                  <Plus size={18} />
                </div>
                {showPicker && (
                  <div ref={pickerRef} className="absolute z-50 bottom-12 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col gap-3 w-[220px]">
                    <HexColorPicker color={pendingColor} onChange={setPendingColor} style={{ width: "100%", height: "160px" }} />
                    <div className="flex gap-2">
                      <Button type="button" size="sm" className="flex-1" onClick={handleAddColor}>Add</Button>
                      <Button type="button" size="sm" variant="outline" className="flex-1" onClick={() => setShowPicker(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <ErrorMessage error={errors.colors} />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductImageForm;