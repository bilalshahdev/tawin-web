"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Camera } from "lucide-react"
import AccountInfo from "./Step1"
import AddressBook from "./Step2"
import OrderHistory from "./Step3"
import FavoritesList from "./Step4"
import { useTranslations } from "next-intl"
import ConstructionBasketForm from "@/components/form/ConstructionBasketForm"
import { LogoutDialog } from "@/components/dialog/LogoutDialog"
import { useState, useRef } from "react"
import { accountItems } from "@/constants/my-account"
import Image from "@/components/MyImage"
import { useUserProfile, useUpdateUserProfile } from "@/hooks/useAuth"
import { ProfilePictureSchema } from "@/validations/auth"
import { toast } from "sonner"
import { SidebarSkeleton } from "@/components/skeletons/SidebarSkeleton"

export default function MyAccount() {
  const t = useTranslations("translation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: userProfile, isLoading, isFetching, error, refetch } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentTab = searchParams.get("tab") || "account";

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = ProfilePictureSchema.safeParse({ profilePicture: file });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsUploading(true);
    try {
      await updateProfileMutation.mutateAsync(file);
      refetch();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/auth/signin");
    setIsDialogOpen(false);
  };

  const setTab = (tab: string) => {
    if (tab === "logout") {
      setIsDialogOpen(true)
      return
    }

    const params = new URLSearchParams(searchParams)
    params.set("tab", tab)
    router.push(`?${params.toString()}`)
  }

  const renderContent = () => {
    switch (currentTab) {
      case "account": return <AccountInfo />
      case "address": return <AddressBook />
      case "orders": return <OrderHistory />
      case "favorites": return <FavoritesList />
      case "construction": return <ConstructionBasketForm />
      default: return <AccountInfo />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 font-sans text-gray-800">
      <h1 className="text-3xl font-semibold text-center mb-10 sm:mb-16 text-gray-900 capitalize">
        {currentTab === "account" ? t("myAccount") : t(currentTab)}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4">
          {isLoading || isFetching ? (
            <SidebarSkeleton />
          ) : (
            <div className="bg-[#F3F5F7] rounded-2xl p-4 sm:p-8 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    src={userProfile?.data?.profileImage}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  id="sidebar-profile-upload"
                />
                <label
                  htmlFor="sidebar-profile-upload"
                  className="absolute z-40 bottom-0 right-0 bg-black text-white p-1.5 rounded-full border-2 border-white hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </label>
              </div>

              <h3 className="font-semibold text-gray-900 mb-8 capitalize">
                {userProfile.data.firstName} {userProfile.data.lastName}
              </h3>

              <nav className="w-full space-y-1">
                {accountItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full ltr:text-left rtl:text-right py-3 px-2 text-sm cursor-pointer transition-all relative ${currentTab === item.id
                      ? "text-aqua font-semibold"
                      : "text-gray-500 hover:text-gray-900"
                      }`}
                  >
                    {t(item.label)}
                    {currentTab === item.id && (
                      <div className="absolute left-0 bottom-0 w-full h-0.5 bg-aqua" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          {renderContent()}
        </div>
      </div >

      <LogoutDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleLogout}
      />
    </div >
  )
}