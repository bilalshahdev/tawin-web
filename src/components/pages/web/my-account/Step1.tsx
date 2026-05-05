import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/useAuth";
import { ProfileUpdateSchema, ProfileUpdate } from "@/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export default function AccountInfo() {
  const t = useTranslations("translation");
  const { data: userProfile, isLoading,isFetching, refetch } = useUserProfile();
  const {mutate: updateUserProfile,isPending: isUpdatingProfile} = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdate>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      firstName: userProfile?.data?.firstName || "",
      lastName: userProfile?.data?.lastName || "",
      username: userProfile?.data?.username || "",
    },
  });

  // Update form values when user profile loads
  useEffect(() => {
    if (userProfile?.data && !isLoading) {
      reset({
        firstName: userProfile.data.firstName,
        lastName: userProfile.data.lastName,
        username: userProfile.data.username,
      });
    }
  }, [userProfile, isLoading, reset]);

  const onProfileUpdate = async (data: ProfileUpdate) => {
    try {
      await updateUserProfile(data);
      refetch(); // Refresh user profile data
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">{t("accountInformation")}</h2>
        <form onSubmit={handleSubmit(onProfileUpdate)} className="space-y-4" id="profile-form">
          <div className="space-y-2">
            <Label>{t("firstName")}*</Label>
            <Input
              placeholder={t("firstName")}
              {...register("firstName")}
              className="border-gray-300 rounded-md h-[50px]"
              defaultValue={userProfile?.data?.firstName || ""}
              disabled={isLoading || isUpdatingProfile}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("lastName")}*</Label>
            <Input
              placeholder={t("lastName")}
              {...register("lastName")}
              className="border-gray-300 rounded-md h-[50px]"
              defaultValue={userProfile?.data?.lastName || ""}
              disabled={isLoading || isUpdatingProfile}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("username")}*</Label>
            <Input
              placeholder={t("username")}
              {...register("username")}
              className="border-gray-300 rounded-md h-[50px]"
              defaultValue={userProfile?.data?.username || ""}
              disabled={isLoading || isUpdatingProfile}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("emailLabel")}*</Label>
            <Input
              placeholder={t("emailLabel")}
              type="email"
              value={userProfile?.data?.email || ""}
              className="border-gray-300 rounded-md h-[50px]"
              disabled={true}
              readOnly
            />
          </div>
        </form>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">{t("password")}</h2>
        <div className="space-y-4">
          <div className="space-y-2"><Label>{t("currentPassword")}</Label><Input type="password" placeholder={t("currentPassword")} className="border-gray-300 rounded-md h-[50px]" /></div>
          <div className="space-y-2"><Label>{t("newPassword")}</Label><Input type="password" placeholder={t("newPassword")} className="border-gray-300 rounded-md h-[50px]" /></div>
          <div className="space-y-2"><Label>{t("reEnterPassword")}</Label><Input type="password" placeholder={t("reEnterPassword")} className="border-gray-300 rounded-md h-[50px]" /></div>
        </div>
      </section>
      <Button
        variant="primary"
        className="w-42"
        type="submit"
        form="profile-form"
        disabled={isLoading || isUpdatingProfile}
      >
        {isUpdatingProfile ? "Saving..." : t("saveChanges")}
      </Button>
    </div>
  )
}