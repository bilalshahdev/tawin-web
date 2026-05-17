"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPassword, ForgotPasswordSchema } from "@/validations/auth";
import { useForgotPassword } from "@/hooks/useAuth";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import ResetPasswordForm from "./ResetPasswordForm";

const ForgotPasswordForm = () => {
    const t = useTranslations("translation");
    const { mutate: sendResetLink, isPending, isSuccess } = useForgotPassword();
    const [submittedEmail, setSubmittedEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPassword>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = (data: ForgotPassword) => {
        setSubmittedEmail(data.email);
        sendResetLink(data.email);
    };

    if (isSuccess) {
        return <ResetPasswordForm email={submittedEmail} />;
    }

    return (
        <section className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2 xl:px-24">
            <div className="w-full max-w-sm space-y-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-medium tracking-tight text-foreground">
                        {t("forgotPasswordTitle")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("forgotPasswordDescription")}
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        id="email"
                        type="text"
                        placeholder={t("emailPlaceholder")}
                        variant="auth"
                        error={!!errors.email}
                        errorMessage={errors.email?.message}
                        {...register("email")}
                    />

                    <Button type="submit" variant="primary" disabled={isPending}>
                        {isPending ? <SpinnerLoader /> : t("sendResetLink")}
                    </Button>
                </form>

                <div className="text-center">
                    <Link
                        href="/auth/signin"
                        className="text-sm text-aqua hover:text-aqua/80 transition-colors font-medium"
                    >
                        {t("backToLogin")}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ForgotPasswordForm;
