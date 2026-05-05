"use client";

import { useState, useMemo } from "react";
import WeeklyReportChart from "@/components/charts/WeeklyReportChart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserTable from "@/components/tables/UserTable";
import FilterSection from "@/components/FilterSection";
import StatsCard from "@/components/card/StatsCard";
import { useAdminUsers } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserStats } from "@/hooks/useUser";
import DateRangeFilter, { FilterRange } from "@/components/DateRange";

const Users = () => {
  const [period, setPeriod] = useState<FilterRange>("daily");
  const [activeTab, setActiveTab] = useState("All Users");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isReversed, setIsReversed] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data: userStatsData, isLoading } = useUserStats({ period });

  const queryParams = useMemo(() => ({
    status: activeTab === "All Users" ? undefined : activeTab.toLowerCase(),
    page,
    search: debouncedSearch,
  }), [activeTab, page, debouncedSearch]);

  const { data: usersData, isLoading: usersLoading, refetch, isFetching: usersFetching } = useAdminUsers(queryParams);

  const summaryCards = userStatsData?.data?.summary?.cards || [];
  const graphData = userStatsData?.data?.graph || [];

  const rawUsers = usersData?.data || [];
  const pagination = usersData?.meta || {};

  const displayedUsers = useMemo(() => {
    if (!rawUsers) return [];
    return isReversed ? [...rawUsers].reverse() : rawUsers;
  }, [rawUsers, isReversed]);

  const chartSummaryStats = [
    {
      label: { en: "Total Customers", ar: "إجمالي العملاء" },
      value: summaryCards[0]?.value || 0,
      active: true
    },
    {
      label: { en: "Verified", ar: "متحقق" },
      value: summaryCards[1]?.value || 0
    },
    {
      label: { en: "Unverified", ar: "غير متحقق" },
      value: summaryCards[2]?.value || 0
    },
    {
      label: { en: "Growth", ar: "النمو" },
      value: `${summaryCards[0]?.change?.percentage || 0}%`
    },
  ];

  const stats = [
    {
      title: { en: "Total Users", ar: "إجمالي المستخدمين" },
      value: summaryCards[0]?.value || "0",
      trend: `${summaryCards[0]?.change?.percentage || 0}%`,
      isUp: summaryCards[0]?.change?.type === "increase",
      footerLabel: { en: "Selected Period", ar: "الفترة المختارة" }
    },
    {
      title: { en: "Verified Users", ar: "مستخدمون متحققون" },
      value: summaryCards[1]?.value || "0",
      trend: `${summaryCards[1]?.change?.percentage || 0}%`,
      isUp: summaryCards[1]?.change?.type === "increase",
      footerLabel: { en: "Selected Period", ar: "الفترة المختارة" }
    },
    {
      title: { en: "Unverified Users", ar: "مستخدم غير متحقق" },
      value: summaryCards[2]?.value || "0",
      trend: `${summaryCards[2]?.change?.percentage || 0}%`,
      isUp: summaryCards[2]?.change?.type === "increase",
      footerLabel: { en: "Selected Period", ar: "الفترة المختارة" }
    },
  ];

  return (
    <div className="space-y-6 p-1">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyReportChart
            title="userStatistics"
            data={chartSummaryStats}
            chartData={graphData}
            isLoading={isLoading}
            filter={
              <DateRangeFilter
                value={period}
                onChange={(val) => setPeriod(val)}
              />
            }
          />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          {stats.map((stat, i) => (
            <StatsCard key={i} data={stat} isLoading={isLoading} />
          ))}
        </div>
      </div>

      <Card className="border shadow-none overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <FilterSection
            type="user"
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setPage(1);
            }}
            data={rawUsers}
            search={search}
            setSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            isReversed={isReversed}
            setIsReversed={setIsReversed}
            onRefetch={refetch}
            isFetching={usersFetching}
          />
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <UserTable
            data={displayedUsers}
            isLoading={usersLoading || usersFetching}
            pagination={pagination}
            page={page}
            setPage={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;