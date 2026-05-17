"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useRef, useEffect } from "react";
import { useUpdateAdminProfile } from "@/hooks/useAuth";
import MyImage from "@/components/MyImage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "@/validations/auth";

interface Props {
  data?: { data?: UserData } | UserData;
}

const ManagerProfileForm = ({ data }: Props) => {
  const t = useTranslations("translation");
  const user: UserData = (data as any)?.data ?? data ?? {};

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateProfile, isPending } = useUpdateAdminProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
    },
  });

  useEffect(() => {
    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
    });
  }, [user.firstName, user.lastName, user.username, user.email]);

  const onSubmit = (formData: ProfileFormData) => {
    updateProfile(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateProfile(file);
  };

  return (
    <Card className="lg:col-span-2 border shadow-none">
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-800">{t("editProfile")}</h2>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 relative rounded-full overflow-hidden border-2 border-aqua/20">
            <MyImage
              src={user.profileImage || ""}
              alt="Profile Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              name="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button
              variant="primary"
              size="sm"
              className="w-auto px-6"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
            >
              {t("uploadImage")}
            </Button>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <Label>{t("firstName")}</Label>
            <Input
              {...register("firstName")}
              placeholder={t("ahmed")}
              className="rounded-md"
              error={!!errors.firstName}
              errorMessage={errors.firstName?.message}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("lastName")}</Label>
            <Input
              {...register("lastName")}
              placeholder={t("complete")}
              className="rounded-md"
              error={!!errors.lastName}
              errorMessage={errors.lastName?.message}
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label>{t("username")}</Label>
          <Input
            {...register("username")}
            placeholder="username"
            className="rounded-md"
            error={!!errors.username}
            errorMessage={errors.username?.message}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>{t("email")}</Label>
          <Input
            {...register("email")}
            placeholder="email@example.com"
            className="rounded-md"
            error={!!errors.email}
            errorMessage={errors.email?.message}
          />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label>{t("role")}</Label>
          <Input
            value="Admin"
            readOnly
            disabled
            className="rounded-md bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* Bottom Button */}
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="sm"
            className="shrink-0 w-auto px-6"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? t("saving") : t("save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerProfileForm;