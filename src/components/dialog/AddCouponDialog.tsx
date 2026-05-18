"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SpinnerLoader } from "../common/SpinnerLoader";
import { useCreateCouponAdmin, useUpdateCouponAdmin } from "@/hooks/useCoupon";
import { useGetCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { ImageIcon, X } from "lucide-react";
import { CouponFormData } from "@/types/coupon";
import MyImage from "../MyImage";

const initialFormData: CouponFormData = {
  code: "",
  type: "percentage",
  value: 0,
  expiryDate: "",
  usageLimit: 0,
  appliesTo: "all",
  categories: [],
  products: [],
  isPromotional: false,
};

// Normalize an array that may contain plain IDs or populated objects → string[]
const normalizeIds = (arr: any[] | undefined): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) => (typeof item === "string" ? item : item?._id))
    .filter(Boolean);
};

// Convert ISO date → "YYYY-MM-DD" for <input type="date">
const toDateInputValue = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export default function AddCouponDialog({
  open,
  onOpenChange,
  coupon,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  coupon?: any;
}) {
  const t = useTranslations("translation");
  const locale = useLocale() as "en" | "ar";

  const isEditMode = Boolean(coupon?._id);

  const { mutate: createCoupon, isPending: isCreating } = useCreateCouponAdmin();
  const { mutate: updateCoupon, isPending: isUpdating } = useUpdateCouponAdmin();
  const isPending = isCreating || isUpdating;

  const [formData, setFormData] = useState<CouponFormData>(initialFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories({ isAdmin: true });
  const { data: productsData, isLoading: productsLoading } = useProducts({ allProducts: true });

  const categories: Category[] = categoriesData?.data || [];
  const products: Product[] = productsData?.data || [];

  // Hydrate form when opening in edit mode (or reset for add mode)
  useEffect(() => {
    if (!open) return;

    if (isEditMode && coupon) {
      setFormData({
        code: coupon.code || "",
        type: coupon.type || "percentage",
        value: coupon.value || 0,
        expiryDate: toDateInputValue(coupon.expiryDate),
        usageLimit: coupon.usageLimit || 0,
        appliesTo: coupon.appliesTo || "all",
        categories: normalizeIds(coupon.categories),
        products: normalizeIds(coupon.products),
        isPromotional: coupon.isPromotional ?? false,
      });
      setPreviewUrl(coupon.image || null);
      setFileName(null);
    } else {
      setFormData(initialFormData);
      setPreviewUrl(null);
      setFileName(null);
    }
  }, [open, isEditMode, coupon]);

  const selectedCategories = useMemo(() => formData.categories ?? [], [formData.categories]);
  const selectedProducts = useMemo(() => formData.products ?? [], [formData.products]);

  const addCategory = (id: string) => {
    setFormData((prev) => {
      const list = prev.categories ?? [];
      if (list.includes(id)) return prev;
      return { ...prev, categories: [...list, id] };
    });
  };

  const removeCategory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: (prev.categories ?? []).filter((c) => c !== id),
    }));
  };

  const addProduct = (id: string) => {
    setFormData((prev) => {
      const list = prev.products ?? [];
      if (list.includes(id)) return prev;
      return { ...prev, products: [...list, id] };
    });
  };

  const removeProduct = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      products: (prev.products ?? []).filter((p) => p !== id),
    }));
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c._id === id);
    return cat?.name?.[locale] || cat?.slug || id;
  };

  const getProductName = (id: string) => {
    const prod = products.find((p) => p._id === id);
    return prod?.title?.[locale] || prod?.slug || id;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("code", formData.code);
    fd.append("type", formData.type);
    fd.append("value", String(formData.value));
    fd.append("usageLimit", String(formData.usageLimit));
    fd.append("appliesTo", formData.appliesTo);
    fd.append("isPromotional", String(formData.isPromotional ?? false));
    if (formData.expiryDate) {
      fd.append("expiryDate", new Date(formData.expiryDate).toISOString());
    }
    if (formData.appliesTo === "category") {
      selectedCategories.forEach((id) => fd.append("categories[]", id));
    }
    if (formData.appliesTo === "product") {
      selectedProducts.forEach((id) => fd.append("products[]", id));
    }
    const imageFile = fileInputRef.current?.files?.[0];
    if (imageFile) fd.append("image", imageFile);
    return fd;
  };

  const handleSubmit = () => {
    if (formData.appliesTo === "category" && selectedCategories.length === 0) return;
    if (formData.appliesTo === "product" && selectedProducts.length === 0) return;

    const fd = buildFormData();

    if (isEditMode) {
      updateCoupon(
        { id: coupon._id, data: fd },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createCoupon(fd, {
        onSuccess: () => {
          onOpenChange(false);
          setFormData(initialFormData);
          setPreviewUrl(null);
          setFileName(null);
        },
      });
    }
  };

  const isSubmitDisabled =
    isPending ||
    (formData.appliesTo === "category" && selectedCategories.length === 0) ||
    (formData.appliesTo === "product" && selectedProducts.length === 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] rounded-2xl overflow-hidden border border-gray-100 shadow-xl p-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#004d40]">
            {isEditMode ? t("editCoupon") : t("addNewCoupon")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Row 1: Coupon Code */}
          <div className="space-y-1.5">
            <Label>{t("couponCode")}</Label>
            <Input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="SAVE20"
              className="rounded-md border border-gray-200"
            />
          </div>

          {/* Row 2: Coupon Type */}
          <div className="space-y-1.5">
            <Label>{t("couponType")}</Label>
            <Select
              value={formData.type}
              onValueChange={(val: "percentage" | "fixed") =>
                setFormData({ ...formData, type: val })
              }
            >
              <SelectTrigger className="h-[52px] rounded-md bg-gray-50 border border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">{t("percentage")}</SelectItem>
                <SelectItem value="fixed">{t("fixedAmount")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 3: Discount Value */}
          <div className="space-y-1.5">
            <Label>{t("discountValue")}</Label>
            <Input
              type="number"
              value={formData.value || ""}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              placeholder="20"
              className="rounded-md border border-gray-200"
            />
          </div>

          {/* Row 4: Usage Limit */}
          <div className="space-y-1.5">
            <Label>{t("usageLimit")}</Label>
            <Input
              type="number"
              value={formData.usageLimit || ""}
              onChange={(e) =>
                setFormData({ ...formData, usageLimit: Number(e.target.value) })
              }
              placeholder="500"
              className="rounded-md border border-gray-200"
            />
          </div>

          {/* Row 5: Expiry Date */}
          <div className="space-y-1.5">
            <Label>{t("expiryDate")}</Label>
            <Input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="block w-full rounded-md! border border-gray-200
               [&::-webkit-date-and-time-value]:text-left
               [&::-webkit-calendar-picker-indicator]:ml-auto
               [&::-webkit-calendar-picker-indicator]:cursor-pointer
               [&::-webkit-calendar-picker-indicator]:opacity-60
               [&::-webkit-calendar-picker-indicator]:hover:opacity-100
               rtl:[&::-webkit-date-and-time-value]:text-right
               rtl:[&::-webkit-calendar-picker-indicator]:ml-0
               rtl:[&::-webkit-calendar-picker-indicator]:mr-auto"
            />
          </div>

          {/* Row 6: Applies To */}
          <div className="space-y-1.5">
            <Label>{t("appliesTo")}</Label>
            <Select
              value={formData.appliesTo}
              onValueChange={(val: "all" | "category" | "product") =>
                setFormData({ ...formData, appliesTo: val, categories: [], products: [] })
              }
            >
              <SelectTrigger className="h-[52px] rounded-md bg-gray-50 border border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="category">{t("category")}</SelectItem>
                <SelectItem value="product">{t("product")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 7: Category Dropdown — only when appliesTo === "category" */}
          {formData.appliesTo === "category" && (
            <div className="space-y-1.5">
              <Label>
                {t("selectCategories")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value="" onValueChange={(val) => addCategory(val)}>
                <SelectTrigger className="h-[52px] rounded-md bg-gray-50 border border-gray-200">
                  <SelectValue placeholder={t("selectCategories")} />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <div className="flex justify-center py-3">
                      <SpinnerLoader />
                    </div>
                  ) : categories.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">
                      {t("noCategoriesFound")}
                    </p>
                  ) : (
                    categories
                      .filter((cat) => !selectedCategories.includes(cat._id))
                      .map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name?.[locale] || cat.slug}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>

              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedCategories.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-2 bg-[#004d40]/10 text-[#004d40] text-xs font-medium rounded-full px-3 py-1.5"
                    >
                      {getCategoryName(id)}
                      <button
                        type="button"
                        onClick={() => removeCategory(id)}
                        className="hover:text-red-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {selectedCategories.length === 0 && (
                <p className="text-xs text-red-500">{t("selectAtLeastOneCategory")}</p>
              )}
            </div>
          )}

          {/* Row 8: Product Dropdown — only when appliesTo === "product" */}
          {formData.appliesTo === "product" && (
            <div className="space-y-1.5">
              <Label>
                {t("selectProducts")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value="" onValueChange={(val) => addProduct(val)}>
                <SelectTrigger className="h-[52px] rounded-md bg-gray-50 border border-gray-200">
                  <SelectValue placeholder={t("selectProducts")} />
                </SelectTrigger>
                <SelectContent>
                  {productsLoading ? (
                    <div className="flex justify-center py-3">
                      <SpinnerLoader />
                    </div>
                  ) : products.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">
                      {t("noProductsFound")}
                    </p>
                  ) : (
                    products
                      .filter((prod) => !selectedProducts.includes(prod._id))
                      .map((prod) => (
                        <SelectItem key={prod._id} value={prod._id}>
                          {prod.title?.[locale] || prod.slug}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>

              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedProducts.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-2 bg-[#004d40]/10 text-[#004d40] text-xs font-medium rounded-full px-3 py-1.5"
                    >
                      {getProductName(id)}
                      <button
                        type="button"
                        onClick={() => removeProduct(id)}
                        className="hover:text-red-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {selectedProducts.length === 0 && (
                <p className="text-xs text-red-500">{t("selectAtLeastOneProduct")}</p>
              )}
            </div>
          )}

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label>{t("image")}</Label>
            <div className="border border-gray-200 rounded-md px-3 py-2 flex items-center gap-3 bg-white">
              {previewUrl ? (
                <MyImage src={previewUrl} alt="preview" width={256} height={256} className="h-8 w-8 rounded object-cover shrink-0" />
              ) : (
                <ImageIcon size={18} className="text-gray-400 shrink-0" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-gray-600 hover:text-aqua transition-colors font-medium truncate flex-1 text-left"
              >
                {fileName ?? t("browse")}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          {/* Promotional Toggle */}
          <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2.5">
            <div>
              <Label className="text-sm font-medium text-gray-700">{t("promotional")}</Label>
              <p className="text-xs text-muted-foreground">
                {formData.isPromotional ? t("active") : t("inactive")}
              </p>
            </div>
            <Switch
              checked={formData.isPromotional ?? false}
              onCheckedChange={(val) => setFormData({ ...formData, isPromotional: val })}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full md:w-28 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full h-10"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="w-full md:w-40 rounded-full h-10"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
            >
              {isPending ? (
                <SpinnerLoader />
              ) : isEditMode ? (
                t("saveChanges")
              ) : (
                t("publishCoupon")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}