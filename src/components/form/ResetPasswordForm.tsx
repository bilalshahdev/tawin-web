"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordFormData } from "@/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";
import { useResetPassword } from "@/hooks/useAuth"; // <-- Importing your custom hook
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

  // Hook up your React Query mutation handler
  const { mutate: sendResetRequest, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: email || "",
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Pick up dynamic URL query values when next.js finishes hydration processes
  useEffect(() => {
    if (token) setValue("token", token);
    if (email) setValue("email", email);
  }, [token, email, setValue]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!data.token) {
      toast.error(
        "Security token missing. Please use the original email reset link.",
      );
      return;
    }

    // Call your custom mutation service matching the payload it expects
    sendResetRequest({
      email: data.email || "",
      token: data.token,
      newPassword: data.newPassword,
    });
  };

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

          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? <SpinnerLoader /> : "Update Password"}
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
