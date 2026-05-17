"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import StarRating from "../StarRating"
import { useLocale, useTranslations } from "next-intl"
import Image from "@/components/MyImage"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAddToCart } from "@/hooks/useCart"
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorite"
import { LoginDialog } from "../dialog/LoginDialog"
import { SpinnerLoader } from "../common/SpinnerLoader"
import { useSettings } from "@/hooks/useSettings"
import { getLocalizedText } from "@/utils/getLocalizedText"

export function ProductCard({
    _id,
    photo,
    title,
    price,
    rating,
    originalPrice,
    isNew = false,
    discount,
    slug,
}: any) {
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations("translation");

    const [loginOpen, setLoginOpen] = useState(false)
    const hasBadge = isNew || !!discount

    const { mutate: addToCartApi, isPending: isAddingToCart } = useAddToCart();
    const { data: settingsData } = useSettings();

    // Favorite API Hooks
    const { data: favData } = useFavorites();
    const { mutate: toggleFavApi, isPending: isTogglingFav } = useToggleFavorite();

    const isWished = favData?.data?.some((fav: any) => fav.product?._id === _id);

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        const token = localStorage.getItem("token")
        if (!token) {
            setLoginOpen(true)
            return
        }
        toggleFavApi(_id);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        const token = localStorage.getItem("token")

        if (!token) {
            setLoginOpen(true)
            return
        }

        const payload = {
            productId: _id,
            quantity: 1
        };
        addToCartApi(payload);
    };

    return (
        <>
            <Card className="relative overflow-hidden rounded-xl border-0 shadow-none">
                <CardContent className="p-0">
                    <div
                        onClick={() => router.push(`/shop/${slug}`)}
                        className="group relative aspect-square w-full overflow-hidden cursor-pointer">
                        <Image
                            src={photo}
                            alt={getLocalizedText(title, locale)}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {hasBadge && (
                            <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
                                {isNew && (
                                    <Badge className="w-fit rounded-md bg-background px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm hover:bg-background">
                                        {t("new")}
                                    </Badge>
                                )}
                                {discount && (
                                    <Badge className="w-fit rounded-md bg-aqua px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-aqua">
                                        -{discount}%
                                    </Badge>
                                )}
                            </div>
                        )}

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleFavorite}
                            disabled={isTogglingFav}
                            className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full border-border bg-background/90 shadow-sm hover:bg-background disabled:opacity-70"
                            aria-label="Toggle wishlist"
                        >
                            <Heart
                                className={cn(
                                    "h-4 w-4 transition-colors",
                                    isWished ? "fill-red text-red" : "text-muted-foreground"
                                )}
                            />
                        </Button>
                    </div>

                    <div className="flex flex-col items-start gap-1 bg-background pt-4">
                        <StarRating rating={rating} />

                        <Link href={`/shop/${slug}`} className="line-clamp-1 text-sm font-medium text-foreground cursor-pointer capitalize">
                            {getLocalizedText(title, locale)}
                        </Link>

                        <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                                {settingsData?.currencySymbol}{price.toFixed(2)}
                            </span>
                            {originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                    {settingsData?.currencySymbol}{originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            className="w-full mt-2"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart
                                ? <SpinnerLoader />
                                : t("addToCart")
                            }
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
        </>
    )
}