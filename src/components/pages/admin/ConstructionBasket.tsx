"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FilterSection from "@/components/FilterSection";
import ConstructionBasketTable from "@/components/tables/ConstructionBasketTable";
import { useAdminBasketRequests } from "@/hooks/useBasket";
import { useDebounce } from "@/hooks/useDebounce";

const ConstructionBasket = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All Applications");
  const [search, setSearch] = useState("");
  const [isReversed, setIsReversed] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const queryParams = useMemo(() => ({
    status: activeTab === "All Applications" ? undefined : activeTab.toLowerCase(),
    page,
    search: debouncedSearch,
  }), [activeTab, page, debouncedSearch]);

  const { data, isLoading, refetch, isFetching } = useAdminBasketRequests(queryParams);

  const rawData = data?.data || [];
  const meta = data?.meta || {};
  
  const displayedData = useMemo(() => {
    if (!rawData) return [];
    return isReversed ? [...rawData].reverse() : rawData;
  }, [rawData, isReversed]);

  return (
    <div className="space-y-6 p-1">
      <Card className="border shadow-none overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <FilterSection
            activeTab={activeTab}
            setActiveTab={(tab) => { setActiveTab(tab); setPage(1); }}
            data={rawData}
            type="constructionBasket"
            search={search}
            setSearch={(val) => { setSearch(val); setPage(1); }}
            isReversed={isReversed}
            setIsReversed={setIsReversed}
            onRefetch={refetch}
            isFetching={isFetching}
          />
        </CardHeader>
        <CardContent>
          <ConstructionBasketTable
            activeTab={activeTab}
            data={displayedData}
            meta={meta}
            isLoading={isLoading || isFetching}
            setPage={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionBasket;