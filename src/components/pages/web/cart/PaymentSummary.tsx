"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { Ticket, X } from "lucide-react"
import { useState } from "react"
import { LoginDialog } from "@/components/dialog/LoginDialog"
import { InactiveProfileDialog } from "@/components/dialog/InactiveProfileDialog"
import { useUserProfile } from "@/hooks/useAuth"

type PaymentSummaryProps = {
    subtotal: number
    total: number
    discountAmount: number
    appliedCoupon: any
    setStep: (step: string) => void
    currencySymbol: string
}

const PaymentSummary = ({ subtotal, total, discountAmount, appliedCoupon, setStep, currencySymbol }: PaymentSummaryProps) => {
    const t = useTranslations("translation");
    
    const [loginOpen, setLoginOpen] = useState(false);
    const [inactiveOpen, setInactiveOpen] = useState(false);

    // User Profile Hook to check account status verification
    const { data: userProfile } = useUserProfile();
    const isVerified = userProfile?.data?.isVerified ?? false;

    const handleCheckoutAction = () => {
        const token = localStorage.getItem("token");
        
        // 1. Check if token exists
        if (!token) {
            setLoginOpen(true);
            return;
        }

        // 2. Check if user is active/verified
        if (!isVerified) {
            setInactiveOpen(true);
            return;
        }

        // Proceed to next step if passes all checks
        setStep("2");
    };

    return (
        <div className="lg:col-span-4">
            <div className="border border-gray-100 rounded-2xl p-6 space-y-6 sticky top-6 shadow-sm bg-white">
                <h2 className="text-xl font-semibold text-gray-900">{t("paymentSummary")}</h2>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-aqua/10 border border-aqua rounded-lg">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full border-4 border-aqua bg-white" />
                            <span className="text-sm font-medium">{t("freeShipping")}</span>
                        </div>
                        <span className="font-semibold text-sm">$0.00</span>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg group cursor-pointer transition-all hover:border-aqua/50">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-aqua transition-colors" />
                            <span className="text-sm text-gray-400">{t("expressShipping")}</span>
                        </div>
                        <span className="font-semibold text-sm">+$15.00</span>
                    </div>
                </div>

                {/* Applied Coupon Section */}
                {appliedCoupon && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Ticket className="w-4 h-4 text-green-600" />
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-green-800">{appliedCoupon.code}</p>
                                    <p className="text-xs text-green-600">{t("couponApplied")}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-green-800">-${discountAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4 pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-center">
                        <span className="text-base text-gray-400">{t("originalPrice")}</span>
                        <span className="text-lg font-semibold text-gray-900">{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discountAmount > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-base text-green-600">{t("discount")}</span>
                            <span className="text-lg font-semibold text-green-600">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                        <span className="text-base text-gray-400 font-medium">{t("totalPrice")}</span>
                        <span className="text-xl font-semibold text-gray-900">{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                </div>

                <Button
                    onClick={handleCheckoutAction}
                    variant="primary"
                >
                    {t("checkout")}
                </Button>
            </div>

            <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
            <InactiveProfileDialog open={inactiveOpen} onOpenChange={setInactiveOpen} />
        </div>
    )
}

export default PaymentSummary