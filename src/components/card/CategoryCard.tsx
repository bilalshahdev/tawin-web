import Link from 'next/link'
import Image from '../MyImage'
import { useLocale } from 'next-intl'

const CategoryCard = ({ data, loading }: { data?: Category, loading?: boolean }) => {
    const locale = useLocale() as "en" | "ar";

    if (loading) {
        return (
            <div className="flex flex-col items-center text-center animate-pulse">
                {/* Circle Skeleton */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-gray-200" />

                {/* Text Skeleton */}
                <div className="mt-4 h-3 w-20 bg-gray-200 rounded" />
            </div>
        )
    }

    return (
        <Link
            href={`/shop?category=${data!._id}`}
            className="group flex flex-col items-center text-center"
        >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden bg-[#F3F5F7] border-2 border-transparent group-hover:border-aqua transition-all duration-300 shadow-sm">
                <Image
                    src={data!.image}
                    alt={data!.name[locale]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <span className="mt-4 text-[13px] md:text-sm font-semibold text-gray-600 group-hover:text-aqua capitalize transition-colors line-clamp-2 px-2">
                {data!.name[locale]}
            </span>
        </Link>
    )
}

export default CategoryCard