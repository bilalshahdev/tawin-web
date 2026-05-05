"use client"

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "../auth/AuthHeader";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Login, LoginSchema } from "@/validations/auth";
import { useLogin } from "@/hooks/useAuth";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";

const LoginForm = () => {
    const t = useTranslations("translation");
    const { mutate: login, isPending } = useLogin();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

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
        login({ email: data.email, password: data.password });
    };

    return (
        <section className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2 xl:px-24">
            <div className="w-full max-w-sm space-y-10">
                <AuthHeader type="signin" />

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        id="email"
                        type="text"
                        placeholder={t("loginPlaceholder")}
                        variant="auth"
                        error={!!errors.email}
                        errorMessage={errors.email?.message}
                        {...register("email")}
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

                    <div className="flex items-center justify-between">
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground hover:text-aqua transition-colors"
                        >
                            {t("forgotPassword")}
                        </Link>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(!!checked)}
                            />
                            <Label
                                htmlFor="remember"
                                className="text-xs text-muted-foreground cursor-pointer"
                            >
                                {t("rememberMe")}
                            </Label>
                        </div>
                    </div>

                    <Button type="submit" variant="primary" disabled={isPending}>
                        {isPending ? (
                            <SpinnerLoader />
                        ) : (
                            t("signin")
                        )}
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default LoginForm;