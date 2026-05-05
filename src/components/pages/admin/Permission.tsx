"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatsCard from "@/components/card/StatsCard";
import FilterSection from "@/components/FilterSection";
import StaffTable from "@/components/tables/StaffTable";
import { useStaff, useStaffStats } from "@/hooks/useStaff";
import { useDebounce } from "@/hooks/useDebounce";

const StaffAccountsPage = () => {
    const [activeTab, setActiveTab] = useState("All Accounts");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isReversed, setIsReversed] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const queryParams = useMemo(() => ({
        page,
        search: debouncedSearch,
        status: activeTab === "All Accounts" ? undefined : activeTab.toLowerCase(),
    }), [page, debouncedSearch, activeTab]);

    const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useStaffStats();
    const { data: staffResponse, isLoading: staffLoading, refetch: refetchStaff, isFetching } = useStaff(queryParams);

    const staffData = staffResponse?.data || [];
    const pagination = staffResponse?.meta;

    const handleRefresh = () => {
        refetchStats();
        refetchStaff();
    };

    const displayedStaff = useMemo(() => {
        if (!staffData) return [];
        return isReversed ? [...staffData].reverse() : staffData;
    }, [staffData, isReversed]);


    const staffStats = [
        {
            title: { en: "Total Staff", ar: "إجمالي الموظفين" },
            value: stats?.[0]?.value || 0,
            trend: "12%",
            isUp: true
        },
        {
            title: { en: "Active Staff", ar: "الموظفين النشطين" },
            value: stats?.[1]?.value || 0,
            trend: "85%",
            isUp: true,
            subtitle: { en: "Last 7 days", ar: "آخر 7 أيام" }
        },
        {
            title: { en: "Inactive Staff", ar: "الموظفين غير النشطين" },
            value: stats?.[2]?.value || 0,
            trend: "2%",
            isUp: false
        }
    ];

    return (
        <div className="space-y-6 p-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffStats.map((stat, i) => (
                    <StatsCard key={i} data={stat} isLoading={statsLoading} />
                ))}
            </div>

            <Card className="border shadow-none overflow-hidden">
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
                    <FilterSection
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            setActiveTab(tab);
                            setPage(1);
                        }}
                        data={staffData}
                        type="staff"
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                        onRefetch={handleRefresh}
                        isFetching={isFetching}
                        isReversed={isReversed}
                        setIsReversed={setIsReversed}
                    />
                </CardHeader>
                <CardContent>
                    <StaffTable
                        data={displayedStaff}
                        isLoading={staffLoading || isFetching}
                        activeTab={activeTab}
                        setPage={setPage}
                        meta={pagination}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffAccountsPage;