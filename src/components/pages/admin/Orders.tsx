"use client";

import { useState, useMemo } from "react";
import OrderTable from "@/components/tables/OrderTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FilterSection from "@/components/FilterSection";
import StatsCard from "@/components/card/StatsCard";
import { useTranslations } from "next-intl";
import { useDeleteOrder, useGetOrders, useOrderStats } from "@/hooks/useOrder";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

const Orders = () => {
    const t = useTranslations("translation");

    const [activeTab, setActiveTab] = useState("All Orders");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isReversed, setIsReversed] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const { data: orderStatsData, isLoading: isStatsLoading } = useOrderStats();
    const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

    const statsFromApi = orderStatsData?.data;

    const queryParams = useMemo(() => ({
        status: activeTab === "All Orders" ? undefined : activeTab.toLowerCase(),
        page,
        search: debouncedSearch,
    }), [activeTab, page, debouncedSearch]);

    const { data, isLoading, refetch, isFetching } = useGetOrders(queryParams);

    const rawOrders = data?.data || [];
    const pagination = data?.meta || {};

    const handleDelete = (id: string, closeDialog: () => void) => {
        deleteOrder(id, {
            onSuccess: () => {
                toast.success(t("orderDeletedSuccess"));
                closeDialog();
                refetch();
            },
            onError: (error: any) => {
                toast.error(error?.message || "Failed to delete order");
            }
        });
    };

    const stats = [
        {
            title: { en: "Total Orders", ar: "إجمالي الطلبات" },
            value: statsFromApi?.total || 0,
            trend: "+0%",
            isUp: true,
            footerLabel: { en: "All time", ar: "كل الوقت" }
        },
        {
            title: { en: "Pending Orders", ar: "طلبات معلقة" },
            value: statsFromApi?.pending || 0,
            trend: "+0%",
            isUp: true,
            footerLabel: { en: "Current", ar: "حالي" }
        },
        {
            title: { en: "Completed Orders", ar: "طلبات مكتملة" },
            value: statsFromApi?.delivered || 0,
            trend: "+0%",
            isUp: true,
            footerLabel: { en: "All time", ar: "كل الوقت" }
        },
        {
            title: { en: "Cancelled Orders", ar: "طلبات ملغاة" },
            value: statsFromApi?.canceled || 0,
            trend: "0%",
            isUp: false,
            footerLabel: { en: "All time", ar: "كل الوقت" }
        }
    ];

    return (
        <div className="space-y-6 p-1">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <StatsCard key={i} data={stat} isLoading={isStatsLoading} />
                ))}
            </div>

            {/* Orders Table Card */}
            <Card className="border shadow-none overflow-hidden">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <FilterSection
                        type="order"
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            setActiveTab(tab);
                            setPage(1);
                        }}
                        data={rawOrders}
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
                    <OrderTable
                        data={rawOrders}
                        isLoading={isLoading || isFetching}
                        pagination={pagination}
                        page={page}
                        setPage={setPage}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Orders;