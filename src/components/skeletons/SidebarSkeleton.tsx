import { Skeleton } from "@/components/ui/skeleton"

export function SidebarSkeleton() {
  return (
    <div className="bg-[#F3F5F7] rounded-2xl p-4 sm:p-8 flex flex-col items-center animate-pulse">
      {/* Profile Picture Skeleton */}
      <div className="relative mb-4">
        <Skeleton className="w-24 h-24 rounded-full border-2 border-white bg-gray-200" />
        <Skeleton className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-white bg-gray-300" />
      </div>

      {/* Name Skeleton */}
      <Skeleton className="h-6 w-32 mb-8 bg-gray-200 rounded-md" />

      {/* Navigation Items Skeleton */}
      <nav className="w-full space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="py-3 px-2">
            <Skeleton className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        ))}
      </nav>
    </div>
  )
}