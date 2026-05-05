import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailsSkeleton() {
    return (
        <div className="px-4 sm:px-6 space-y-10 pt-8 pb-16 max-w-7xl mx-auto">

            {/* Breadcrumb + top bar */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-8 w-28" />
            </div>

            {/* Main section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Image Gallery Skeleton */}
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-[450px] w-full" />

                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="aspect-square w-full" />
                        ))}
                    </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="flex flex-col gap-5">

                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />

                    <Skeleton className="h-px w-full" />

                    <div className="flex gap-3 items-center">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>

                    <Skeleton className="h-px w-full" />

                    <Skeleton className="h-10 w-40" />

                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-10 flex-1" />
                    </div>

                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Reviews */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-md" />
                ))}
            </div>
        </div>
    )
}