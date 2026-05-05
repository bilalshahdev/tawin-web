"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/card/ProductCard";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { useGetCategories } from "@/hooks/useCategories";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import { Button } from "@/components/ui/button";

const PAGE_LIMIT = 12;

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $500", min: 100, max: 500 },
  { label: "$500 – $2000", min: 500, max: 2000 },
  { label: "Over $2000", min: 2000, max: Infinity },
];

export default function SearchPage() {
  const t = useTranslations("translation");
  const locale = useLocale() as "en" | "ar";
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const [query] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<Product[]>([]);

  const { data: categoriesData } = useGetCategories({});
  const categories: Category[] = categoriesData?.data || [];

  // Build API params
  const apiParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(query.trim() ? { search: query.trim() } : {}),
      ...(selectedCategory !== "all" ? { category: selectedCategory } : {}),
    }),
    [page, query, selectedCategory]
  );

  const { data: productsData, isLoading, isFetching, error } = useProducts(apiParams);

  const meta = productsData?.meta;
  const incoming: Product[] = productsData?.data || [];

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [query, selectedCategory]);

  useEffect(() => {
    if (!incoming.length) return;

    setAccumulated((prev) => {
      if (page === 1) return incoming;

      const existingIds = new Set(prev.map((p) => p._id));
      const fresh = incoming.filter((p) => !existingIds.has(p._id));
      return [...prev, ...fresh];
    });
  }, [incoming, page]);

  const filtered = useMemo(() => {
    const range = priceRanges[selectedPriceIdx];
    return accumulated.filter(
      (p: any) => p.price >= range.min && p.price < range.max
    );
  }, [accumulated, selectedPriceIdx]);

  const handleShowMore = () => {
    if (meta && page < meta.totalPages) {
      setPage((p) => p + 1);
    }
  };

  const clearAll = () => {
    setSelectedCategory("all");
    setSelectedPriceIdx(0);
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedPriceIdx !== 0;
  const hasMore = meta ? page < meta.totalPages : false;
  const isLoadingMore = isFetching && page > 1;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top bar: result count + mobile filter toggle + clear all */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{meta?.totalDocs ?? filtered.length}</span>{" "}
            {t("resultsFound") ?? "results found"}
            {query && (
              <> {t("searchFor") ?? "for"}{" "}
                <span className="font-medium text-gray-900">"{query}"</span>
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-600 transition-colors whitespace-nowrap"
              >
                {t("clearAll") ?? "Clear all"}
              </button>
            )}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all md:hidden",
                showFilters
                  ? "bg-aqua text-white border-aqua"
                  : "bg-white border-gray-200 text-gray-600"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t("filters") ?? "Filters"}
            </button>
          </div>
        </div>

        <div className="flex gap-8">

          {/* Mobile overlay backdrop */}
          {showFilters && (
            <div
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={cn(
              "hidden md:block w-52 lg:w-60 shrink-0 space-y-6 self-start sticky top-24",
              showFilters && "block! fixed top-0 ltr:left-0 rtl:right-0 h-full w-72 z-50 bg-white p-6 overflow-y-auto shadow-xl"
            )}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between md:hidden mb-2">
              <span className="font-semibold text-gray-900">{t("filters") ?? "Filters"}</span>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {t("category") ?? "Category"}
              </p>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setShowFilters(false);
                  }}
                  className={cn(
                    "ltr:text-left rtl:text-right text-sm px-3 py-2 rounded-lg transition-all",
                    selectedCategory === "all"
                      ? "bg-aqua/10 text-aqua font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {t("allCategories") ?? "All"}
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setSelectedCategory(cat._id);
                      setShowFilters(false);
                    }}
                    className={cn(
                      "ltr:text-left rtl:text-right text-sm px-3 py-2 rounded-lg transition-all",
                      selectedCategory === cat._id
                        ? "bg-aqua/10 text-aqua font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {cat.name?.[locale] || cat.slug}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {t("priceRange") ?? "Price Range"}
              </p>
              <div className="flex flex-col gap-0.5">
                {priceRanges.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPriceIdx(idx);
                      setShowFilters(false);
                    }}
                    className={cn(
                      "ltr:text-left rtl:text-right text-sm px-3 py-2 rounded-lg transition-all",
                      selectedPriceIdx === idx
                        ? "bg-aqua/10 text-aqua font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-600 transition-colors px-3"
              >
                {t("clearAll") ?? "Clear all"}
              </button>
            )}
          </aside>

          {/* Results grid */}
          <div className="flex-1 min-w-0">
            {isLoading && page === 1 ? (
              <ProductSkeleton viewMode="grid4" />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <p className="text-gray-500 text-sm">{t("errorLoadingProducts") ?? "Error loading products"}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <Search className="w-12 h-12 text-gray-200" />
                <p className="text-gray-500 text-sm">{t("noResults") ?? "No results found"}</p>
                {hasActiveFilters && (
                  <button onClick={clearAll} className="text-sm text-aqua hover:underline">
                    {t("clearAll") ?? "Clear filters"}
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filtered.map((product: any) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      image={product.photo}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      isNew={product.isNew}
                      discount={product.discount}
                      category={product.category}
                      rating={product.rating}
                    />
                  ))}
                </div>

                {isLoadingMore && (
                  <div className="mt-6">
                    <ProductSkeleton viewMode="grid4" />
                  </div>
                )}

                {hasMore && !isLoadingMore && (
                  <div className="flex items-center justify-center mt-10">
                    <Button
                      className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-10 rounded-full"
                      size="sm"
                      onClick={handleShowMore}
                    >
                      {t("showMore") ?? "Show more"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}