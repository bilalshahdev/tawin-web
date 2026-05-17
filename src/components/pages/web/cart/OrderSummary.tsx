"use client"

import { Input } from "@/components/ui/input"
import { X, Minus, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Image from "@/components/MyImage"
import { useUpdateCartQuantity, useRemoveFromCart } from "@/hooks/useCart"
import { Product } from "@/types/product"
import { getLocalizedText } from "@/utils/getLocalizedText"

interface CartItem {
    product: Product;
    quantity: number;
    attributes: {
        color: string;
        size: string;
    };
}

type OrderSummaryProps = {
    cartItems: CartItem[]
    discount: number
    currencySymbol: string
}

const OrderSummary = ({ cartItems, discount, currencySymbol }: OrderSummaryProps) => {
    const locale = useLocale() as "en" | "ar";
    const t = useTranslations("translation");

    const { mutate: updateCartQty } = useUpdateCartQuantity();
    const { mutate: deleteItem } = useRemoveFromCart();

    const updateQty = (productId: string, currentQty: number, delta: number) => {
        const newQty = Math.max(1, currentQty + delta);
        if (newQty !== currentQty) {
            updateCartQty({
                productId: productId,
                quantity: newQty
            });
        }
    }

    const removeItem = (productId: string) => {
        deleteItem(productId);
    }

    const subtotal = cartItems.reduce((acc, item) =>
        acc + (item.product.price * item.quantity), 0
    )
    const grandTotal = Math.max(0, subtotal - discount)

    return (
        <div className="lg:col-span-4">
            <div className="border border-gray-200 rounded-md p-6 sticky top-6 space-y-6 bg-white shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">{t("orderSummary")}</h2>

                {/* Items List */}
                <div className="space-y-6 max-h-[400px] overflow-y-auto ltr:pr-2 rtl:pl-2 custom-scrollbar">
                    {cartItems.length === 0 ? (
                        <div className="flex items-center justify-center text-sm text-gray-400">
                            {t("noProductFound")}
                        </div>
                    ) : (
                        cartItems.map((item, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-6 group">
                                <div className="flex items-center ltr:space-x-3 rtl:space-x-reverse">
                                    <button
                                        onClick={() => removeItem(item.product._id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                                        <Image
                                            width={64}
                                            height={80}
                                            src={item.product.photo || ""}
                                            alt={getLocalizedText(item.product.title, locale)}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-left rtl:text-right">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                    <div className="text-[11px] leading-tight">
                                        <p className="font-semibold text-gray-800 uppercase tracking-tight">
                                            {locale === "en" ? item.product.title.en : item.product.title.ar}
                                        </p>
                                        {
                                            item.product?.variant && (
                                                <p className="text-gray-400">
                                                    {item.product?.variant}
                                                </p>
                                            )
                                        }
                                    </div>

                                    {/* Quantity Toggle */}
                                    <div className="flex items-center border border-gray-200 rounded-lg w-20 h-8 overflow-hidden bg-white">
                                        <button
                                            onClick={() => updateQty(item.product._id, item.quantity, -1)}
                                            className="px-2 text-gray-400 hover:text-black transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="flex-1 text-center text-xs font-semibold text-gray-700">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQty(item.product._id, item.quantity, 1)}
                                            className="px-2 text-gray-400 hover:text-black transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Coupon Section - Reverted to your exact Original Design */}
                {/* <div className="flex space-x-2 h-12">
                    <Input
                        placeholder={t("enterCode")}
                        className="h-full rounded-xl border-gray-200 focus:border-aqua"
                    />
                    <button className="bg-gray-800 text-white text-xs px-5 rounded-xl font-semibold uppercase tracking-wider hover:bg-black transition-all">
                        {t("apply")}
                    </button>
                </div> */}

                {/* Summary Totals */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    {
                        discount > 0 &&
                        <div className="flex justify-between items-center text-aqua">
                            <span className="text-base font-semibold">{t("discount")}</span>
                            <span className="text-lg">{currencySymbol}{discount.toFixed(2)}</span>
                        </div>
                    }

                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-400">{t("shipping")}</span>
                        <span className="text-lg font-semibold text-gray-900">{t("free")}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-400">{t("subtotal")}</span>
                        <span className="text-lg font-semibold text-gray-900"> {currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-100 pt-5">
                        <span className="text-base font-semibold text-gray-400">{t("grandTotal")}</span>
                        <span className="text-lg font-semibold text-gray-900 tracking-tighter">
                            {currencySymbol}{grandTotal.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSummary