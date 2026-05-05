"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useUpdateAdminProfile } from "@/hooks/useAuth";
import { toast } from "sonner";

const ManagerChangePasswordForm = () => {
    const t = useTranslations("translation");
    const { mutate: updateProfile, isPending } = useUpdateAdminProfile();

    // State for form and visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        // Validation: Check if empty
        if (!formData.password || !formData.confirmPassword) {
            toast.error("Please fill in both fields");
            return;
        }

        // Validation: Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Send to API
        updateProfile({ password: formData.password }, {
            onSuccess: () => {
                setFormData({ password: "", confirmPassword: "" });
            }
        });
    };

    return (
        <Card className="border shadow-none h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold">{t("changePassword")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 mt-2">
                
                {/* New Password */}
                <div className="space-y-2">
                    <Label>{t("newPassword")}</Label>
                    <div className="relative">
                        <Input 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"} 
                            placeholder={t("enterPassword")} 
                            className="rounded-md ltr:pr-10 rtl:pl-10" 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                        >
                            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label>{t("reEnterPassword")}</Label>
                    <div className="relative">
                        <Input 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder={t("enterPassword")} 
                            className="rounded-md ltr:pr-10 rtl:pl-10" 
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                        >
                            {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <Button 
                    variant="primary" 
                    className="mt-2 rounded-md w-auto px-6"
                    size="sm"
                    onClick={handleSave}
                    disabled={isPending}
                >
                    {isPending ? t("saving") : t("saveChanges")}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ManagerChangePasswordForm;