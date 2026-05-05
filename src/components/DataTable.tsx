"use client";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Pagination } from "./Pagination";

type DataTableProps<T> = {
    data: T[];
    cols: string[];
    row: (row: T, index: number, locale: "en" | "ar") => React.ReactNode;
    tableClassName?: string;
    bodyClassName?: string;
    headClassName?: string;
    headerClassName?: string;
    rowClassName?: string;
    pagination?: {
        total: number | undefined;
        page: number | undefined;
        limit: number | undefined;
        setPage: (page: number) => void;
    };
    showPagination?: boolean;
    isLoading?: boolean;
    skeletonRows?: number;
};

export function DataTable<T>({
    data,
    cols,
    row,
    tableClassName,
    bodyClassName,
    headClassName,
    headerClassName,
    rowClassName,
    pagination = {
        total: 0,
        page: 1,
        limit: 10,
        setPage: () => {},
    },
    showPagination = true,
    isLoading = false,
    skeletonRows = 5,
}: DataTableProps<T>) {
    const t = useTranslations("table");
    const locale = useLocale() as "en" | "ar";
    const { total = 0, page = 1, limit = 10, setPage } = pagination || {};

    useEffect(() => {
        if (!data) return;
        if (data.length === 0 && page && page > 1) {
            const lastValidPage = Math.ceil(total / (limit || 10)) || 1;
            setPage(Math.min(page - 1, lastValidPage));
        }
    }, [data, page, limit, total, setPage]);

    return (
        <div className="flex flex-col gap-4 justify-between md:gap-8 h-full">
            {isLoading ? (
                /* ── Skeleton ── */
                <Table
                    className={cn("h-full", tableClassName)}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                >
                    <TableHeader className={cn(headerClassName)}>
                        <TableRow className={cn(rowClassName)}>
                            {cols.map((_, i) => (
                                <TableHead
                                    className={cn("capitalize", headClassName)}
                                    key={i}
                                >
                                    <Skeleton className="h-4 w-20 rounded-md" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className={cn(bodyClassName)}>
                        {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
                            <TableRow className={cn(rowClassName)} key={rowIdx}>
                                {cols.map((_, colIdx) => (
                                    <TableCell key={colIdx}>
                                        <Skeleton className="h-4 w-24 rounded-md" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : data.length === 0 ? (
                /* ── Empty state ── */
                <div className="h-80 flex items-center justify-center text-muted-foreground text-sm">
                    {t(`search.noData`)}
                </div>
            ) : (
                /* ── Real data ── */
                <Table
                    className={cn("h-full", tableClassName)}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                >
                    <TableHeader className={cn(headerClassName)}>
                        <TableRow className={cn(rowClassName)}>
                            {cols.map((col, i) => (
                                <TableHead
                                    className={cn("capitalize", headClassName)}
                                    key={i}
                                >
                                    {t(`columns.${col}`)}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className={cn(bodyClassName)}>
                        {data.map((r, i) => (
                            <TableRow className={cn(rowClassName)} key={i}>
                                {row(r, i, locale)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {showPagination && pagination && !isLoading && Math.ceil((total ?? 0) / (limit ?? 10)) > 1 && (
                <Pagination
                    pagination={{ total, page, limit }}
                    changePage={(newPage) => setPage(newPage)}
                />
            )}
        </div>
    );
}