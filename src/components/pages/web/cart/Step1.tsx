"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X, Ticket } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import PaymentSummary from "./PaymentSummary"
import { useLocale, useTranslations } from "next-intl"
import Image from "@/components/MyImage"
import { useCart, useUpdateCartQuantity, useRemoveFromCart } from "@/hooks/useCart"
import { useValidateCoupon } from "@/hooks/useCoupon"
import { SpinnerLoader } from "@/components/common/SpinnerLoader"

interface Step1Props {
    currencySymbol: string;
}

const Step1 = ({ currencySymbol }: Step1Props) => {
    const locale = useLocale() as "en" | "ar";
    const t = useTranslations("translation");
    const router = useRouter()
    const searchParams = useSearchParams()

    // API Hooks
    const { data: cartResponse, isLoading } = useCart()
    const updateQuantityMutation = useUpdateCartQuantity()
    const removeItemMutation = useRemoveFromCart()
    const validateCouponMutation = useValidateCoupon()

    // Coupon state
    const [couponCode, setCouponCode] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
    const [discountAmount, setDiscountAmount] = useState(0)

    const cartItems = cartResponse?.items || [];

    const subtotal = cartItems.reduce((acc: number, item: any) => acc + (item.product?.price * item.quantity), 0)
    const shipping = 0
    const total = Math.max(0, subtotal + shipping - discountAmount)

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

    const applyCoupon = () => {
        if (!couponCode.trim()) return

        validateCouponMutation.mutate({
            code: couponCode.trim()
        }, {
            onSuccess: (response) => {
                setAppliedCoupon(response.data.coupon)
                setDiscountAmount(response.data.discountAmount)
                setCouponCode("")
            },
            onError: () => {
                // Error is handled in the hook with toast
            }
        })
    }

    const removeCoupon = () => {
        setAppliedCoupon(null)
        setDiscountAmount(0)
    }

    const setStep = (step: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("step", step)
        router.push(`?${params.toString()}`)
    }

    if (isLoading) {
        return <div className="py-20 text-center text-gray-500">{t("loading")}</div>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="font-semibold text-gray-900">{t("product")}</TableHead>
                            <TableHead className="font-semibold text-gray-900">{t("originalPrice")}</TableHead>
                            <TableHead className="font-semibold text-gray-900">{t("totalPrice")}</TableHead>
                            <TableHead className="font-semibold text-gray-900 text-center">{t("quantity")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cartItems.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={4} className="py-20 text-center">
                                    <p className="text-sm text-gray-400">{t("emptyCart")}</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            cartItems.map((item: any) => (
                                <TableRow key={item.product?._id} className="border-b border-gray-50 hover:bg-transparent">
                                    <TableCell className="py-8">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                                <Image
                                                    // Fallback to a placeholder if images array is empty
                                                    src={item.product?.photo || "/placeholder-product.png"}
                                                    alt={item.product?.title?.[locale]}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    {item.product?.title?.[locale]}
                                                </h3>
                                                <button
                                                    onClick={() => removeItem(item.product?._id)}
                                                    disabled={removeItemMutation.isPending}
                                                    className="flex items-center text-xs text-gray-400 mt-2 hover:text-red-500 transition-colors disabled:opacity-50"
                                                >
                                                    {t("remove")} <X className="w-3 h-3 ml-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-900 font-medium">
                                        {currencySymbol}{item.product?.price?.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-gray-900 font-semibold">
                                        {currencySymbol}{(item.product?.price * item.quantity).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center border border-gray-200 rounded-md w-24 mx-auto">
                                            <button
                                                onClick={() => updateQty(item.product?._id, item.quantity, -1)}
                                                disabled={updateQuantityMutation.isPending}
                                                className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="flex-1 text-center text-sm font-medium text-gray-900">
                                                {updateQuantityMutation.isPending && updateQuantityMutation.variables?.productId === item.product?._id
                                                    ? "..."
                                                    : item.quantity
                                                }
                                            </span>
                                            <button
                                                onClick={() => updateQty(item.product?._id, item.quantity, 1)}
                                                disabled={updateQuantityMutation.isPending}
                                                className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Coupon Section */}
                <div className="mt-16 flex flex-col items-center text-center space-y-4">
                    <h4 className="font-semibold text-gray-900">{t("gotCoupon")}</h4>
                    <p className="text-sm text-gray-400">{t("couponDescription")}</p>

                    {appliedCoupon ? (
                        <div className="w-full max-w-md p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Ticket className="w-4 h-4 text-green-600" />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-green-800">{appliedCoupon.code}</p>
                                        <p className="text-xs text-green-600">-{discountAmount.toFixed(2)} {t("discount")}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={removeCoupon}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full max-w-md">
                            <Input
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder={t("couponPlaceholder")}
                                className="border-gray-200 rounded-lg w-full ltr:pr-24 rtl:pl-24 h-11"
                                onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                            />
                            <button
                                onClick={applyCoupon}
                                disabled={validateCouponMutation.isPending || !couponCode.trim()}
                                className="absolute top-1/2 -translate-y-1/2 cursor-pointer flex items-center text-sm font-semibold text-gray-900 hover:text-aqua transition-colors ltr:right-4 rtl:left-4 disabled:opacity-50"
                            >
                                {validateCouponMutation.isPending ? <SpinnerLoader /> : t("apply")}
                                <Ticket className="w-4 h-4 ltr:ml-2 rtl:mr-2 text-gray-300" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <PaymentSummary
                subtotal={subtotal}
                total={total}
                discountAmount={discountAmount}
                currencySymbol={currencySymbol}
                appliedCoupon={appliedCoupon}
                setStep={(step) => {
                    const params = new URLSearchParams(searchParams)
                    params.set("step", step)
                    // Pass coupon data to Step2
                    if (appliedCoupon) {
                        params.set("couponCode", appliedCoupon.code)
                        params.set("discountAmount", discountAmount.toString())
                    }
                    router.push(`?${params.toString()}`)
                }}
            />
        </div>
    )
}

export default Step1