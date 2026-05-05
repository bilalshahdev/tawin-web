"use client"

import Link from "next/link"
import { ProductCard } from "@/components/card/ProductCard"
import { useTranslations } from "next-intl"
import { useProducts } from "@/hooks/useProducts"
import { Skeleton } from "@/components/ui/skeleton"
import { Product } from "@/types/product"
import ProductSkeleton from "@/components/skeletons/ProductSkeleton"

const BestSellerSection = () => {
    const t = useTranslations("translation")
    const { data: productsData, isLoading, error } = useProducts();
    const products = productsData?.data || [];

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                    {t("bestSellers")}
                </h2>
                <Link href="/shop" className="text-sm font-semibold">
                    {t("viewAll")}
                </Link>
            </div>

            {/* Loading State */}
            {isLoading ? (
               <ProductSkeleton count={4} />
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="bg-red-100 p-4 rounded-full mb-3">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{t("errorLoadingProducts")}</h3>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {products.slice(0, 4).map((product: Product) => (
                        <ProductCard key={product._id} {...product as any} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{t("noProductsFound")}</h3>
                </div>
            )}
        </section>
    )
}

export default BestSellerSection