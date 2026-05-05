"use client"

import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface ColorSelectorProps {
  colors?: { name: string; value: string }[];
  selectedColor: string[]; 
  onColorChange: (colorName: string) => void;
}

export default function ColorSelector({ colors = [], selectedColor, onColorChange }: ColorSelectorProps) {
  const t = useTranslations("translation");

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{t("selectColor")}</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {colors.map((color, i) => {
          const isSelected = selectedColor.includes(color.name);

          return (
            <button
              key={i}
              type="button"
              onClick={() => onColorChange(color.name)}
              aria-label={color.name}
              className={cn(
                "relative h-14 w-12 overflow-hidden rounded-md border-2 transition-all",
                isSelected
                  ? "border-aqua ring-2 ring-aqua/20"
                  : "border-transparent hover:border-border"
              )}
            >
              <div 
                className="h-full w-full" 
                style={{ backgroundColor: color.value }} 
              />
              <span className="absolute bottom-0 inset-x-0 text-center text-[8px] leading-tight text-white font-medium bg-black/40 backdrop-blur-[1px] uppercase truncate px-0.5">
                {color.name}
              </span>
              
              {isSelected && (
                <div className="absolute top-1 right-1 h-2 w-2 bg-aqua rounded-full border border-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  )
}