"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";
import React from "react";

interface WeeklyReportChartProps {
  data?: any[];
  chartData?: any[];
  title?: string;
  filter?: React.ReactNode;
  dataKey?: string;
  isLoading?: boolean;
}

export default function WeeklyReportChart({
  data,
  chartData,
  title,
  filter,
  dataKey = "count",
  isLoading = false,
}: WeeklyReportChartProps) {
  const t = useTranslations("translation");
  const locale = useLocale() as "en" | "ar";

  // --- 1:1 SKELETON LOADER ---
  if (isLoading) {
    return (
      <Card className="border shadow-none">
        {/* Mirrors: CardHeader flex flex-row items-center justify-between space-y-0 pb-7 */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <Skeleton className="h-6 w-36" />   {/* CardTitle: text-lg font-bold */}
          {/* filter area: flex items-center gap-3 — render 2 placeholder filter pills */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Mirrors: flex justify-between px-6 sm:px-10 py-6 border-b border-gray-50 */}
          <div className="flex justify-between px-6 sm:px-10 py-6 border-b border-gray-50">
            {/* Mirrors 3 stat items: text-center > value(text-2xl font-bold) + label(text-xs mt-1) */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-16 mx-auto" />         {/* value: text-2xl font-bold */}
                <Skeleton className="h-2.5 w-14 mx-auto mt-1" />  {/* label: text-xs mt-1 */}
              </div>
            ))}
          </div>

          {/* Mirrors: h-[320px] w-full pt-10 pb-4 pr-4 chart area */}
          <div className="h-[320px] w-full pt-10 pb-4 pr-4 px-6 flex flex-col justify-between">
            {/* Fake chart bars to mimic AreaChart silhouette */}
            <div className="flex-1 flex items-end gap-2 pb-6">
              {[40, 65, 45, 80, 55, 90, 60, 75, 50, 85, 45, 70].map((h, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            {/* Mirrors: XAxis tick row */}
            <div className="flex justify-between px-1">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-2.5 w-8" /> /* XAxis labels: fontSize 11 */
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- ACTUAL DATA DESIGN ---
  return (
    <Card className="border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-lg font-bold">
          {t(title || "weeklyReport")}
        </CardTitle>
        <div className="flex items-center gap-3">{filter}</div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex justify-between px-6 sm:px-10 py-6 border-b border-gray-50">
          {data?.map((stat: any, i: number) => (
            <div key={i} className="text-center relative cursor-pointer group">
              <div className="text-xl sm:text-2xl font-bold text-black">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">
                {typeof stat.label === "object" ? stat.label[locale] : t(stat.label)}
              </div>
            </div>
          ))}
        </div>

        <div className="h-[320px] w-full pt-10 pb-4 pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAqua" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-aqua)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--brand-aqua)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f1f1" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                dy={10}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
              />
              <Tooltip
                cursor={{ stroke: "var(--brand-aqua)", strokeWidth: 1, strokeDasharray: "5 5" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-lg text-center relative mb-2">
                        <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">{label}</p>
                        <p className="text-lg font-bold text-aqua">
                          {dataKey === "spend" ? `${payload[0].value.toLocaleString()}` : payload[0].value}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {t(dataKey === "spend" ? "totalSpend" : dataKey)}
                        </p>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100" />
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="var(--brand-aqua)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAqua)"
                activeDot={{ r: 6, fill: "#fff", stroke: "var(--brand-aqua)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}