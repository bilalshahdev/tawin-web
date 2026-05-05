"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Login, LoginSchema } from "@/validations/auth";
import { useLogin, useSigninStaff } from "@/hooks/useAuth"; // Added staff hook
import { SpinnerLoader } from "../common/SpinnerLoader";

const AdminLoginForm = () => {
    const t = useTranslations("translation");

    // Login Hooks
    const { mutate: login, isPending: isAdminPending } = useLogin();
    const { mutate: staffLogin, isPending: isStaffPending } = useSigninStaff();

    // State
    const [showPassword, setShowPassword] = useState(false);
    const [loginType, setLoginType] = useState<"admin" | "staff">("admin");

    const isPending = isAdminPending || isStaffPending;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Login>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: Login) => {
        if (loginType === "admin") {
            login(data);
        } else {
            staffLogin(data);
        }
    };

    return (
        <section className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2 xl:px-24">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-4">
                    <h1 className="text-3xl font-medium tracking-tight text-foreground">
                        {loginType === "admin" ? t("adminSignin") : "Staff Sign In"}
                    </h1>

                    {/* Role Switcher (Radio Toggles) */}
                    <div className="grid w-full grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                        <button
                            type="button"
                            onClick={() => setLoginType("admin")}
                            className={`rounded-md px-3 py-1.5 text-sm cursor-pointer font-medium transition-all ${loginType === "admin"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-background/50"
                                }`}
                        >
                            Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginType("staff")}
                            className={`rounded-md px-3 py-1.5 text-sm cursor-pointer font-medium transition-all ${loginType === "staff"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-background/50"
                                }`}
                        >
                            Staff
                        </button>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        id="email"
                        type="email"
                        placeholder={t("loginPlaceholder")}
                        variant="auth"
                        error={!!errors.email}
                        errorMessage={errors.email?.message}
                        {...register("email")}
                        disabled={isPending}
                    />

                    {/* Password */}
                    <div className="relative">
                        <Input
                            id="password"
                            variant="auth"
                            type={showPassword ? "text" : "password"}
                            placeholder={t("password")}
                            error={!!errors.password}
                            errorMessage={errors.password?.message}
                            {...register("password")}
                            disabled={isPending}
                        />
                        <Button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute ltr:right-0 rtl:left-0 top-[22px] -translate-y-1/2 text-muted-foreground z-10 border-0"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <SpinnerLoader />
                        ) : (
                            loginType === "admin" ? t("signin") : "Staff Sign In"
                        )}
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default AdminLoginForm;