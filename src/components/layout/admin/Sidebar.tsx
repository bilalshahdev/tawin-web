"use client";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import getDirection from "@/utils/getDirection";
import { Power } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { sidebarMenu } from "@/constants/sidebar";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import { useUserProfile } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export default function Sidebar({ className }: { className?: string }) {
  const t = useTranslations("translation");
  const t2 = useTranslations("confirm");
  const queryClient = useQueryClient();

  const { data } = useUserProfile();
  const profileData = data?.data;

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();

  const dir = getDirection(locale);

  const isMenuActive = (path: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    if (pathWithoutLocale === path) return true;
    if (path !== "/admin" && pathWithoutLocale.startsWith(path + "/")) return true;
    return false;
  };

  useEffect(() => {
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
  }, [pathname]);

  const handleConfirm = () => {
    localStorage.clear();
    queryClient.clear();

    router.push("/auth/admin");
  };

  // Filter menu items based on role and permissions
  const filteredMenu = useMemo(() => {
    const isStaff = profileData?.role === "staff";
    if (!isStaff) return sidebarMenu;

    const allowedModules = new Set(
      (profileData?.permissions ?? []).map((p: { module: string }) => p.module)
    );

    return sidebarMenu.filter((item) => {
      if (!allowedModules.has(item.label)) return false;

      // Special check to hide addProduct if there is no 'post' permission
      if (item.label === "products" && item.title === "addProduct") {
        const productPerms =
          profileData?.permissions?.find((p: any) => p.module === "products")
            ?.operations ?? [];
        return productPerms.includes("post");
      }

      return true;
    });
  }, [profileData]);

  const mainMenuLabels = new Set([
    "dashboard", "orders", "users", "suppliers",
    "coupon codes", "financial transfers", "brand", "construction-basket",
  ]);

  const productsMenuLabels = new Set(["products", "stock", "reviews"]);
  const adminMenuLabels = new Set(["staff"]);

  const mainMenu = filteredMenu.filter((item) => mainMenuLabels.has(item.label));
  const productsMenu = filteredMenu.filter((item) => productsMenuLabels.has(item.label));
  const adminMenu = filteredMenu.filter((item) => adminMenuLabels.has(item.label));

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-2 py-2 text-sm font-semibold text-gray-400 group-data-[collapsible=icon]:hidden">
      {t(title)}
    </div>
  );

  const renderMenuItems = (items: typeof sidebarMenu) => (
    <SidebarMenu className="flex flex-col gap-1">
      {items.map(({ icon: Icon, path, title }) => {
        const active = isMenuActive(path);
        return (
          <SidebarMenuItem key={path}>
            <SidebarMenuButton
              asChild
              isActive={active}
              tooltip={t(`${title}`)}
              onClick={() => isMobile && setOpenMobile(false)}
            >
              <Link href={path}>
                <Icon
                  size={16}
                  strokeWidth={active ? 2.5 : 2}
                  className={cn(active ? "fill-white text-white" : "fill-none")}
                />
                <span className="text-sm font-medium">{t(`${title}`)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  return (
    <SidebarComponent className={cn("border-r border-gray-200", className)} collapsible="icon" dir={dir}>
      <SidebarHeader className="bg-white px-[24px] group-data-[collapsible=icon]:px-2 py-4 h-auto">
        <div className="font-medium text-sm text-gray-900 group-data-[collapsible=icon]:text-center">
          <span className="group-data-[collapsible=icon]:hidden">{t("constructionManagement")}</span>
          <span className="hidden group-data-[collapsible=icon]:inline">{t("cm")}</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white px-4 no-scrollbar group-data-[collapsible=icon]:overflow-y-auto group-data-[collapsible=icon]:px-2">

        {mainMenu.length > 0 && (
          <div className="mb-2">
            <SectionHeader title="mainMenu" />
            {renderMenuItems(mainMenu)}
          </div>
        )}

        {productsMenu.length > 0 && (
          <div className="mb-2">
            <SectionHeader title="products" />
            {renderMenuItems(productsMenu)}
          </div>
        )}

        {adminMenu.length > 0 && (
          <div className="mb-2">
            <SectionHeader title="administrator" />
            {renderMenuItems(adminMenu)}
          </div>
        )}

      </SidebarContent>

      <SidebarFooter>
        <ConfirmDialog
          title={t("logout")}
          description={t2("logout.description")}
          onConfirm={handleConfirm}
          variant="destructive"
          asChild
        >
          <SidebarMenuButton className="bg-red-500 hover:bg-red-600 hover:text-white text-white transition-colors">
            <Power size={16} /> <span>{t("logout")}</span>
          </SidebarMenuButton>
        </ConfirmDialog>
      </SidebarFooter>
    </SidebarComponent>
  );
}