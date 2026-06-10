"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordFormData } from "@/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  token: string;
  email: string;
}

export default function ResetPasswordForm({
  token,
  email,
}: ResetPasswordFormProps) {
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

  // CRITICAL: This effect forces hook-form to pick up the params when Next.js updates them from the URL
  useEffect(() => {
    if (token) setValue("token", token);
    if (email) setValue("email", email);
  }, [token, email, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    // Ultimate defensive verification block before executing dispatch
    if (!data.token) {
      toast.error(
        "Security token missing. Please use the original email reset link.",
      );
      return;
    }

    try {
      // Execute your API endpoint request mutation here
      // yourResetMutationHook({ email: data.email, token: data.token, password: data.newPassword })
      toast.success("Password updated successfully!");
    } catch (err) {
      toast.error("Failed to update password. Link might be expired.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Hidden input elements safely housing authorization fields */}
      <input type="hidden" {...register("token")} />
      <input type="hidden" {...register("email")} />

      <div className="space-y-2">
        <label className="text-sm font-medium">New Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Reset Password"}
      </Button>
    </form>
  );
}
