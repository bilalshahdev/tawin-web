"use client";

import { useRef, useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { useCreateBrand, useUpdateBrand } from "@/hooks/useBrand";
import { MultilingualInput } from "@/components/form/MultilingualInput";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MyImage from "../MyImage";

export default function AddBrandDialog({
  open,
  onOpenChange,
  brand,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  brand?: any;
}) {
  const t = useTranslations("translation");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const isEdit = !!brand;

  const { mutate: createBrand, isPending: isCreating } = useCreateBrand();
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand();
  const isPending = isCreating || isUpdating;

  const methods = useForm({
    defaultValues: {
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      isActive: true,
    },
  });

  const { handleSubmit, reset, watch, setValue } = methods;
  const isActive = watch("isActive");

  useEffect(() => {
    if (open) {
      if (brand) {
        reset({
          name: { en: brand.name?.en || "", ar: brand.name?.ar || "" },
          description: { en: brand.description?.en || "", ar: brand.description?.ar || "" },
          isActive: brand.isActive ?? true,
        });
        setPreviewUrl(brand.image || null);
        setFileName(null);
      } else {
        reset({ name: { en: "", ar: "" }, description: { en: "", ar: "" }, isActive: true });
        setPreviewUrl(null);
        setFileName(null);
      }
    }
  }, [open, brand, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setPreviewUrl(null);
    setFileName(null);
    reset();
    onOpenChange(false);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("name[en]", data.name.en);
    formData.append("name[ar]", data.name.ar);
    formData.append("description[en]", data.description.en);
    formData.append("description[ar]", data.description.ar);
    formData.append("isActive", String(data.isActive));

    const imageFile = fileInputRef.current?.files?.[0];
    if (imageFile) formData.append("image", imageFile);

    if (isEdit) {
      updateBrand({ id: brand._id, data:formData }, { onSuccess: () => handleClose() });
    } else {
      createBrand(formData, { onSuccess: () => handleClose() });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#004d40]">
            {isEdit ? t("editBrand") : t("addBrand")}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <MultilingualInput
              label={t("name")}
              name="name"
              placeholderEn="Enter brand name"
              placeholderAr="أدخل اسم العلامة التجارية"
            />

            <MultilingualInput
              label={t("description")}
              name="description"
              type="textarea"
              placeholderEn="Enter description"
              placeholderAr="أدخل الوصف"
            />

            <div className="space-y-1.5">
              <Label className="text-sm text-gray-500">{t("image")}</Label>
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

            <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2.5">
              <div>
                <Label className="text-sm font-medium text-gray-700">{t("status")}</Label>
                <p className="text-xs text-muted-foreground">
                  {isActive ? t("active") : t("inactive")}
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(val) => setValue("isActive", val)}
              />
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button type="button" variant="outline" size="sm" className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md h-10" onClick={handleClose} disabled={isPending}>
                {t("cancel")}
              </Button>
              <Button type="submit" variant="primary" size="sm" className="flex-1 bg-aqua hover:bg-aqua/90 text-white rounded-md h-10 font-medium" disabled={isPending}>
                {isPending ? <SpinnerLoader /> : isEdit ? t("updateBrand") : t("add")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}