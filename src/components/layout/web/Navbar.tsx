"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navLinks } from "@/constants/navLinks"
import { CircleUserRound, Menu, Search, ShoppingBag, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "../../LanguageSwitcher"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import CartSheet from "@/components/CartSheet"
import SearchDialog from "@/components/dialog/SearchDialog"
import Image from "@/components/MyImage"
import { ShopDropdown } from "@/components/ShopDropdown"
import { useCart } from "@/hooks/useCart"
import { useSettings } from "@/hooks/useSettings"
import { useQueryClient } from "@tanstack/react-query"
import { getLocalizedText } from "@/utils/getLocalizedText"
import { useUserProfile } from "@/hooks/useAuth"

export default function Navbar() {
  const t = useTranslations("translation");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: userProfile } = useUserProfile();
  const isVerified = userProfile?.data?.isVerified ?? false;

  const rawNormalizedPath = "/" + pathname.split("/").filter(Boolean).slice(1).join("/");
  const normalizedPath = rawNormalizedPath === "/" ? "/" : rawNormalizedPath;

  const isMain = rawNormalizedPath === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Use API Hook for Cart Data
  const { data: cartResponse } = useCart();

  const cartItems = cartResponse?.items
  const cartCount = cartResponse?.items?.length || 0;


  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
    
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    queryClient.clear();

    router.replace("/auth/signin");
  };

  return (
    <header
      className={cn(
        "w-full ltr:pr-4 rtl:pl-4 sm:px-6 border-b transition-colors duration-300 z-50",
        isMain
          ? "absolute top-0 left-0 right-0 bg-transparent border-transparent"
          : "sticky top-0 bg-white border-gray-100"
      )}
    >
      <div className="h-14 flex items-center">
        {
          settingsLoading ? (
            <div className="flex items-center gap-2 flex-1">
              <div className="animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-2 flex-1">
              <div className="w-12 h-12">
                <Image
                  src={settings?.logo}
                  alt="Logo"
                  width={256}
                  height={256}
                />
              </div>
              {!isMain && (
                <h2 className="text-sm sm:text-base font-semibold text-[#2D3E50]">
                  {getLocalizedText(settings?.businessName, locale)}
                </h2>
              )}
            </Link>
          )
        }

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            if (link.label.toLowerCase() === "shop") {
              return (
                <div key={link.href} className="relative">
                  <ShopDropdown isMain={isMain} />
                  {normalizedPath.startsWith("/shop") && (
                    <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-aqua" />
                  )}
                </div>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all relative pb-1",
                  normalizedPath === link.href
                    ? "text-aqua"
                    : isMain
                      ? "text-white/80 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                )}
              >
                {t(`${link.label.toLowerCase()}`)}
                {normalizedPath === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-aqua" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-1 justify-end items-center gap-3">
          {!isMain && (
            <>
              <LanguageSwitcher isMain={isMain} />

              {(isLoggedIn && isVerified) && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="flex items-center justify-center gap-1 transition-colors relative text-gray-600 hover:text-aqua"
                >
                  {cartCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] sm:text-[10px] text-white">
                      {cartCount}
                    </span>
                  )}
                  <ShoppingBag className="w-4 h-4 sm:h-5 sm:w-5" />
                </button>
              )}

              {isLoggedIn ? (
                <Link href="/my-account">
                  <CircleUserRound className="w-5 h-5 sm:h-6 sm:w-6 stroke-[1.5] hover:text-aqua transition-colors cursor-pointer" />
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="hidden md:block text-sm transition-colors text-gray-900 hover:text-aqua"
                >
                  {t("signin")}
                </Link>
              )}

              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center text-black hover:text-aqua transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:h-5 sm:w-5" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              "md:hidden transition-colors",
              isMain
                ? "text-white/80 hover:text-white"
                : "text-gray-600 hover:text-aqua"
            )}
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-0 ltr:right-0 rtl:left-0 w-[280px] h-full bg-white shadow-2xl p-6 flex flex-col animate-in ltr:slide-in-from-right rtl:slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-10">
              <span className="font-semibold text-lg">{t("menu")}</span>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:text-red-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => {
                if (link.label.toLowerCase() === "shop") {
                  return (
                    <div key={link.href} className="relative cursor-pointer">
                      <ShopDropdown isMain={false} />
                      {normalizedPath.startsWith("/shop") && (
                        <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-aqua" />
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-all relative pb-1",
                      normalizedPath === link.href
                        ? "text-aqua"
                        : "text-gray-500"
                    )}
                  >
                    {t(`${link.label.toLowerCase()}`)}
                    {normalizedPath === link.href && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-aqua" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {!isMain && (
              <div className="mt-auto pt-10">
                {isLoggedIn ? (
                  <Button onClick={handleLogout} variant="primary" className="w-full">
                    {t("logout")}
                  </Button>
                ) : (
                  <Button onClick={() => router.push("/auth/signin")} variant="primary" className="w-full">
                    {t("signin")}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Sheet - Now controlled by open state, data is fetched internally in the Sheet component using useCart */}
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} cartItems={cartItems} isLoading={false} />

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}