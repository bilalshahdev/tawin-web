"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
    Plus,
    RefreshCcw,
    ArrowUpDown,
    FileText,
    CirclePlus,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchInput from "@/components/ui/searchInput";
import ProductTable from "@/components/tables/ProductTable";
import MiniCard from "@/components/card/MiniCard";
import { useTranslations } from "next-intl";
import { useGetCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import CategoryFormDialog from "@/components/dialog/CategoryFormDialog";
import CategoryDetailDialog from "@/components/dialog/CategoryDetailDialog";
import { Category } from "@/types/category";
import { RootState } from "@/store/store";

const CATEGORY_PAGE_SIZE = 8;

const ProductList = () => {
    const t = useTranslations("translation");
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth.staff);

    const [activeTab, setActiveTab] = useState("All Products");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isReversed, setIsReversed] = useState(false);
    const [categoryPage, setCategoryPage] = useState(1);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const isStaff = auth?.role === "staff";

    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories({
        limit: CATEGORY_PAGE_SIZE,
        page: categoryPage,
        isAdmin: true,
    });

    const categories = categoriesData?.data || [];
    const categoryTotalPages = categoriesData?.meta?.totalPages ?? 1;

    const queryParams = useMemo(() => {
        const rawParams = {
            featuredProducts: activeTab === "Featured Products" || undefined,
            reduced: activeTab === "Reduced" || undefined,
            outOfStock: activeTab === "Out of Stock" || undefined,
            page,
            search: debouncedSearch || undefined,
        };
        return rawParams;
    }, [activeTab, page, debouncedSearch]);

    const { data: productsData, isLoading: productsLoading, refetch, isFetching } = useProducts(queryParams);
    const products = productsData?.data || [];
    const pagination = productsData?.meta || {};

    const productsPermissions: string[] =
        auth?.permissions?.find((p: any) => p.module === "products")?.operations ?? [];
    const categoriesPermissions: string[] =
        auth?.permissions?.find((p: any) => p.module === "categories")?.operations ?? [];

    const canPost = isStaff ? productsPermissions.includes("post") : true;
    const canPatch = isStaff ? productsPermissions.includes("patch") : true;
    const canDelete = isStaff ? productsPermissions.includes("delete") : true;

    const canCategoryGet = isStaff ? categoriesPermissions.includes("get") : true;
    const canCategoryPost = isStaff ? categoriesPermissions.includes("post") : true;

    const displayedProducts = useMemo(() => {
        if (!products) return [];
        return isReversed ? [...products].reverse() : products;
    }, [products, isReversed]);

    const tabs = [
        { id: "All Products", label: t("allProducts") },
        { id: "Featured Products", label: t("featuredProducts") },
        { id: "Reduced", label: t("reduced") },
        { id: "Out of Stock", label: t("outOfStock") },
    ];

    const actions = [
        { icon: <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />, color: "text-gray-500", onClick: () => refetch() },
        { icon: <ArrowUpDown className="h-4 w-4" />, color: isReversed ? "text-aqua font-bold" : "text-gray-500", onClick: () => setIsReversed(!isReversed) },
        { icon: <FileText className="h-4 w-4" />, color: "text-red-500" },
    ];

    return (
        <div className="space-y-6 p-1">
            {
                canCategoryPost &&
                <div className="flex items-center justify-end gap-3">
                    <Button variant="primary" className="w-32" onClick={() => setIsAddDialogOpen(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" /> {t('addCategory')}
                    </Button>
                </div>
            }

            {
                canCategoryGet &&
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
            }

            <Card className="border shadow-none overflow-hidden">
                <CardHeader className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-2">
                    <div className="w-full xl:w-auto overflow-x-auto">
                        <div className="flex items-center gap-1 bg-emerald-50/40 p-1 rounded-lg border border-gray-100 min-w-max">
                            {tabs.map((tab) => (
                                <Button
                                    key={tab.id}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setActiveTab(tab.id); setPage(1); }}
                                    className={cn(
                                        "h-8 px-4 text-xs font-medium transition-all shrink-0",
                                        activeTab === tab.id ? "bg-white shadow-sm text-gray-900 border border-gray-100" : "text-muted-foreground hover:bg-aqua/10"
                                    )}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full xl:w-auto">
                        <div className="flex items-center gap-2 flex-1">
                            <SearchInput
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder={`${t("search")}...`}
                                className="flex-1 md:w-[200px] lg:w-[240px]"
                            />
                            <div className="flex items-center gap-1 shrink-0">
                                {actions.map((action, idx) => (
                                    <Button key={idx} variant="outline" size="icon" onClick={action.onClick} className={cn("h-9 w-9 border-gray-200 bg-white shrink-0", action.color)}>
                                        {action.icon}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {canPost && (
                            <Button variant="primary" size="sm" className="w-full lg:w-auto gap-2 shrink-0 h-9" onClick={() => router.push("/admin/products/add")}>
                                <span className="truncate">{t("addProduct")}</span>
                                <CirclePlus className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-0 sm:p-6">
                    <ProductTable
                        activeTab={activeTab}
                        data={displayedProducts}
                        isLoading={productsLoading || isFetching}
                        pagination={pagination}
                        page={page}
                        setPage={setPage}
                        canDelete={canDelete}
                        canPatch={canPatch}
                        canPost={canPost}
                    />
                </CardContent>
            </Card>

            {/* Dialogs */}
            <CategoryFormDialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />

            <CategoryDetailDialog
                category={selectedCategory}
                open={!!selectedCategory}
                onClose={() => setSelectedCategory(null)}
            />
        </div>
    );
};

export default ProductList;