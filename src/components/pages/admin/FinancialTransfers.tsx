"use client";

import { useState, useMemo } from "react";
import FilterSection from "@/components/FilterSection";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FinancialTable from "@/components/tables/FinancialTable";
import { FinancialCard } from "@/components/card/FinancialCard";
import StatsCard from "@/components/card/StatsCard";
import { useFinancialTransfers, useGetFinancialStats } from "@/hooks/useFinancialTransfer";
import { useDebounce } from "@/hooks/useDebounce";
import { useSettings } from "@/hooks/useSettings";

const FinancialTransfers = () => {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isReversed, setIsReversed] = useState(false);

  const { data: settings } = useSettings();
  const { data: financialStats, isLoading: financialStatsLoading } = useGetFinancialStats();

  const debouncedSearch = useDebounce(search, 500);

  const statsData = financialStats?.data?.summary?.cards || [];
  const revenue = financialStats?.data?.Revenue || 0;

  const queryParams = useMemo(() => ({
    status: activeTab === "All Orders" ? undefined : activeTab.toLowerCase(),
    page,
    search: debouncedSearch,
  }), [activeTab, page, debouncedSearch]);

  const { data, isLoading, refetch, isFetching } = useFinancialTransfers(queryParams);

  const rawTransfers = data?.data || [];
  const pagination = data?.meta || {};

  const displayedTransfers = useMemo(() => {
    if (!rawTransfers) return [];
    return isReversed ? [...rawTransfers].reverse() : rawTransfers;
  }, [rawTransfers, isReversed]);

  const transferStats = [
    {
      title: { en: "Transfers in Progress", ar: "التحويلات الجارية" },
      value: statsData?.find((s: any) => s.title === "Transfers in Progress")?.value ?? 0,
      trend: `${statsData?.find((s: any) => s.title === "Transfers in Progress")?.change?.percentage ?? 0}%`,
      isUp: statsData?.find((s: any) => s.title === "Transfers in Progress")?.change?.type === "increase",
      footerLabel: { en: "Last 7 Days", ar: "آخر 7 أيام" },
    },
    {
      title: { en: "Total Transfers", ar: "إجمالي التحويلات" },
      value: statsData?.find((s: any) => s.title === "Total Transfers")?.value ?? 0,
      trend: `${statsData?.find((s: any) => s.title === "Total Transfers")?.change?.percentage ?? 0}%`,
      isUp: statsData?.find((s: any) => s.title === "Total Transfers")?.change?.type === "increase",
      footerLabel: { en: "Last 7 Days", ar: "آخر 7 أيام" },
    },
    {
      title: { en: "Completed Transfers", ar: "التحويلات المكتملة" },
      value: statsData?.find((s: any) => s.title === "Completed Transfers")?.value ?? 0,
      trend: `${statsData?.find((s: any) => s.title === "Completed Transfers")?.change?.percentage ?? 0}%`,
      isUp: statsData?.find((s: any) => s.title === "Completed Transfers")?.change?.type === "increase",
      footerLabel: { en: "Last 7 Days", ar: "آخر 7 أيام" },
    },
    {
      title: { en: "Cancelled Transfers", ar: "التحويلات الملغاة" },
      value: statsData?.find((s: any) => s.title === "Cancelled Transfers")?.value ?? 0,
      trend: `${statsData?.find((s: any) => s.title === "Cancelled Transfers")?.change?.percentage ?? 0}%`,
      isUp: statsData?.find((s: any) => s.title === "Cancelled Transfers")?.change?.type === "increase",
      footerLabel: { en: "Last 7 Days", ar: "آخر 7 أيام" },
    },
  ];

  return (
    <div className="space-y-6 p-1">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {transferStats.map((stat, i) => (
            <StatsCard key={i} data={stat} isTrendingAllowed={true} isLoading={financialStatsLoading} />
          ))}
        </div>

        <div className="lg:col-span-2">
          <FinancialCard data={revenue} currencySymbol={settings?.currencySymbol || "$"} isLoading={financialStatsLoading} />
        </div>
      </div>

      <Card className="border shadow-none overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <FilterSection
            type="order"
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setPage(1);
            }}
            data={rawTransfers}
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

        <CardContent className="p-0 sm:p-6">
          <FinancialTable
            data={displayedTransfers}
            isLoading={isLoading || isFetching}
            currencySymbol={settings?.currencySymbol || "$"}
            pagination={pagination}
            page={page}
            setPage={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialTransfers;