"use client";

import { useState, useMemo } from "react";
import WeeklyReportChart from "@/components/charts/WeeklyReportChart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FilterSection from "@/components/FilterSection";
import SuppliersTable from "@/components/tables/SuppliersTable";
import StatsCard from "@/components/card/StatsCard";
import { useGetSuppliers, useDeleteSupplier, useSupplierStats } from "@/hooks/useSupplier";
import { useDebounce } from "@/hooks/useDebounce";
import DateRangeFilter, { FilterRange } from "@/components/DateRange"; // Added this back
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Suppliers = () => {
    const auth = useSelector((state: RootState) => state.auth.staff);

    const [period, setPeriod] = useState<FilterRange>("daily");
    const [activeTab, setActiveTab] = useState("All Suppliers");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isReversed, setIsReversed] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const { data: supplierStats, isLoading: supplierStatsLoading } = useSupplierStats({ period });
    const { mutate: deleteSupplier, isPending: isDeleting } = useDeleteSupplier();

    const queryParams = useMemo(() => ({
        page,
        limit: 10,
        search: debouncedSearch,
        isActive: activeTab === "All Suppliers" ? undefined : activeTab === "Active",
    }), [page, debouncedSearch, activeTab]);

    const { data, isLoading, refetch, isFetching } = useGetSuppliers(queryParams);

    const rawSuppliers = data?.data || [];
    const pagination = data?.meta || {};


    const isStaff = auth?.role === "staff";

    const usersPermissions: string[] =
        auth?.permissions?.find((p: any) => p.module === "suppliers")?.operations ?? [];

    const canDelete = isStaff ? usersPermissions.includes("delete") : true;
    const canPost = isStaff ? usersPermissions.includes("post") : true;

    const displayedData = useMemo(() => {
        let filtered = [...rawSuppliers];
        if (isReversed) filtered.reverse();
        return filtered;
    }, [rawSuppliers, isReversed]);

    const handleDelete = (id: string, closeDialog: () => void) => {
        deleteSupplier(id, {
            onSuccess: () => {
                closeDialog();
            }
        });
    };

    const stats = [
        {
            title: { en: "Total Suppliers", ar: "إجمالي الموردين" },
            value: supplierStats?.suppliers?.total || "0",
            label1: { en: "Active", ar: "نشط" },
            label1Value: supplierStats?.suppliers?.active || "0",
            label2: { en: "In Active", ar: "غير نشط" },
            label2Value: supplierStats?.suppliers?.inactive || "0",
        },
        {
            title: { en: "Total Spend", ar: "إجمالي الإنفاق" },
            value: supplierStats?.procurement?.totalSpend || "0",
        },
        {
            title: { en: "Total Items", ar: "إجمالي العناصر" },
            value: supplierStats?.procurement?.totalItems || "0",
            label1: { en: "Tons", ar: "طن" },
            label1Value: supplierStats?.procurement?.byUnit?.tons || "0",
            label2: { en: "Pieces", ar: "قطع" },
            label2Value: supplierStats?.procurement?.byUnit?.pieces || "0",
        },
    ];

    const tableStats = [
        { label: { en: "Total Suppliers", ar: "إجمالي الموردين" }, value: supplierStats?.suppliers?.total || "0" },
        { label: { en: "Total Spend", ar: "إجمالي الإنفاق" }, value: supplierStats?.procurement?.totalSpend || "0" },
        { label: { en: "Total Items", ar: "إجمالي العناصر" }, value: supplierStats?.procurement?.totalItems || "0" }
    ];

    return (
        <div className="space-y-6 p-1">
            {/* First Row: Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatsCard key={i} data={stat} isLoading={supplierStatsLoading} />
                ))}
            </div>

            {/* Second Row: Full width graph */}
            <div className="w-full">
                <WeeklyReportChart
                    data={tableStats}
                    title="supplierStatistics"
                    // Changed mockGraphData to your real API graph data
                    chartData={supplierStats?.graphData || []}
                    dataKey="spend" // Set this to 'spend' as per your API
                    filter={
                        <DateRangeFilter
                            value={period}
                            onChange={(val) => setPeriod(val)}
                        />
                    }
                />
            </div>

            {/* Third Row: Table and Filters */}
            <Card className="border shadow-none overflow-hidden">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6">
                    <FilterSection
                        type="supplier"
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            setActiveTab(tab);
                            setPage(1);
                        }}
                        data={rawSuppliers}
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                        isReversed={isReversed}
                        setIsReversed={setIsReversed}
                        onRefetch={refetch}
                        isFetching={isFetching}
                        canPost={canPost}
                    />
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <SuppliersTable
                        data={displayedData}
                        isLoading={isLoading || isFetching}
                        pagination={pagination}
                        page={page}
                        setPage={setPage}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                        canDelete={canDelete}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Suppliers;