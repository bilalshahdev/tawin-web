"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Image from "@/components/MyImage";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorite";
import { useAddToCart } from "@/hooks/useCart";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { getLocalizedText } from "@/utils/getLocalizedText";

export default function FavoritesList() {
    const locale = useLocale() as "en" | "ar";
    const t = useTranslations("translation");

    // API Hooks
    const { data: settings } = useSettings();
    const { data: favResponse, isLoading } = useFavorites();
    const { mutate: toggleFavorite, isPending: isRemoving } = useToggleFavorite();
    const { mutate: addToCart, isPending: isAdding } = useAddToCart();

    const favorites = favResponse?.data || [];

    if (isLoading) {
        return <div className="min-h-[514px] flex items-center justify-center text-center text-gray-500">{t("loading")}</div>;
    }

    if (favorites.length === 0) {
        return (
            <div className="min-h-[514px] flex items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
                <p className="text-gray-400 text-sm">{t("noFavorites")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold text-gray-900">{t("favorites")}</h2>
            <div className="border-t border-gray-100">
                {favorites.map((item: any) => (
                    <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-b border-gray-50 group gap-4">
                        <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto">
                            {/* Remove Button using Toggle API */}
                            <button 
                                onClick={() => toggleFavorite(item.product?._id)}
                                disabled={isRemoving}
                                className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <Link
                            href={`/shop/${item.product?.slug}`}
                             className="w-16 h-20 md:w-20 md:h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                <Image 
                                    src={item.product?.photo || "/placeholder-product.png"} 
                                    alt={getLocalizedText(item.product?.title, locale) || ""} 
                                    width={80} 
                                    height={80} 
                                    className="w-full h-full object-cover" 
                                />
                            </Link>
                            <div className="text-left">
                                <p className="text-xs font-semibold text-gray-900 uppercase tracking-tight">
                                    {getLocalizedText(item.product?.title, locale)}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    {t("color")}: {t("black")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end space-x-4 md:space-x-8 w-full sm:w-auto mt-2 sm:mt-0">
                            <span className="text-sm font-semibold text-gray-900">
                                {settings?.currencySymbol}{item.product?.price?.toFixed(2)}
                            </span>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                className="rounded-lg h-9 md:h-10 px-4 md:px-6"
                                disabled={isAdding}
                                onClick={() => addToCart({ 
                                    productId: item.product?._id, 
                                    quantity: 1 
                                })}
                            >
                                {t("addToCart")}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}