"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    Plus,
    RefreshCcw,
    ArrowUpDown,
    FileText,
    CirclePlus,
    ChevronLeft,
    ChevronRight,
    Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchInput from "@/components/ui/searchInput";
import ProductTable from "@/components/tables/ProductTable";
import MiniCard from "@/components/card/MiniCard";
import { useTranslations } from "next-intl";
import { useGetCategories } from "@/hooks/useCategories";
import { useImportProducts, useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import CategoryFormDialog from "@/components/dialog/CategoryFormDialog";
import CategoryDetailDialog from "@/components/dialog/CategoryDetailDialog";
import { Category } from "@/types/category";
import { RootState } from "@/store/store";
import { exportReport } from "@/utils/reportExport";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const CATEGORY_PAGE_SIZE = 8;

const parseCsv = (text: string) => {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const next = text[i + 1];

        if (char === '"' && inQuotes && next === '"') {
            cell += '"';
            i += 1;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
            row.push(cell.trim());
            cell = "";
        } else if ((char === "\n" || char === "\r") && !inQuotes) {
            if (char === "\r" && next === "\n") i += 1;
            row.push(cell.trim());
            if (row.some(Boolean)) rows.push(row);
            row = [];
            cell = "";
        } else {
            cell += char;
        }
    }

    row.push(cell.trim());
    if (row.some(Boolean)) rows.push(row);

    const [headers, ...body] = rows;
    if (!headers?.length) return [];

    return body.map((values) => headers.reduce<Record<string, string>>((acc, header, index) => {
        if (header) acc[header.trim()] = values[index]?.trim() || "";
        return acc;
    }, {}));
};

const ProductList = () => {
    const t = useTranslations("translation");
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth.staff);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState("All Products");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isReversed, setIsReversed] = useState(false);
    const [categoryPage, setCategoryPage] = useState(1);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const debouncedSearch = useDebounce(search, 500);
    const { mutate: importProducts, isPending: isImporting } = useImportProducts();

    const isStaff = auth?.role === "staff";

    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories({
        limit: CATEGORY_PAGE_SIZE,
        page: categoryPage,
        isAdmin: true,
    });

    const categories = categoriesData?.data || [];
    const categoryTotalPages = categoriesData?.meta?.totalPages ?? 1;

    const queryParams = useMemo(() => {
        return {
            featuredProducts: activeTab === "Featured Products" || undefined,
            reduced: activeTab === "Reduced" || undefined,
            outOfStock: activeTab === "Out of Stock" || undefined,
            archived: activeTab === "Archived" || undefined,
            page,
            search: debouncedSearch || undefined,
        };
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
        { id: "Archived", label: "Archived" },
    ];

    const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        const fileName = file.name.toLowerCase();
        let rows: Record<string, string>[] = [];

        if (fileName.endsWith(".csv")) {
            const text = await file.text();
            rows = parseCsv(text);
        } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            rows = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet, { defval: "" });
        } else {
            toast.error("Please upload a CSV or Excel file.");
            return;
        }
        if (!rows.length) {
            toast.error("The selected CSV file has no product rows.");
            return;
        }

        importProducts(rows);
    };

    const actions = [
        { icon: <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />, color: "text-gray-500", onClick: () => refetch(), disabled: false },
        { icon: <ArrowUpDown className="h-4 w-4" />, color: isReversed ? "text-aqua font-bold" : "text-gray-500", onClick: () => setIsReversed(!isReversed), disabled: false },
        { icon: <FileText className="h-4 w-4" />, color: "text-red-500", onClick: () => exportReport(t("productList"), displayedProducts), disabled: false },
    ];

    return (
        <div className="space-y-6 p-1">
            <input ref={fileInputRef} type="file" accept=".csv,text/csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" className="hidden" onChange={handleImportFile} />

            {canCategoryPost &&
                <div className="flex items-center justify-end gap-3">
                    <Button variant="primary" className="w-32" onClick={() => setIsAddDialogOpen(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" /> {t('addCategory')}
                    </Button>
                </div>
            }

            {canCategoryGet &&
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
                        <MiniCard data={categories} isLoading={categoriesLoading} />
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
                                placeholder={t("search") + "..."}
                                className="flex-1 md:w-[200px] lg:w-[240px]"
                            />
                            <div className="flex items-center gap-1 shrink-0">
                                {actions.map((action, idx) => (
                                    <Button key={idx} variant="outline" size="icon" onClick={action.onClick} disabled={action.disabled} className={cn("h-9 w-9 border-gray-200 bg-white shrink-0", action.color)}>
                                        {action.icon}
                                    </Button>
                                ))}
                                {canPost && (
                                    <Button variant="outline" size="icon" disabled={isImporting} onClick={() => fileInputRef.current?.click()} className="h-9 w-9 border-gray-200 bg-white shrink-0 text-gray-500">
                                        <Upload className={cn("h-4 w-4", isImporting && "animate-pulse")} />
                                    </Button>
                                )}
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
