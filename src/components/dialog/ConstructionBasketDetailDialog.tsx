"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/hooks/useSettings";

interface ConstructionBasketDetailDialogProps {
  basket: any;
  open: boolean;
  onClose: () => void;
}

const ConstructionBasketDetailDialog = ({ basket, open, onClose }: ConstructionBasketDetailDialogProps) => {
  const t = useTranslations("translation");
  const {data: settings} = useSettings();

  if (!basket) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {t('constructionBasketDetails')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-700 flex items-center gap-2">
                <User size={18} />
                {t('personalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">{t('fullName')}</label>
                <p className="font-semibold text-gray-900">{basket.constructionBasket?.fullRegistrationName}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">{t('phoneNumber')}</label>
                <p className="font-semibold text-gray-900" dir="ltr">{basket.constructionBasket?.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">{t('occupation')}</label>
                <p className="font-semibold text-gray-900">{basket.constructionBasket?.occupation}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">{t('monthlyIncome')}</label>
                <p className="font-semibold text-gray-900">
                  {settings?.currencySymbol}{basket.constructionBasket?.monthlyIncome?.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-700 flex items-center gap-2">
                <Home size={18} />
                {t('propertyInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">{t('propertyType')}</label>
                <p className="font-semibold text-gray-900">{basket.constructionBasket?.propertyType}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">{t('propertyArea')}</label>
                <p className="font-semibold text-gray-900">{basket.constructionBasket?.propertyArea}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">{t('unifiedCard')}</label>
                <p className="font-semibold text-gray-900">{basket.constructionBasket?.unifiedCard}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">{t('residenceCard')}</label>
                <p className="font-semibold text-gray-900">{basket.constructionBasket?.residenceCard}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConstructionBasketDetailDialog;