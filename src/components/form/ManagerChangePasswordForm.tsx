"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useUpdateAdminProfile } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordFormData } from "@/validations/auth";

const ManagerChangePasswordForm = () => {
  const t = useTranslations("translation");
  const { mutate: updateProfile, isPending } = useUpdateAdminProfile();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    updateProfile(
      { password: data.password },
      {
        onSuccess: () => reset(),
      }
    );
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
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder={t("enterPassword")}
              className="rounded-md ltr:pr-10 rtl:pl-10"
              error={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute rtl:left-4 ltr:right-4 top-[22px] -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label>{t("reEnterPassword")}</Label>
          <div className="relative">
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("enterPassword")}
              className="rounded-md ltr:pr-10 rtl:pl-10"
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute rtl:left-4 ltr:right-4 top-[22px] -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showConfirmPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            className="mt-2 rounded-md w-auto px-6"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? t("saving") : t("confirm")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerChangePasswordForm;