"use client";

import { MoreVertical, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { getLocalizedText } from '@/utils/getLocalizedText';

interface StatCardProps {
  data?: any;
  isHome?: boolean;
  isTrendingAllowed?: boolean;
  isLoading?: boolean;
  link?: string;
}

const StatsCard = ({ data, isHome = false, isTrendingAllowed = false, isLoading = false, link }: StatCardProps) => {
  const locale = useLocale() as "en" | "ar";
  const router = useRouter();

  // --- 1:1 SKELETON LOADER ---
  if (isLoading) {
    if (isHome) {
      // Mirrors: Card > CardHeader(mb-1) > CardContent > CardFooter(flex justify-end)
      return (
        <Card className="relative border shadow-sm text-start">
          {/* Mirrors: absolute MoreVertical icon top-right */}
          <div className="absolute ltr:right-4 rtl:left-4 top-6">
            <Skeleton className="h-5 w-5 rounded-sm" />
          </div>

          {/* Mirrors: CardHeader className='mb-1' > CardTitle (text-lg font-bold) + CardDescription (text-xs) */}
          <CardHeader className='mb-1'>
            <Skeleton className="h-7 w-32" /> {/* CardTitle: text-lg font-bold */}
            <Skeleton className="h-3 w-20" /> {/* CardDescription: text-xs */}
          </CardHeader>

          {/* Mirrors: CardContent > div(flex items-center gap-2) > value(text-3xl) + trend(text-sm) > footerLabel(text-xs mt-1) */}
          <CardContent>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />  {/* value: text-3xl font-semibold */}
              <Skeleton className="h-5 w-24" />  {/* trend + changeLabel: text-sm */}
            </div>
            <Skeleton className="h-3 w-36 mt-1" /> {/* footerLabel: text-xs mt-1 */}
          </CardContent>

          {/* Mirrors: CardFooter className="flex justify-end" > Button size="xs" */}
          <CardFooter className="flex justify-end">
            <Skeleton className="h-7 w-16 rounded-md" />
          </CardFooter>
        </Card>
      );
    }

    // Mirrors: Card > CardContent > div(flex justify-between mb-2) > div(flex flex-col) > div(flex items-center gap-3) > div(flex items-center gap-4 mt-2)
    return (
      <Card className="border shadow-none">
        <CardContent>
          {/* Mirrors: div className="flex justify-between items-start mb-2" > h3(text-lg font-bold) */}
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-7 w-28" /> {/* h3: text-lg font-bold */}
          </div>

          {/* Mirrors: div className="flex flex-col" */}
          <div className="flex flex-col">
            {/* Mirrors: div className="flex items-center gap-3" > span(text-2xl font-bold) + optional trend span */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-16" /> {/* value: text-2xl font-bold */}
              {isTrendingAllowed && (
                <Skeleton className="h-4 w-12" />
              )}
            </div>

            {/* Mirrors: div className="flex items-center gap-4 mt-2" > label1 + label2 (text-xs) */}
            <div className="flex items-center gap-4 mt-2">
              <Skeleton className="h-3 w-24" /> {/* label1: text-xs */}
              <Skeleton className="h-3 w-24" /> {/* label2: text-xs */}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- ACTUAL DATA DESIGN ---
  const title = getLocalizedText(data?.title, locale);
  const value = data?.value;
  const trend = data?.trend || data?.change;
  const isUp = data?.isUp ?? (data?.changeType === 'increase');
  const subtitle = getLocalizedText(data?.subtitle, locale) || getLocalizedText(data?.footerLabel, locale);

  if (isHome) {
    return (
      <Card className="relative border shadow-sm text-start">

        <CardHeader className='mb-1'>
          <CardTitle className="text-black text-lg font-bold">{title}</CardTitle>
          <CardDescription className="text-gray-400 text-xs">{subtitle}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-semibold text-black">{value}</div>
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isUp ? "text-aqua" : "text-red-500"
            )}>
              <div className={cn(locale === 'ar' && "rtl:scale-x-[-1]")}>
                {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
              <span>{trend}</span>
              {data.changeLabel && (
                <span className="text-black mx-1 font-normal">{getLocalizedText(data.changeLabel, locale)}</span>
              )}
            </div>
          </div>
          {data.footerLabel && (
            <div className="text-xs text-gray-400 font-medium mt-1">
              {getLocalizedText(data.footerLabel, locale)}
              <span className="mx-1 text-purple font-bold">{data.footerValue}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button variant="default" size="xs" onClick={() => router.push(link || "/admin")}>Details</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border shadow-none">
      <CardContent>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-black">{title}</h3>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{value}</span>
            {isTrendingAllowed && (
                <span className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  isUp ? "text-aqua" : "text-red-500"
                )}>
                  <div className={cn(locale === 'ar' && "rtl:scale-x-[-1]")}>
                    {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  </div>
                  {trend}
                </span>
              )}
          </div>

          {(data.label1 || data.label2) && (
            <div className="flex items-center gap-4 mt-2">
              {data.label1 && (
                <span className="text-xs text-muted-foreground">
                  {getLocalizedText(data.label1, locale)}: <span className="font-semibold text-black">{data.label1Value}</span>
                </span>
              )}
              {data.label2 && (
                <span className="text-xs text-muted-foreground">
                  {getLocalizedText(data.label2, locale)}: <span className="font-semibold text-black">{data.label2Value}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;