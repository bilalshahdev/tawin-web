"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Minus, Plus, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import Image from "@/components/MyImage"
import { Button } from "./ui/button"
import { useCart, useUpdateCartQuantity, useRemoveFromCart } from "@/hooks/useCart"
import { useSettings } from "@/hooks/useSettings"

interface CartSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cartItems: any[]
    isLoading: boolean
}

export default function CartSheet({ open, onOpenChange, cartItems, isLoading }: CartSheetProps) {
    const t = useTranslations("translation")
    const locale = useLocale() as "en" | "ar"
    const router = useRouter();

    const updateQuantityMutation = useUpdateCartQuantity()
    const removeItemMutation = useRemoveFromCart();
    const {data: settingsData} = useSettings();

    // Calculate totals locally based on items array
    const subtotal = cartItems?.reduce(
        (acc: number, item: any) => acc + (item.product?.price * item.quantity),
        0
    )
    const total = subtotal

    const updateQty = (productId: string, currentQty: number, delta: number) => {
        const newQty = Math.max(1, currentQty + delta)
        if (newQty !== currentQty) {
            updateQuantityMutation.mutate({
                productId,
                quantity: newQty
            })
        }
    }

    const removeItem = (productId: string) => {
        removeItemMutation.mutate(productId)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex flex-col w-full sm:max-w-sm p-0 gap-0"
            >
                {/* Header */}
                <SheetHeader className="px-5 py-4 border-b border-gray-100">
                    <SheetTitle className="text-base font-semibold text-gray-900">
                        {t("cart") ?? "Cart"}
                    </SheetTitle>
                </SheetHeader>

                {/* Items */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                            {t("loading")}
                        </div>
                    ) : cartItems?.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                            {t("emptyCart")}
                        </div>
                    ) : (
                        cartItems?.map((item: any) => (
                            <div key={item.product?._id} className="flex items-center gap-4 px-5 py-4">
                                {/* Image - using images array from your JSON */}
                                <div className="w-[72px] h-[72px] rounded-md overflow-hidden bg-gray-100 shrink-0">
                                    <Image
                                        src={item.product?.photo || "/placeholder-product.png"}
                                        alt={item.product?.title?.[locale]}
                                        width={72}
                                        height={72}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 space-y-0.5">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {item.product?.title?.[locale]}
                                    </p>
                                    {
                                        item.product?.variant &&
                                        <p className="text-xs text-gray-400">
                                        {item.product?.variant}
                                    </p>
                                    }
                                    
                                    <button
                                        onClick={() => removeItem(item.product?._id)}
                                        disabled={removeItemMutation.isPending}
                                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors mt-1 disabled:opacity-50"
                                    >
                                        {t("remove") ?? "Remove"} <X className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Right: price + qty */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {settingsData?.currencySymbol}{(item.product?.price * item.quantity)?.toFixed(2)}
                                    </span>
                                    <div className="flex items-center border border-gray-200 rounded-md">
                                        <button
                                            onClick={() => updateQty(item.product?._id, item.quantity, -1)}
                                            disabled={updateQuantityMutation.isPending}
                                            className="px-2 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="px-2 text-sm font-medium min-w-[24px] text-center">
                                            {updateQuantityMutation.isPending && updateQuantityMutation.variables?.productId === item.product?._id
                                                ? "..."
                                                : item.quantity
                                            }
                                        </span>
                                        <button
                                            onClick={() => updateQty(item.product?._id, item.quantity, 1)}
                                            disabled={updateQuantityMutation.isPending}
                                            className="px-2 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Summary */}
                <div className="border-t border-gray-100 px-5 py-6 space-y-3 bg-white">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{t("originalPrice") ?? "Original Price"}</span>
                        <span className="font-medium text-gray-900">
                            {settingsData?.currencySymbol}{subtotal?.toFixed(2)}
                        </span>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                        <span>{t("totalPrice") ?? "Total Price"}</span>
                        <span>{settingsData?.currencySymbol}{total?.toFixed(2)}</span>
                    </div>

                    {/* Checkout Button */}
                    <Button
                        variant="primary"
                        className="w-full rounded-md py-6 mt-2"
                        onClick={() => {
                            onOpenChange(false)
                            router.push("/cart?step=2")
                        }}
                        disabled={cartItems?.length === 0 || isLoading}
                    >
                        {t("completePayment") ?? "Complete Payment"}
                    </Button>

                    {/* View Cart Link */}
                    <div className="text-center">
                        <Button
                            onClick={() => {
                                onOpenChange(false)
                                router.push("/cart")
                            }}
                            variant="outline"
                            className="text-sm text-gray-900 font-medium underline bg-transparent border-0 hover:bg-transparent underline-offset-2 hover:text-aqua transition-colors"
                            disabled={cartItems?.length === 0 || isLoading}
                        >
                            {t("viewCart") ?? "View Cart"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}