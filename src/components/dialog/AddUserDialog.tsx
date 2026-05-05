"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Signup, SignupSchema } from "@/validations/auth";
import { useSignup, useUserSignupByAdmin } from "@/hooks/useAuth";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function AddUserDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (val: boolean) => void;
}) {
    const t = useTranslations("translation");
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: signup, isPending } = useUserSignupByAdmin();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<Signup>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: ""
        },
    });

    const agreeTerms = watch("agreeTerms");

    const onSubmit = (data: Signup) => {
        signup(data, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    const handleClose = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#004d40]">
                        {t("addUser")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit, (err) => console.error(err))}>
                        {/* First Name */}
                        <div className="space-y-1.5">
                            <Label>{t("firstName")}</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder={t("firstName")}
                                className="rounded-md border border-gray-200"
                                error={!!errors.firstName}
                                errorMessage={errors.firstName?.message}
                                {...register("firstName")}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-1.5">
                            <Label>{t("lastName")}</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder={t("lastName")}
                                className="rounded-md border border-gray-200"
                                error={!!errors.lastName}
                                errorMessage={errors.lastName?.message}
                                {...register("lastName")}
                            />
                        </div>

                        {/* Username */}
                        <div className="space-y-1.5">
                            <Label>{t("username")}</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder={t("username")}
                                className="rounded-md border border-gray-200"
                                error={!!errors.username}
                                errorMessage={errors.username?.message}
                                {...register("username")}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label>{t("emailLabel")}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t("emailLabel")}
                                className="rounded-md border border-gray-200"
                                error={!!errors.email}
                                errorMessage={errors.email?.message}
                                {...register("email")}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label>{t("password")}</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t("password")}
                                    className="rounded-md border border-gray-200"
                                    error={!!errors.password}
                                    errorMessage={errors.password?.message}
                                    {...register("password")}
                                />
                                <Button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground z-10 border-0 h-full px-3"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="terms"
                                    checked={!!agreeTerms}
                                    onCheckedChange={(checked) =>
                                        setValue("agreeTerms", checked as true, { shouldValidate: true })
                                    }
                                />
                                <Label
                                    htmlFor="terms"
                                    className="text-xs text-muted-foreground cursor-pointer"
                                >
                                    {t("agreeTerms")}
                                </Label>
                            </div>
                            {errors.agreeTerms && (
                                <p className="text-red-500 text-xs mt-1">{errors.agreeTerms.message}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-32 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md"
                                onClick={handleClose}
                            >
                                {t("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                className="w-32 rounded-md"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <SpinnerLoader />
                                ) : (
                                    t("addUser")
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}