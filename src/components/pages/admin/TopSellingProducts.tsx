"use client";

import Image from "next/image";
import { ListFilter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { useTranslations } from "next-intl";
import MyImage from "@/components/MyImage";
import Link from "next/link";

const TopSellingProducts = ({ data, currencySymbol }: { data: any[], currencySymbol?: string }) => {
  const t = useTranslations("translation");

  const cols = ["product", "totalOrders", "price"];

  const row = (item: any, index: number, locale: "en" | "ar") => (
    <>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 relative rounded bg-gray-100 overflow-hidden">
            <MyImage src={item.image} alt={item?.name?.[locale] || "product"} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{item?.name?.[locale] || `#${item._id?.slice(-6)}`}</span>
            <span className="text-xs text-muted-foreground">{t('productCode')}: #{item._id?.slice(-6)}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>{item.totalSold}</TableCell>
      <TableCell>{currencySymbol}{item.price}</TableCell>
    </>
  );

  return (
    <Card className="h-full border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{t("topSellingProducts")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden">
          <DataTable
            cols={cols}
            data={data || []}
            row={row}
            headerClassName="bg-aqua/5 border-none"
            showPagination={false}
          />
        </div>

        <Link href="/admin/product-list" className="flex justify-end mt-4">
          <Button variant="default" size="xs">
            {t("details")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default TopSellingProducts;