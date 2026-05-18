"use client"

import { AiOutlineBell, AiOutlineFileText, AiOutlineMessage } from "react-icons/ai";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useUserProfile } from "@/hooks/useAuth";
import MyImage from "@/components/MyImage";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Navbar() {
  const t = useTranslations("translation");
  const auth = useSelector((state: RootState) => state.auth.staff);

  const { data, isLoading } = useUserProfile();

  const isStaff = auth?.role === "staff";

  return (
    <nav className="w-full bg-white border-b border-gray-50 sticky top-0 z-50 mb-2">
      <div className="py-1 px-4 md:px-6 flex items-center justify-between gap-2">

        {/* Left Side: Sidebar & Title */}
        <div className="font-semibold text-lg flex items-center gap-1 shrink-0">
          <SidebarTrigger />
          <span>{t("dashboard")}</span>
        </div>

        {/* Right Side Container */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <LanguageSwitcher />

            {/* Contacts */}
            {!isStaff && (
              <Link href="/admin/contacts" className="relative cursor-pointer shrink-0">
                <AiOutlineMessage size={24} className="text-gray-700" />
              </Link>
            )}

            {/* Report */}
            {
              !isStaff && (
                <Link href="/admin/reports" className="relative cursor-pointer shrink-0">
                  <AiOutlineFileText size={24} className="text-gray-700" />
                </Link>
              )
            }

            {/* Notification */}
            {
              !isStaff && (
                <Link href="/admin/notification" className="relative cursor-pointer shrink-0">
                  <AiOutlineBell size={24} className="text-gray-700" />
                  {/* <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span> */}
                </Link>
              )
            }

            {/* Profile Image / Skeleton Wrapper */}
            <div className="cursor-pointer shrink-0">
              <div className="h-[38px] w-[38px] rounded-full border border-gray-100 overflow-hidden relative bg-gray-200">
                {isLoading ? (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                ) : data?.data?.profileImage ? (
                  <MyImage
                    src={data?.data?.profileImage}
                    width={256}
                    height={256}
                    alt="User"
                    className="object-cover h-full w-full"
                  />
                ) : (
                  /* Fallback when no image exists */
                  <div className="flex items-center justify-center h-full w-full bg-aqua/10 text-aqua text-xs font-bold uppercase">
                    {data?.firstName?.[0]}{data?.lastName?.[0]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}