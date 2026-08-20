"use client"

import { ChangeEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "../auth/AuthHeader";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Signup, SignupSchema } from "@/validations/auth";
import { useSignup } from "@/hooks/useAuth";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import { useRouter } from "next/navigation";
import { normalizePhone } from "@/utils/normalizePhone";

const SignupForm = () => {
    const t = useTranslations("translation");
    const locale = useLocale();
    const router = useRouter();
    const [signupMethod, setSignupMethod] = useState<"email" | "phone">("phone");
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: signup, isPending } = useSignup();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Signup>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            phone: "",
            password: "",
            agreeTerms: undefined,
        },
    });

    const agreeTerms = watch("agreeTerms");
    const phoneValue = watch("phone") || "";

    const onSubmit = (data: Signup) => {
        const otpLang = (locale === "ar" || locale === "ku" ? locale : "en") as "en" | "ar" | "ku";
        signup({
            ...data,
            email: signupMethod === "email" ? data.email : "",
            phone: signupMethod === "phone" ? data.phone : "",
            lang: otpLang,
        },
            {
                onSuccess: (responseData: any) => {
                    localStorage.setItem("token", responseData.token);
                    sessionStorage.setItem("open_account_verification", "1");
                    router.push("/my-account");
                }
            }
        );
    };

    const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = normalizePhone(event.target.value)?.replace(/\D/g, "").slice(0, 15) || "";
        setValue("phone", value, { shouldValidate: true });
    };

    return (
        <section className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2 xl:px-24">
            <div className="w-full max-w-sm space-y-10">
                <AuthHeader type="signup" />

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit, (err) => console.error(err))}>
                    <Input
                        id="firstName"
                        type="text"
                        placeholder={t("firstName")}
                        variant="auth"
                        error={!!errors.firstName}
                        errorMessage={errors.firstName?.message}
                        {...register("firstName")}
                    />

                    <Input
                        id="lastName"
                        type="text"
                        placeholder={t("lastName")}
                        variant="auth"
                        error={!!errors.lastName}
                        errorMessage={errors.lastName?.message}
                        {...register("lastName")}
                    />

                    <Input
                        id="username"
                        type="text"
                        placeholder={t("username")}
                        variant="auth"
                        error={!!errors.username}
                        errorMessage={errors.username?.message}
                        {...register("username")}
                    />

                    <div className="grid grid-cols-2 gap-2 rounded-full bg-muted p-1">
                        <Button
                            type="button"
                            variant={signupMethod === "phone" ? "primary" : "ghost"}
                            className="h-9 rounded-full text-xs"
                            onClick={() => {
                                setSignupMethod("phone");
                                setValue("email", "", { shouldValidate: true });
                            }}
                        >
                            {t("phoneNumber")}
                        </Button>
                        <Button
                            type="button"
                            variant={signupMethod === "email" ? "primary" : "ghost"}
                            className="h-9 rounded-full text-xs"
                            onClick={() => {
                                setSignupMethod("email");
                                setValue("phone", "", { shouldValidate: true });
                            }}
                        >
                            {t("emailLabel")}
                        </Button>
                    </div>

                    {signupMethod === "email" ? (
                        <Input
                            id="email"
                            type="email"
                            placeholder={t("emailLabel")}
                            variant="auth"
                            error={!!errors.email}
                            errorMessage={errors.email?.message}
                            {...register("email")}
                        />
                    ) : (
                        <>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="009647XXXXXXXXX"
                            variant="auth"
                            inputMode="numeric"
                            maxLength={15}
                            error={!!errors.phone}
                            errorMessage={errors.phone?.message}
                            {...register("phone")}
                            value={phoneValue}
                            onChange={handlePhoneChange}
                        />
                        <p className="text-xs text-muted-foreground -mt-4">
                            Example: 009647XXXXXXXXX. Write 00964, then the mobile number without the first 0.
                        </p>
                        </>
                    )}

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

                    <div>
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

                    <Button type="submit" variant="primary" disabled={isPending}>
                        {isPending ? (
                            <SpinnerLoader />
                        ) : (
                            t("registerAccount")
                        )}
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default SignupForm;
