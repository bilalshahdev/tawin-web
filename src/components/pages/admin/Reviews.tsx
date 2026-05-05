"use client";

import { useState, useMemo } from "react";
import WeeklyReportChart from "@/components/charts/WeeklyReportChart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FilterSection from "@/components/FilterSection";
import ReviewsTable from "@/components/tables/ReviewsTable";
import StatsCard from "@/components/card/StatsCard";
import { useReviews, useReviewStats } from "@/hooks/useReviews";
import { useDebounce } from "@/hooks/useDebounce";
import DateRangeFilter, { FilterRange } from "@/components/DateRange";

const Reviews = () => {
  const [period, setPeriod] = useState<FilterRange>("daily");
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isReversed, setIsReversed] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data: reviewStatsResponse, isLoading: reviewsLoading } = useReviewStats({ period });
  
  const statsData = reviewStatsResponse || {};
  const starStats = statsData?.starStats || {};
  const graphData = statsData?.graphData || [];

  const queryParams = useMemo(() => ({
    page,
    limit: 10,
    rating: ratingFilter ?? undefined,
    search: debouncedSearch || undefined,
  }), [page, ratingFilter, debouncedSearch]);

  const { data: reviewsResponse, isLoading, refetch, isFetching } = useReviews(queryParams);

  const rawData = reviewsResponse?.data || [];
  const meta = reviewsResponse?.meta;

  const reviewsData = useMemo(() => {
    return isReversed ? [...rawData].reverse() : rawData;
  }, [rawData, isReversed]);

  const tableStats = [
    {
      label: { en: "Total Reviews", ar: "إجمالي التقييمات" },
      value: statsData?.totalReviews || "0"
    },
    {
      label: { en: "Total Reviewers", ar: "إجمالي المراجعين" },
      value: statsData?.totalReviewers || "0"
    },
    {
      label: { en: "User Rate", ar: "نسبة المستخدمين" },
      value: `${statsData?.userReviewRate || 0}%`
    },
  ];

  const stats = [
    {
      title: { en: "5 Star Reviews", ar: "تقييمات 5 نجوم" },
      value: (starStats[5] || 0).toString(),
      trend: "Excellent",
      isUp: true,
      footerLabel: { en: "Total Count", ar: "إجمالي العدد" },
    },
    {
      title: { en: "4 Star Reviews", ar: "تقييمات 4 نجوم" },
      value: (starStats[4] || 0).toString(),
      trend: "Good",
      isUp: true,
      footerLabel: { en: "Total Count", ar: "إجمالي العدد" },
    },
    {
      title: { en: "3 Star Reviews", ar: "تقييمات 3 نجوم" },
      value: (starStats[3] || 0).toString(),
      trend: "Average",
      isUp: false,
      footerLabel: { en: "Total Count", ar: "إجمالي العدد" },
    },
    {
      title: { en: "2 Star Reviews", ar: "تقييمات نجمتين" },
      value: (starStats[2] || 0).toString(),
      trend: "Poor",
      isUp: false,
      footerLabel: { en: "Total Count", ar: "إجمالي العدد" },
    },
    {
      title: { en: "1 Star Reviews", ar: "تقييمات نجمة واحدة" },
      value: (starStats[1] || 0).toString(),
      trend: "Very Poor",
      isUp: false,
      footerLabel: { en: "Total Count", ar: "إجمالي العدد" },
    },
  ];

  return (
    <div className="space-y-6 p-1">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyReportChart
            data={tableStats}
            title="customerReviewsStatistics"
            chartData={graphData}
            isLoading={reviewsLoading}
            dataKey="count"
            filter={
              <DateRangeFilter
                value={period}
                onChange={(val) => setPeriod(val)}
              />
            }
          />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-4">
          {stats.map((stat, i) => (
            <StatsCard key={i} data={stat} isLoading={reviewsLoading} />
          ))}
        </div>
      </div>

      <Card className="border shadow-none overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6">
          <FilterSection
            data={rawData}
            type="review"
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setPage(1);
            }}
            ratingFilter={ratingFilter}
            setRatingFilter={(val) => {
              setRatingFilter(val);
              setPage(1);
            }}
            reviewsTotal={meta?.total || 0}
            search={search}
            setSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            isReversed={isReversed}
            setIsReversed={setIsReversed}
            onRefetch={refetch}
            isFetching={isFetching}
          />
        </CardHeader>
        <CardContent>
          <ReviewsTable
            data={reviewsData}
            isLoading={isLoading || isFetching}
            meta={meta}
            setPage={setPage}
            page={page}
            ratingFilter={ratingFilter}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;