"use client";

import { FilterBar } from "@/components/pages/web/shop/Filterbar";
import { ProductCard } from "@/components/card/ProductCard";
import { Button } from "@/components/ui/button";
import ContactSection from "@/components/pages/web/shop/ContactSection";
import { useEffect, useState } from "react";
import { getGridClasses } from "@/utils/getGridClasses";
import Hero from "./Hero";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/common/Container";
import { useProducts, useProductsByCategory } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";

const PAGE_LIMIT = 8;

const Shop = () => {
  const t = useTranslations("translation");
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category");

  // Pagination state
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<Product[]>([]);

  const { data: productsData, isLoading, isFetching, error } = category
    ? useProductsByCategory(category, { page, limit: PAGE_LIMIT })
    : useProducts({ page, limit: PAGE_LIMIT });

  const meta = productsData?.meta;
  const incoming: Product[] = productsData?.data || [];

  const [viewMode, setViewMode] = useState("grid4");

  // Reset accumulated list when category changes
  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [category]);

  // Append (or replace) products as new pages arrive
  useEffect(() => {
    if (!incoming.length) return;

    setAccumulated((prev) => {
      if (page === 1) return incoming;

      const existingIds = new Set(prev.map((p) => p._id));
      const fresh = incoming.filter((p) => !existingIds.has(p._id));
      return [...prev, ...fresh];
    });
  }, [incoming, page]);

  const handleCategoryChange = (id: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (id === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", id);
    }
    router.push(`/shop?${newParams.toString()}`);
  };

  const handleShowMore = () => {
    if (meta && page < meta.totalPages) {
      setPage((p) => p + 1);
    }
  };

  const hasMore = meta ? page < meta.totalPages : false;
  const isLoadingMore = isFetching && page > 1;

  return (
    <div className="space-y-10">
      <Hero activeCategory={category} isLoading={isLoading} />

      <Container className="space-y-10 mb-14">
        <FilterBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeCategory={category || "all"}
          onCategoryChange={handleCategoryChange}
        />

        {isLoading && page === 1 ? (
          <ProductSkeleton viewMode={viewMode} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-red-100 p-6 rounded-full mb-4">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">{t("errorLoadingProducts")}</h2>
            <Button
              variant="link"
              className="mt-2 text-aqua"
              onClick={() => window.location.reload()}
            >
              {t("tryAgain")}
            </Button>
          </div>
        ) : accumulated.length > 0 ? (
          <>
            <div className={getGridClasses(viewMode)}>
              {accumulated.map((product: Product) => (
                <ProductCard
                  key={product._id}
                  {...(product as any)}
                  isListView={viewMode === "list"}
                />
              ))}
            </div>

            {/* Skeleton loader appears below existing products while next page loads */}
            {isLoadingMore && <ProductSkeleton viewMode={viewMode} />}

            {hasMore && !isLoadingMore && (
              <div className="flex items-center justify-center">
                <Button
                  className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-10 rounded-full"
                  size="sm"
                  onClick={handleShowMore}
                >
                  {t("showMore")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">{t("noProductsFound")}</h2>
            <Button
              variant="link"
              className="mt-2 text-aqua"
              onClick={() => router.push("/shop")}
            >
              {t("viewAllProducts")}
            </Button>
          </div>
        )}
      </Container>

      <ContactSection />
    </div>
  );
};

export default Shop;