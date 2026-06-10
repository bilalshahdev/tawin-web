"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormData, ResetPasswordSchema } from "@/validations/auth";
import { useResetPassword } from "@/hooks/useAuth";
import { SpinnerLoader } from "@/components/common/SpinnerLoader";

interface ResetPasswordFormProps {
  email: string;
  token?: string;
}

const ResetPasswordForm = ({ email, token = "" }: ResetPasswordFormProps) => {
  const t = useTranslations("translation");
  const { mutate: doReset, isPending } = useResetPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset, // Added reset to dynamically handle incoming props cleanly
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email, token, newPassword: "", confirmPassword: "" },
  });

  // Sync values if they arrive late or change during a render cycle
  useEffect(() => {
    reset({ email, token, newPassword: "", confirmPassword: "" });
  }, [email, token, reset]);

  const onSubmit = (data: ResetPasswordFormData) => {
    doReset({
      email: data.email || "",
      token: data.token || "",
      newPassword: data.newPassword,
    });
  };

  return (
    <section className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2 xl:px-24">
      <div className="w-full max-w-sm space-y-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            {t("resetPasswordTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter your new security credentials below.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Keep token hidden since it's already extracted from the link URL parameter */}
          <input type="hidden" {...register("token")} />
          <input type="hidden" {...register("email")} />

          <div className="relative">
            <Input
              id="newPassword"
              variant="auth"
              type={showPassword ? "text" : "password"}
              placeholder={t("newPassword")}
              error={!!errors.newPassword}
              errorMessage={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <Button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute ltr:right-0 rtl:left-0 top-[22px] -translate-y-1/2 text-muted-foreground z-10 border-0 bg-transparent hover:bg-transparent"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>

          <div className="relative">
            <Input
              id="confirmPassword"
              variant="auth"
              type={showConfirm ? "text" : "password"}
              placeholder={t("confirmNewPassword")}
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute ltr:right-0 rtl:left-0 top-[22px] -translate-y-1/2 text-muted-foreground z-10 border-0 bg-transparent hover:bg-transparent"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>

          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? <SpinnerLoader /> : t("resetPasswordTitle")}
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

export default ResetPasswordForm;
