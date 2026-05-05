"use client"

import { useTranslations } from "next-intl"

interface ProductDetailItemProps {
  label: string
  value: string
}

export function ProductDetailItem({ label, value }: ProductDetailItemProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

interface ProductDescriptionProps {
  productKey: string
  productCode: string
  category: string
  className?: string
}

export function ProductDescription({ 
  productKey, 
  productCode, 
  category, 
  className = ""
}: ProductDescriptionProps) {
  const t = useTranslations("translation");

  return (
    <div className={`pt-8 border-t border-gray-100 ${className}`}>
      <div className="max-w-xs space-y-4">
        <ProductDetailItem label={t("productKey")} value={productKey} />
        <ProductDetailItem label={t("productCode")} value={productCode} />
        <ProductDetailItem label={t("category")} value={category} />
      </div>
    </div>
  )
}