"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { useTranslations } from "next-intl";
import Link from "next/link";

const FinancialTransfers = ({data, currencySymbol}: {data: any, currencySymbol?: string}) => {
  const t = useTranslations("translation");
  
  const cols = ["no", "email", "orderDate", "status", "totalAmount"];

  const row = (item: any, index: number) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString();
    const statusColor = item.status === "delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    
    return (
      <>
        <TableCell className="font-mono text-xs">{index + 1}</TableCell>
        <TableCell>{item.user?.email || "N/A"}</TableCell>
        <TableCell>{formattedDate}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}>
              {item.status}
            </span>
          </div>
        </TableCell>
        <TableCell className="font-semibold">{currencySymbol}{item.totalAmount?.toLocaleString()}</TableCell>
      </>
    );
  };

  return (
    <Card className="h-full border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          {t("financialTransfers")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden">
          <DataTable
            cols={cols}
            data={data}
            row={row}
            headerClassName="bg-aqua/5 border-none"
            showPagination={false}
          />
        </div>

        <Link
        href="/admin/financial-transfers" 
        className="flex justify-end mt-4">
          <Button
            variant="default"
            size="xs"
          >
            {t("details")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FinancialTransfers;