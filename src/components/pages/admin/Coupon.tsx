"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FilterSection from "@/components/FilterSection";
import CouponsTable from "@/components/tables/CouponTable";
import StatsCard from "@/components/card/StatsCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import AddCouponDialog from "@/components/dialog/AddCouponDialog";
import { useCouponsAdmin, useCouponStatsAdmin } from "@/hooks/useCoupon";
import { useDebounce } from "@/hooks/useDebounce";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Coupons = () => {
  const t = useTranslations("translation");
  const auth = useSelector((state: RootState) => state.auth.staff);

  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All Coupons");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isReversed, setIsReversed] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const queryParams = useMemo(() => ({
    page,
    limit: 10,
    search: debouncedSearch,
    status: activeTab === "Active" ? "active"
      : activeTab === "Used" ? "used"
        : activeTab === "Cancelled" ? "cancelled"
          : undefined,
  }), [page, debouncedSearch, activeTab]);

  const { data: stats, isLoading: couponStatsLoading } = useCouponStatsAdmin();
  const { data, isLoading, refetch, isFetching } = useCouponsAdmin(queryParams);

  const couponsData = data?.data || [];
  const meta = data?.meta;

  const isStaff = auth?.role === "staff";

  const usersPermissions: string[] =
    auth?.permissions?.find((p: any) => p.module === "coupon codes")?.operations ?? [];

  const canDelete = isStaff ? usersPermissions.includes("delete") : true;
  const canPatch = isStaff ? usersPermissions.includes("patch") : true;
  const canPost = isStaff ? usersPermissions.includes("post") : true;

  const displayedCoupons = useMemo(() => {
    if (!couponsData) return [];
    return isReversed ? [...couponsData].reverse() : couponsData;
  }, [couponsData, isReversed]);

  const couponStats = [
    {
      title: { en: "Total Coupons", ar: "إجمالي الكوبونات" },
      value: stats?.totalCoupons?.toString() || "0",
      trend: "+14.4%",
      isUp: true,
      footerLabel: { en: "Last 7 days", ar: "آخر 7 أيام" },
    },
    {
      title: { en: "Used Coupons", ar: "الكوبونات المستخدمة" },
      value: stats?.totalUsageCount?.toString() || "0",
      trend: "+20%",
      isUp: true,
      footerLabel: { en: "Last 7 days", ar: "آخر 7 أيام" },
    },
    {
      title: { en: "Active Coupons", ar: "الكوبونات النشطة" },
      value: stats?.activeCoupons?.toString() || "0",
      trend: "+85%",
      isUp: true,
      footerLabel: { en: "Last 7 days", ar: "آخر 7 أيام" },
    },
    {
      title: { en: "Expired Coupons", ar: "الكوبونات المنتهية" },
      value: stats?.expiredCoupons?.toString() || "0",
      trend: "5%",
      isUp: false,
      footerLabel: { en: "Last 7 days", ar: "آخر 7 أيام" },
    },
  ];

  return (
    <div className="space-y-6 p-1">
      {
        canPost &&
        <div className="flex items-center justify-end gap-3">
          <Button variant="primary" className="w-32" size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("addCoupon")}
          </Button>
        </div>
      }

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {couponStats.map((stat, i) => (
          <StatsCard key={i} data={stat} isLoading={couponStatsLoading} />
        ))}
      </div>

      <Card className="border shadow-none overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6">
          <FilterSection
            type="coupon"
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setPage(1);
            }}
            data={couponsData}
            search={search}
            setSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            isReversed={isReversed}
            setIsReversed={setIsReversed}
            onRefetch={refetch}
            isFetching={isFetching}
          />
        </CardHeader>
        <CardContent>
          <CouponsTable
            data={displayedCoupons}
            isLoading={isLoading || isFetching}
            meta={meta}
            setPage={setPage}
            activeTab={activeTab}
            canDelete={canDelete}
            canPatch={canPatch}
          />
        </CardContent>
      </Card>

      <AddCouponDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
};

export default Coupons;