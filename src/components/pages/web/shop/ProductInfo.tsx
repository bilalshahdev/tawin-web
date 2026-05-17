"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ColorSelector from "./ColorSelector"
import QuantitySelector from "./QuantitySelector"
import StarRating from "@/components/StarRating"
import { useLocale, useTranslations } from "next-intl"
import { Product } from "@/types/product"
import { useAddToCart, useCart } from "@/hooks/useCart"
import { useToggleFavorite, useFavorites } from "@/hooks/useFavorite"
import { cn } from "@/lib/utils"
import { LoginDialog } from "@/components/dialog/LoginDialog"
import { useSettings } from "@/hooks/useSettings"
import { getLocalizedText } from "@/utils/getLocalizedText"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("translation");
  const { data: settingsData } = useSettings();

  const {
    _id,
    title,
    description,
    price,
    originalPrice,
    measurements = "",
    colors = [],
    sizes = [],
    weights = [],
  } = product;

  const { data: cartData } = useCart();
  const { mutate: addToCartApi, isPending: isAdding } = useAddToCart();
  const { data: favData } = useFavorites();
  const { mutate: toggleFavApi, isPending: isTogglingFav } = useToggleFavorite();

  // --- UPDATED: State handles arrays for multiple selection ---
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loginOpen, setLoginOpen] = useState(false); // added

  const isInCart = cartData?.data?.items?.some((item: any) => item.productId === _id);
  const isWished = favData?.data?.some((fav: any) => fav.product?._id === _id);

  const colorObjects = colors.map((colorName) => ({
    name: colorName,
    value: colorName.toLowerCase() === "black" ? "#000000" : colorName
  }));

  // Helper to toggle items in an array
  const toggleSelection = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem("token") // added
    if (!token) { setLoginOpen(true); return } // added

    if (!isInCart) {
      addToCartApi({
        productId: _id,
        quantity: quantity,
        // attributes: {
        //   colors: selectedColors, // Sending the array
        //   sizes: selectedSizes,   // Sending the array
        //   weight: weights[0] || undefined
        // }
      });
    }
  };

  const handleToggleFavorite = () => {
    const token = localStorage.getItem("token") // added
    if (!token) { setLoginOpen(true); return } // added

    toggleFavApi(_id);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <StarRating rating={product.reviewCount} />
        <span className="text-sm text-muted-foreground">{product.reviewCount} {t("reviews")}</span>
      </div>

      <h1 className="text-2xl font-semibold text-foreground capitalize">{getLocalizedText(product.title, locale)}</h1>
      <p className="text-sm text-muted-foreground leading-relaxed first-letter:uppercase">{getLocalizedText(product.description, locale)}</p>

      <Separator />

      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold text-foreground">{settingsData?.currencySymbol}{price.toFixed(2)}</span>
        {originalPrice && originalPrice > price && (
          <span className="text-base text-muted-foreground line-through">{settingsData?.currencySymbol}{originalPrice.toFixed(2)}</span>
        )}
      </div>

      <Separator />

      {product.variant && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">{t("variant")}</span>
          <span className="text-sm text-foreground capitalize">{product.variant}</span>
        </div>
      )}

      {measurements && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">{t("measurements")}</span>
          <span className="text-sm text-foreground">{measurements}</span>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">{t("sizes")}</span>
          <div className="flex flex-wrap gap-2 mt-0.5">
            {sizes.map((s) => {
              const isSelected = selectedSizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSelection(selectedSizes, s, setSelectedSizes)}
                  className={cn(
                    "px-4 py-2 text-sm rounded-md border font-medium transition-all",
                    isSelected
                      ? "bg-aqua text-white border-aqua"
                      : "bg-white text-gray-500 border-gray-200 hover:border-aqua/50"
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {
        colors.length > 0 && (
          <ColorSelector
            colors={colorObjects}
            selectedColor={selectedColors}
            onColorChange={(color) => toggleSelection(selectedColors, color, setSelectedColors)}
          />
        )
      }

      <div className="flex items-center gap-3">
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
        />

        <Button
          variant="outline"
          className="flex-1"
          onClick={handleToggleFavorite}
          disabled={isTogglingFav}
        >
          <Heart className={cn("h-4 w-4 ltr:mr-2 rtl:ml-2", isWished && "fill-red text-red")} />
          {isWished ? t("inFavorites") : t("favorites")}
        </Button>
      </div>

      <Button
        variant={isInCart ? "secondary" : "primary"}
        className="mb-2"
        onClick={handleAddToCart}
        disabled={isInCart || isAdding}
      >
        {isAdding ? t("adding") : isInCart ? t("alreadyInCart") : t("addToCart")}
      </Button>

      <Separator />

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  )
}