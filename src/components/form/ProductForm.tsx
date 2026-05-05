"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useSettings } from "@/hooks/useSettings";

const ProductForm = ({ isEdit = false }: any) => {
  const {data: settings} = useSettings();
  const t = useTranslations("translation");

  const { register, control, formState: { errors } } = useFormContext();
  const [titleLang, setTitleLang] = useState<"en" | "ar">("en");
  const [descLang, setDescLang] = useState<"en" | "ar">("en");

  const ErrorMessage = ({ error }: { error: any }) => (
    error ? <p className="text-red-500 text-xs">{error.message}</p> : null
  );

  const LangToggle = ({
    lang, setLang
  }: { lang: "en" | "ar"; setLang: (l: "en" | "ar") => void }) => (
    <div className="flex gap-1 ml-auto items-center">
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-2 py-0.5 text-xs rounded font-semibold transition-colors ${lang === l
              ? "bg-aqua text-white"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="lg:col-span-3">
      <Card className="border shadow-none h-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-700">
            {isEdit ? t("editProduct") : t("productInformation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Title EN / AR */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Label>{t("productName")}</Label>
              <LangToggle
                lang={titleLang}
                setLang={setTitleLang} />
            </div>
            <div className={titleLang === "en" ? "block" : "hidden"}>
              <Input
                {...register("title.en")}
                placeholder="Product name in English"
                className={`rounded-md`}
                error={!!(errors.title as any)?.en}
                errorMessage={(errors.title as any)?.en?.message}
              />
            </div>
            <div className={titleLang === "ar" ? "block" : "hidden"}>
              <Input
                {...register("title.ar")}
                placeholder="اسم المنتج بالعربية"
                className={`rounded-md text-right`}
                error={!!(errors.title as any)?.ar}
                errorMessage={(errors.title as any)?.ar?.message}
              />
            </div>
          </div>

          {/* Description EN / AR */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Label>{t("productDescription")}</Label>
              <LangToggle
                lang={descLang}
                setLang={setDescLang}
              />
            </div>
            <div className="relative">
              <div className={descLang === "en" ? "block" : "hidden"}>
                <textarea
                  {...register("description.en")}
                  className={`w-full min-h-[140px] p-4 pb-10 rounded-md bg-gray-50 border focus:border-aqua outline-none text-sm text-gray-600 transition-all resize-none ${(errors.description as any)?.en ? "border-red-500" : "border-transparent"}`}
                  placeholder="Describe your product in English…"
                />
                <ErrorMessage error={(errors.description as any)?.en} />
              </div>
              <div className={descLang === "ar" ? "block" : "hidden"}>
                <textarea
                  {...register("description.ar")}
                  className="w-full min-h-[140px] p-4 pb-10 rounded-md bg-gray-50 border border-transparent focus:border-aqua outline-none text-sm text-gray-600 transition-all resize-none text-right"
                  placeholder="اوصف منتجك بالعربية…"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          {!isEdit && (
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-bold text-gray-700">{t("pricing")}</h3>
              <div className="space-y-2 relative">
                <Label>{t("productPrice")}</Label>
                <div className="relative">
                  <Input
                    {...register("price")}
                    type="number"
                    placeholder="0.00"
                    className={`pl-14 font-semibold rounded-md`}
                    error={!!(errors.price as any)?.message}
                    errorMessage={(errors.price as any)?.message}
                  />
                  <div className={`absolute left-4 -translate-y-1/2 pr-2 border-r border-gray-200 ${errors.price ? "top-6.5" : "top-6.5"}`}>
                    <span className="text-sm">{settings?.currency || "🇺🇸"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Variant */}
          <div className="space-y-2">
            <Label>{t("variant")}</Label>
            <Input
              {...register("variant")}
              placeholder="e.g. Color, Size, etc."
              className={`rounded-md ${errors.variant ? "border-red-500" : ""}`}
            />
            <ErrorMessage error={errors.variant} />
          </div>

          {/* Stock & New Arrival */}
          {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Is New Arrival</Label>
                <Controller
                  control={control}
                  name="isNewArrival"
                  render={({ field }) => (
                    <Select
                      value={field.value === true ? "true" : field.value === false ? "false" : ""}
                      onValueChange={(v) => field.onChange(v === "true")}
                    >
                      <SelectTrigger className={`rounded-md ${errors.isNewArrival ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage error={errors.isNewArrival} />
              </div>
              <div className="space-y-2">
                <Label>Remaining Pieces</Label>
                <Input
                  {...register("remainingPieces", { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  className={`rounded-md ${errors.remainingPieces ? "border-red-500" : ""}`}
                />
                <ErrorMessage error={errors.remainingPieces} />
              </div>
            </div>
          )}

          {/* Sizes */}
          {/* <div className="space-y-2">
            <Label>Sizes</Label>
            <Controller
              control={control}
              name="sizes"
              render={({ field }) => {
                const all = ["XS", "S", "M", "L", "XL", "XXL"] as const;
                const selected: string[] = field.value ?? [];
                const toggle = (s: string) =>
                  field.onChange(
                    selected.includes(s)
                      ? selected.filter((x) => x !== s)
                      : [...selected, s]
                  );
                return (
                  <div className="flex flex-wrap gap-2">
                    {all.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggle(s)}
                        className={`px-3 py-1.5 text-sm rounded-md border font-medium transition-colors ${selected.includes(s)
                            ? "bg-aqua text-white border-aqua"
                            : `bg-white text-gray-500 ${errors.sizes ? "border-red-300" : "border-gray-200"} hover:border-aqua/50`
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                );
              }}
            />
            <ErrorMessage error={errors.sizes} />
          </div> */}

          {/* Weight */}
          {/* {!isEdit && (
            <div className="space-y-2">
              <Label>Weight</Label>
              <div className="flex gap-3">
                <Controller
                  control={control}
                  name="weights.0.unit"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger className={`w-28 rounded-md ${(errors.weights as any)?.[0]?.unit ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {["g", "kg", "mg", "l", "ml"].map((u) => (
                          <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  {...register("weights.0.value")}
                  placeholder="e.g. 500"
                  className={`flex-1 rounded-md ${(errors.weights as any)?.[0]?.value ? "border-red-500" : ""}`}
                />
              </div>
              <ErrorMessage error={(errors.weights as any)?.[0]?.unit || (errors.weights as any)?.[0]?.value} />
            </div>
          )} */}

        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;