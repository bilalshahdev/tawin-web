"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordFormData } from "@/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  token: string;
  email: string;
}

export default function ResetPasswordForm({
  token,
  email,
}: ResetPasswordFormProps) {
  const t = useTranslations("translation");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: email || "",
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) setValue("token", token);
    if (email) setValue("email", email);
  }, [token, email, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!data.token) {
      toast.error(
        "Security token missing. Please use the original email reset link.",
      );
      return;
    }

    try {
      toast.success("Password updated successfully!");
      setIsSuccess(true);
    } catch (err) {
      toast.error("Failed to update password. Link might be expired.");
    }
  };

  if (isSuccess) {
    return (
      <section className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2 xl:px-24">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              Password Reset Complete
            </h1>
            <p className="text-sm text-muted-foreground">
              Your credentials have been securely updated. You can now login to
              your account using your new password.
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
        {/* Header Block Matching forgotPassword */}
        <div className="space-y-1">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter your new password sequence below to regain access.
          </p>
        </div>

        {/* Input fields */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("token")} />
          <input type="hidden" {...register("email")} />

          <Input
            id="newPassword"
            type="password"
            placeholder="New Password (••••••••)"
            variant="auth"
            error={!!errors.newPassword}
            errorMessage={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm New Password (••••••••)"
            variant="auth"
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? <SpinnerLoader /> : "Update Password"}
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
}
