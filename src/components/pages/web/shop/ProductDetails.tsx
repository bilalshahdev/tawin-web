"use client"

import Container from "@/components/common/Container"
import { ProductImageGallery } from "@/components/pages/web/shop/ProductImageGallery"
import { ProductInfo } from "@/components/pages/web/shop/ProductInfo"
import { ProductDescription } from "@/components/pages/web/shop/ProductDescription"
import Reviews from "@/components/pages/web/shop/Reviews"
import Breadcrumb from "@/components/ui/breadcrumb"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useProductBySlug } from "@/hooks/useProducts"
import { useProductReviews } from "@/hooks/useReviews"
import ProductDetailsSkeleton from "@/components/skeletons/ProductDetailsSkeleton"
import ProductError from "@/components/common/ProductError"

interface ProductDetailsProps {
    params: string
}

const ProductDetails = ({ params }: ProductDetailsProps) => {
    const locale = useLocale() as "en" | "ar";
    const t = useTranslations("translation");

    const { data: product, isLoading, error } = useProductBySlug(params);
    const { data: reviewData, isLoading: isReviewLoading } = useProductReviews(product?._id as string);

    if (isLoading) {
        return <ProductDetailsSkeleton />
    }

    if (error || !product) {
        return (
            <ProductError />
        )
    }

    return (
        <Container className="px-4 sm:px-6 space-y-10 pt-8 pb-16">
            <div className="flex items-center justify-between">
                <Breadcrumb
                    items={[
                        { title: t("home"), href: "/home" },
                        { title: t("shop"), href: "/shop" },
                        { title: product.title[locale], href: `#` },
                    ]}
                />
                <Button
                    variant="destructive"
                    size="sm"
                    className="bg-destructive/40 pointer-events-none"
                >
                    {t("remaining")}: {product.remainingPieces} {t("pieces")}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <ProductImageGallery
                    images={product?.images || []}
                    isNew={product.isNewArrival || false}
                    discount={product.discount}
                />

                <ProductInfo
                    product={product}
                />
            </div>

            <ProductDescription
                productKey={product._id}
                productCode={product.slug}
                category={product?.category?.name?.[locale]}
            />

            <Reviews product={product} reviews={reviewData || []} isReviewsLoading={isReviewLoading} />
        </Container>
    )
}

export default ProductDetails