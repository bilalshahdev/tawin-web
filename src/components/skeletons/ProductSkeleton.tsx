import { Skeleton } from "@/components/ui/skeleton"
import { getGridClasses } from "@/utils/getGridClasses"

type Props = {
    count?: number
    viewMode?: string
}

const ProductSkeleton = ({ count = 8, viewMode = "grid4" }: Props) => {
    return (
        <div className={getGridClasses(viewMode)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-[300px] w-ful" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    )
}

export default ProductSkeleton