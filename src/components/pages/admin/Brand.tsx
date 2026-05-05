"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FilterSection from "@/components/FilterSection";
import BrandsTable from "@/components/tables/BrandsTable";
import MiniCard from "@/components/card/MiniCard";
import { useTranslations } from "next-intl";
import AddBrandDialog from "@/components/dialog/AddBrandDialog";
import { useGetCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrand";
import { useDebounce } from "@/hooks/useDebounce";
import CategoryFormDialog from "@/components/dialog/CategoryFormDialog";
import { RootState } from "@/store/store";

const CATEGORY_PAGE_SIZE = 8;

const Brand = () => {
    const t = useTranslations("translation");
    const auth = useSelector((state: RootState) => state.auth.staff);

    const [activeTab, setActiveTab] = useState("All Brands");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [categoryPage, setCategoryPage] = useState(1);
    const [brandPage, setBrandPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isReversed, setIsReversed] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const queryParams = useMemo(() => ({
        page: brandPage,
        search: debouncedSearch,
        status: activeTab === "All Brands" ? undefined : activeTab.toLowerCase(),
    }), [brandPage, debouncedSearch, activeTab]);

    const { data: brandsResponse, isLoading: brandsLoading, refetch, isFetching } = useBrands(queryParams);

    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories({
        limit: CATEGORY_PAGE_SIZE,
        page: categoryPage,
        isAdmin: true,
    });

    const isStaff = auth?.role === "staff";

    const brandsList = brandsResponse?.data || [];
    const brandsMeta = brandsResponse?.meta;

    const categories = categoriesData?.data || [];
    const categoryTotalPages = categoriesData?.meta?.totalPages ?? 1;

    const brandPermissions: string[] =
        auth?.permissions?.find((p: any) => p.module === "brand")?.operations ?? [];
    const categoriesPermissions: string[] =
        auth?.permissions?.find((p: any) => p.module === "categories")?.operations ?? [];

    const canPost = isStaff ? brandPermissions.includes("post") : true;
    const canPatch = isStaff ? brandPermissions.includes("patch") : true;
    const canDelete = isStaff ? brandPermissions.includes("delete") : true;

    const canCategoryGet = isStaff ? categoriesPermissions.includes("get") : true;
    const canCategoryPost = isStaff ? categoriesPermissions.includes("post") : true;

    const displayedBrands = useMemo(() => {
        if (!brandsList) return [];
        return isReversed ? [...brandsList].reverse() : brandsList;
    }, [brandsList, isReversed]);


    return (
        <div className="space-y-6 p-1">
            {canCategoryPost && (
                <div className="flex items-center justify-end gap-3">
                    <Button variant="primary" className="w-fit" size="sm" onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> {t('addCategory')}
                    </Button>
                </div>
            )}

            {canCategoryGet && (
                <div>
                    <div className="flex items-center justify-end mb-3">
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCategoryPage(p => Math.max(1, p - 1))}
                                disabled={categoryPage === 1 || categoriesLoading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground min-w-[48px] text-center">
                                {categoryPage} / {categoryTotalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCategoryPage(p => Math.min(categoryTotalPages, p + 1))}
                                disabled={categoryPage >= categoryTotalPages || categoriesLoading}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <MiniCard
                            data={categories}
                            isLoading={categoriesLoading}
                        />
                    </div>
                </div>
            )}

            <Card className="border shadow-none overflow-hidden">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <FilterSection
                        type="brand"
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            setActiveTab(tab);
                            setBrandPage(1);
                        }}
                        data={brandsList}
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
                            setBrandPage(1);
                        }}
                        isReversed={isReversed}
                        setIsReversed={setIsReversed}
                        onRefetch={refetch}
                        isFetching={isFetching}
                        canPost={canPost}
                    />
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <BrandsTable
                        activeTab={activeTab}
                        data={displayedBrands}
                        isLoading={brandsLoading || isFetching}
                        meta={brandsMeta}
                        setPage={setBrandPage}
                        canPatch={canPatch}
                        canDelete={canDelete}
                    />
                </CardContent>
            </Card>

            <AddBrandDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

            <CategoryFormDialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
        </div>
    );
};

export default Brand;