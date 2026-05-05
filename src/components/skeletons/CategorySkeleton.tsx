const CategorySkeleton = ({ count = 6 }: { count?: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col items-center text-center animate-pulse"
                >
                    {/* Circle Skeleton */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-gray-200" />

                    {/* Text Skeleton */}
                    <div className="mt-4 h-3 w-20 bg-gray-200 rounded" />
                </div>
            ))}
        </>
    )
}

export default CategorySkeleton