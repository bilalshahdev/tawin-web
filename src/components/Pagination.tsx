"use client";

import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslations, useLocale } from "next-intl";

type PaginationProps = {
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  changePage: (page: number) => void;
};

export function Pagination({ pagination, changePage }: PaginationProps) {
  const { total, page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);
  const t = useTranslations("translation");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // In RTL (ar): Previous → ArrowRight on right side, Next → ArrowLeft on left side
  // In LTR (en): Previous → ArrowLeft on left side, Next → ArrowRight on right side
  const PrevIcon = isRtl ? ArrowRight : ArrowLeft;
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between w-full mt-4 bg-white p-2 rounded-lg">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => changePage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="gap-1 text-gray-700 font-medium border border-gray-200"
      >
        {isRtl ? (
          <>
          <PrevIcon className="h-4 w-4" />
            {t("previous")}
          </>
        ) : (
          <>
            <PrevIcon className="h-4 w-4" />
            {t("previous")}
          </>
        )}
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPages().map((p, i) => (
          <React.Fragment key={i}>
            {p === "..." ? (
              <span className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-md text-gray-700 text-sm">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(Number(p))}
                className={cn(
                  "h-8 w-8 p-0 text-sm font-medium border border-gray-200 transition-colors",
                  page === p
                    ? "bg-aqua text-black border-aqua hover:bg-aqua hover:text-black"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                )}
              >
                {p}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => changePage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="gap-1 text-gray-700 font-medium border border-gray-200"
      >
        {isRtl ? (
          <>
            {t("next")}
            <NextIcon className="h-4 w-4" />
          </>
        ) : (
          <>
            {t("next")}
            <NextIcon className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}