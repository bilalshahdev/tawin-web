"use client"

import CategoryCard from "@/components/card/CategoryCard"
import { useTranslations } from "next-intl"
import { useGetCategories } from "@/hooks/useCategories"
import CategorySkeleton from "@/components/skeletons/CategorySkeleton";

export default function ShopByCategory() {
    const { data, isLoading, isError } = useGetCategories({ limit: 12, isAdmin: true });
    const categoriesData = data?.data?.categories || [];
    const t = useTranslations("translation")

    return (
        <section className="mt-10">
            <h2 className="text-2xl font-semibold text-center mb-12 text-gray-800">
                {t("shopByCategory")}
            </h2>

            {isError && (
                <div className="text-center text-red-500 font-medium">
                    {t("errorLoadingCategories")}
                </div>
            )}

            {!isError && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-6">
                    {isLoading
                        ? <CategorySkeleton />
                        : categoriesData.map((category: any) => (
                            <CategoryCard key={category._id} data={category} />
                        ))
                    }
                </div>
            )}
        </section>
    )
}