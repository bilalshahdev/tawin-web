"use client"
import { useState } from "react";
import StatsCard from "@/components/card/StatsCard";
import DashboardChart from "@/components/charts/DashboardChart";
import SalesByRegion from "@/components/charts/SalesByRegion";
import TopCategories from "./TopCategories";
import FinancialTransfers from "../../FinancialTransfers";
import TopSellingProducts from "./TopSellingProducts";
import { useGetAdminSummary } from "@/hooks/useAdmin";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { useSettings } from "@/hooks/useSettings";
import DateRangeFilter, { FilterRange } from "@/components/DateRange";
import { useTranslations } from "next-intl";

const Dashboard = () => {
  const t = useTranslations("translation");
  
  const [filter, setFilter] = useState<FilterRange>("daily");

  const { data: settings } = useSettings();
  const { data: adminSummary, isLoading } = useGetAdminSummary(filter);

  if (isLoading) return <DashboardSkeleton />;

  const stats = adminSummary?.data?.stats || [];
  const categories = adminSummary?.data?.categories || [];
  const financials = adminSummary?.data?.financials || [];
  const products = adminSummary?.data?.products || [];
  const report = adminSummary?.data?.report || [];
  const region = adminSummary?.data?.region || [];

  const statsData = [
    {
      title: { en: "Total Users", ar: "إجمالي المستخدمين" },
      subtitle: { en: filter === "daily" ? "Today" : filter === "weekly" ? "This Week" : "This Month", ar: "آخر 7 أيام" },
      value: stats?.totalUsers?.value || "0",
      change: (stats?.totalUsers?.growth || "0") + "%",
      changeLabel: { en: "Users", ar: "المستخدمين" },
      changeType: "increase" as const,
    },
    {
      title: { en: "Total Orders", ar: "إجمالي الطلبات" },
      subtitle: { en: filter === "daily" ? "Today" : filter === "weekly" ? "This Week" : "This Month", ar: "آخر 7 أيام" },
      value: stats?.totalOrders?.value || "0",
      change: (stats?.totalOrders?.growth || "0") + "%",
      changeLabel: { en: "Order", ar: "طلب" },
      changeType: "increase" as const,
    },
    {
      title: { en: "Total Sales", ar: "إجمالي المبيعات" },
      subtitle: { en: filter === "daily" ? "Today" : filter === "weekly" ? "This Week" : "This Month", ar: "آخر 7 أيام" },
      value: stats?.totalSales?.value || "0",
      change: (stats?.totalSales?.growth || "0") + "%",
      changeLabel: { en: "Sales", ar: "المبيعات" },
      changeType: "increase" as const,
    },
  ];

  const inventoryStats = [
    { label: { en: "Total Products", ar: "إجمالي المنتجات" }, value: report?.inventory?.totalProducts || 0, active: true },
    { label: { en: "Low Stock", ar: "مخزون منخفض" }, value: report?.inventory?.lowStock || 0 },
    { label: { en: "Out of Stock", ar: "نفدت الكمية" }, value: report?.inventory?.outOfStock || 0 },
    { label: { en: "Total Customers", ar: "إجمالي العملاء" }, value: report?.inventory?.totalCustomers || 0 },
    { label: { en: "Total Sales", ar: "إجمالي المبيعات" }, value: `${settings?.currencySymbol || "$"}${report?.inventory?.totalSales || 0}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{t("dashboard")}</h1>
        <DateRangeFilter value={filter} onChange={setFilter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} data={stat} isHome={true} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart title={`${filter}Report`} statsData={inventoryStats} chartData={report?.revenueHistory} />
        </div>
        <div className="lg:col-span-1">
          <SalesByRegion data={region} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <TopCategories data={categories} currencySymbol={settings?.currencySymbol || "$"} />
        </div>
        <div className="lg:col-span-2">
          <FinancialTransfers data={financials} currencySymbol={settings?.currencySymbol || "$"} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <TopSellingProducts data={products} currencySymbol={settings?.currencySymbol || "$"} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;