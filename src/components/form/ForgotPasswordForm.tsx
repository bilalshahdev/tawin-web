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
// Remove ResetPasswordForm import if it's no longer needed inline here

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

  // Fix: Show a clean success state instead of mounting ResetPasswordForm inline
  if (isSuccess) {
    return (
      <section className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2 xl:px-24">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-aqua/10 text-aqua">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground">
              We have sent a secure password reset link to{" "}
              <span className="font-semibold text-foreground">
                {submittedEmail}
              </span>
              . Please check your inbox and click the link to reset your
              credentials.
            </p>
          </div>
          <div className="pt-4">
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
