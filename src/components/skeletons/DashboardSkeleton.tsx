"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header with Title and Dropdown Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-8" /> {/* Title Skeleton */}
        <Skeleton className="h-10 w-28 rounded-md" /> {/* Dropdown Skeleton */}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart and Regional Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-1">
          <SalesByRegionSkeleton />
        </div>
      </div>

      {/* Categories and Financials Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <TopCategoriesSkeleton />
        </div>
        <div className="lg:col-span-2">
          <FinancialTransfersSkeleton />
        </div>
      </div>

      {/* Top Selling Products Row */}
      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between">
               <Skeleton className="h-6 w-48" />
               <Skeleton className="h-8 w-20" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const StatsCardSkeleton = () => (
  <Card className="relative border shadow-sm text-start">
    <CardHeader className="mb-1">
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-3 w-1/4" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-3 w-32 mt-2" />
    </CardContent>
    <div className="flex justify-end p-4">
      <Skeleton className="h-7 w-16" />
    </div>
  </Card>
);

const ChartSkeleton = () => (
  <Card className="border">
    <CardHeader className="flex flex-row items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex justify-between px-10 py-6 border-b border-gray-50">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      <div className="h-[320px] w-full p-8 flex items-end gap-2">
        {[...Array(12)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-full animate-pulse" 
            style={{ 
                height: `${Math.floor(Math.random() * 60) + 20}%`, 
                opacity: 0.15 
            }} 
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

const SalesByRegionSkeleton = () => (
  <Card className="w-full border">
    <CardHeader className="pb-2">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-16" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex items-end gap-1 h-12">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-full w-full" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </CardContent>
  </Card>
);

const TopCategoriesSkeleton = () => (
  <Card className="h-full border">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-16" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="divide-y">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <Skeleton className="h-10 w-10 rounded-md shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const FinancialTransfersSkeleton = () => (
  <Card className="h-full border shadow-none">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <Skeleton className="h-6 w-40" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full bg-aqua/5" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Skeleton className="h-8 w-20" />
      </div>
    </CardContent>
  </Card>
);

export default DashboardSkeleton;