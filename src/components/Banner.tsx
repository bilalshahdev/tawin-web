"use client";

import { Button } from '@/components/ui/button'
import { Info, X } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

const AlertBanner = () => {
  const t = useTranslations("translation");
  const locale = useLocale() as "en" | "ar";

  const productData = {
    name: { en: "Wooden Door 12", ar: "باب خشبي ١٢" },
    count: 5
  };

  return (
    <div className="bg-[#fff5f5] border border-[#ffe3e3] p-3 mb-6 flex items-center justify-between rounded-md">
      <div className="flex items-center gap-3">
        <div className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <X size={18} />
        </div>
        <p className="text-sm text-gray-700">
          {t.rich('outOfStockAlert', {
            count: productData.count,
            // Fixing the TS(2322) error by using a tag function
            product: () => (
              <span className="text-red font-semibold underline decoration-red/30">
                {productData.name[locale]}
              </span>
            ),
          })}
          <Button variant="link" className="text-red font-semibold p-0 h-auto ml-1 hover:no-underline">
            {t('addToStock')}
          </Button>
        </p>
      </div>
      <Info className="text-red h-5 w-5" />
    </div>
  )
}

export default AlertBanner