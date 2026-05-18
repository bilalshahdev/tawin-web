"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import OrderSummary from "./OrderSummary"
import { useTranslations } from "next-intl"
// --- CART HOOKS ---
import { useCart } from "@/hooks/useCart"
import { useCreateOrder } from "@/hooks/useOrder"
import { useAllAddresses, useUserProfile } from "@/hooks/useAuth"
import { SpinnerLoader } from "@/components/common/SpinnerLoader"
import { LoginDialog } from "@/components/dialog/LoginDialog"
import { InactiveProfileDialog } from "@/components/dialog/InactiveProfileDialog"

const Step2 = ({ currencySymbol }: { currencySymbol: string }) => {
    const t = useTranslations("translation");
    const router = useRouter()
    const searchParams = useSearchParams()

    // Get live cart data from API
    const { data: cartResponse } = useCart()
    const cartItems = cartResponse?.items || [];
    const createOrderMutation = useCreateOrder()

    const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD")
    const [selectedAddressId, setSelectedAddressId] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [loginOpen, setLoginOpen] = useState(false)
    const [inactiveOpen, setInactiveOpen] = useState(false)

    // User Profile Hooks to check account active status verification
    const { data: userProfile } = useUserProfile()
    const isVerified = userProfile?.data?.isVerified ?? false

    // Get addresses
    const { data: addresses } = useAllAddresses()

    // Get coupon data from URL parameters
    const couponCode = searchParams.get('couponCode')
    const discountFromUrl = searchParams.get('discountAmount')
    const discount = discountFromUrl ? parseFloat(discountFromUrl) : 0

    const handlePlaceOrder = () => {
        const token = localStorage.getItem("token")

        // 1. Authenticated session validation
        if (!token) {
            setLoginOpen(true)
            return
        }

        // 2. Active account state constraint validation
        if (!isVerified) {
            setInactiveOpen(true)
            return
        }

        if (!selectedAddressId) {
            // Show error toast for missing address
            return
        }
        if (!phoneNumber) {
            // Show error toast for missing phone
            return
        }

        createOrderMutation.mutate({
            addressId: selectedAddressId,
            paymentMethod: paymentMethod,
            phone: phoneNumber,
            couponCode: couponCode || undefined
        })
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
                <div className="border border-gray-200 rounded-md p-6 space-y-6">
                    <h2 className="text-xl font-semibold">{t("personalInformation")}</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t("phoneNumber")}</Label>
                            <Input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+964 000 0000"
                                className="border-gray-300 rounded-md h-[50px]"
                            />
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-md p-6 space-y-6">
                    <h2 className="text-xl font-semibold">{t("address")}</h2>
                    <div className="space-y-3">
                        {addresses?.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">{t("noAddresses")}</p>
                                <Button
                                    onClick={() => router.push('/my-account?tab=address')}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    {t("addAddress")}
                                </Button>
                            </div>
                        ) : (
                            <>
                                {addresses?.map((addr: any) => (
                                    <div
                                        key={addr._id}
                                        onClick={() => setSelectedAddressId(addr._id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                            selectedAddressId === addr._id
                                                ? 'border-aqua bg-aqua/10'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900 capitalize">
                                                    {addr.label || t("deliveryAddress")}
                                                    {addr.isDefault && (
                                                        <span className="ml-2 text-xs bg-aqua/10 text-aqua px-2 py-1 rounded-full">
                                                            {t("default")}
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-600 capitalize mt-1">{addr.street}</p>
                                                <p className="text-sm text-gray-600 capitalize">
                                                    {addr.city}, {addr.state}, {addr.country}
                                                </p>
                                                <p className="text-sm text-gray-600 capitalize">{addr.zipCode}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                selectedAddressId === addr._id ? 'border-aqua' : 'border-gray-300'
                                            }`}>
                                                {selectedAddressId === addr._id && <div className="w-2.5 h-2.5 rounded-md bg-aqua" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                <div className="border border-gray-200 rounded-md p-6 space-y-6">
                    <h2 className="text-xl font-semibold">{t("paymentType")}</h2>
                    <div className="space-y-3">
                        <div
                            onClick={() => setPaymentMethod("COD")}
                            className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-all ${paymentMethod === "COD" ? "bg-aqua/10 border-aqua" : "border-gray-200"}`}
                        >
                            <span className="text-sm font-medium text-gray-400">{t("cashOnDelivery")}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? "border-aqua" : "border-gray-300"}`}>
                                {paymentMethod === "COD" && <div className="w-2.5 h-2.5 rounded-md bg-aqua" />}
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handlePlaceOrder}
                    disabled={createOrderMutation.isPending || !selectedAddressId || !phoneNumber}
                    variant="primary"
                >
                    {createOrderMutation.isPending ? <SpinnerLoader /> : t("confirmOrder")}
                </Button>
            </div>

            <OrderSummary
                cartItems={cartItems}
                discount={discount}
                currencySymbol={currencySymbol}
            />

            <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
            <InactiveProfileDialog open={inactiveOpen} onOpenChange={setInactiveOpen} />
        </div>
    )
}

export default Step2
// "use client"

// import { useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import OrderSummary from "./OrderSummary"
// import { useTranslations } from "next-intl"
// // --- REDUX IMPORTS ---
// import { useSelector } from "react-redux"
// import { RootState } from "@/store/store"

// const Step2 = () => {
//     const t = useTranslations("translation");
//     const router = useRouter()
//     const searchParams = useSearchParams()

//     // Get live cart data from Redux
//     const cartItems = useSelector((state: RootState) => state.cart.items)

//     const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")

//     // Dynamic calculation based on Redux items
//     const subtotal = cartItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)
//     const discount = 25.00

//     const setStep = (step: string) => {
//         const params = new URLSearchParams(searchParams)
//         params.set("step", step)
//         router.push(`?${params.toString()}`)
//     }

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
//             <div className="lg:col-span-8 space-y-8">
//                 <div className="border border-gray-200 rounded-md p-6 space-y-6">
//                     <h2 className="text-xl font-semibold">{t("personalInformation")}</h2>
//                     <div className="space-y-4">
//                         <div className="space-y-2">
//                             <Label>{t("fullName")}</Label>
//                             <Input
//                                 placeholder={t("fullNamePlaceholder")}
//                                 className="border-gray-300 rounded-md h-[50px]"
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label>{t("phoneNumber")}</Label>
//                             <Input
//                                 placeholder="+964 000 0000"
//                                 className="border-gray-300 rounded-md h-[50px]"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="border border-gray-200 rounded-md p-6 space-y-6">
//                     <h2 className="text-xl font-semibold">{t("address")}</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label>{t("neighborhood")}</Label>
//                             <Input
//                                 placeholder={t("neighborhood")}
//                                 className="border-gray-300 rounded-md h-[50px]"
//                             />
//                         </div>
//                         <div className="space-y-2 relative">
//                             <Label>{t("governorate")}</Label>
//                             <Input
//                                 placeholder={t("baghdad")}
//                                 className="border-gray-300 rounded-md h-[50px]"
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label>{t("nearestLandmark")}</Label>
//                             <Input
//                                 placeholder={t("landmark")}
//                                 className="border-gray-300 rounded-md h-[50px]"
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label>{t("alley")}</Label>
//                             <Input
//                                 placeholder={t("alley")}
//                                 className="border-gray-300 rounded-md h-[50px]"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="border border-gray-200 rounded-md p-6 space-y-6">
//                     <h2 className="text-xl font-semibold">{t("paymentMethod")}</h2>
//                     <div className="space-y-3">
//                         <div
//                             onClick={() => setPaymentMethod("card")}
//                             className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-all ${paymentMethod === "card" ? "bg-aqua/10 border-aqua" : "border-gray-200"}`}
//                         >
//                             <span className="text-sm font-medium text-gray-400">{t("cardPayment")}</span>
//                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-aqua" : "border-gray-300"}`}>
//                                 {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-md bg-aqua" />}
//                             </div>
//                         </div>

//                         <div
//                             onClick={() => setPaymentMethod("cash")}
//                             className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-all ${paymentMethod === "cash" ? "bg-aqua/10 border-aqua" : "border-gray-200"}`}
//                         >
//                             <span className="text-sm font-medium text-gray-400">{t("cashOnDelivery")}</span>
//                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cash" ? "border-aqua" : "border-gray-300"}`}>
//                                 {paymentMethod === "cash" && <div className="w-2.5 h-2.5 rounded-md bg-aqua" />}
//                             </div>
//                         </div>
//                     </div>

//                     {paymentMethod === "card" && (
//                         <div className="space-y-4 pt-4">
//                             <div className="space-y-2">
//                                 <Label>{t("cardNumber")}</Label>
//                                 <Input
//                                     placeholder="1234 1234 1234 1234"
//                                     className="border-gray-300 rounded-md h-[50px]"
//                                 />
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label>{t("expirationDate")}</Label>
//                                     <Input
//                                         placeholder="MM/YY"
//                                         className="border-gray-300 rounded-md h-[50px]"
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label>{t("cvc")}</Label>
//                                     <Input
//                                         placeholder={t("cvcPlaceholder")}
//                                         className="border-gray-300 rounded-md h-[50px]"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <Button
//                     onClick={() => setStep("3")}
//                     variant="primary"
//                 >
//                     {t("confirmOrder")}
//                 </Button>
//             </div>

//             <OrderSummary
//                 cartItems={cartItems}
//                 discount={discount}
//             />
//         </div>
//     )
// }

// export default Step2