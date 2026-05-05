"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-40 bg-gray-50 animate-pulse rounded-md border" />
});
import "react-quill-new/dist/quill.snow.css";

interface MultilingualInputProps {
  label: string;
  name: string;
  type?: "input" | "textarea" | "rich-text";
  placeholderEn?: string;
  placeholderAr?: string;
}

export const MultilingualInput = ({
  label,
  name,
  type = "input",
  placeholderEn = "",
  placeholderAr = "",
}: MultilingualInputProps) => {
  const { register, control } = useFormContext();
  const [lang, setLang] = useState<"en" | "ar">("en");

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const LangButton = ({ l }: { l: "en" | "ar" }) => (
    <button
      type="button"
      onClick={() => setLang(l)}
      className={cn(
        "px-2 py-0.5 text-xs rounded font-semibold transition-colors",
        lang === l ? "bg-aqua text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
      )}
    >
      {l.toUpperCase()}
    </button>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-1">
          <LangButton l="en" />
          <LangButton l="ar" />
        </div>
      </div>

      {/* --- ENGLISH SECTION --- */}
      <div className={lang === "en" ? "block" : "hidden"}>
        {type === "rich-text" ? (
          <Controller
            name={`${name}.en`}
            control={control}
            render={({ field }) => (
              <div className="bg-white rounded-md overflow-hidden border border-gray-200">
                <ReactQuill 
                  theme="snow" 
                  value={field.value || ""} 
                  onChange={field.onChange} 
                  modules={modules} 
                  placeholder={placeholderEn} 
                />
              </div>
            )}
          />
        ) : type === "textarea" ? (
          <textarea
            {...register(`${name}.en`)}
            placeholder={placeholderEn}
            className="w-full min-h-[100px] p-3 rounded-md bg-gray-50 border border-gray-200 focus:border-aqua outline-none text-sm resize-none"
          />
        ) : (
          <Input {...register(`${name}.en`)} placeholder={placeholderEn} className="rounded-md" />
        )}
      </div>

      {/* --- ARABIC SECTION (Fixed RTL) --- */}
      <div className={lang === "ar" ? "block" : "hidden"} dir="rtl">
        {type === "rich-text" ? (
          <Controller
            name={`${name}.ar`}
            control={control}
            render={({ field }) => (
              <div className="bg-white rounded-md overflow-hidden border border-gray-200 ql-rtl">
                <ReactQuill 
                  theme="snow" 
                  value={field.value || ""} 
                  onChange={field.onChange} 
                  modules={modules} 
                  placeholder={placeholderAr}
                  // This is the key for internal Quill RTL handling
                  className="ql-editor-rtl" 
                />
              </div>
            )}
          />
        ) : type === "textarea" ? (
          <textarea
            {...register(`${name}.ar`)}
            placeholder={placeholderAr}
            className="w-full min-h-[100px] p-3 rounded-md bg-gray-50 border border-gray-200 focus:border-aqua outline-none text-sm resize-none text-right"
          />
        ) : (
          <Input {...register(`${name}.ar`)} placeholder={placeholderAr} className="rounded-md text-right" />
        )}
      </div>
    </div>
  );
};