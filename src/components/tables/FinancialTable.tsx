"use client";

import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import FinancialDetailDialog from "../dialog/FinancialDetailDialog";
import { useSettings } from "@/hooks/useSettings";

interface FinancialTableProps {
  data: any[];
  pagination: any;
  isLoading?: boolean;
  page: number;
  setPage: (page: number) => void;
  currencySymbol: string;
}

const FinancialTable = ({ 
  data, 
  pagination, 
  isLoading, 
  page, 
  setPage,
  currencySymbol
}: FinancialTableProps) => {
  const {data: settings} = useSettings();
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const cols = ["transferId", "user", "amount", "status", "date"];

  const handleViewDetails = (item: any) => {
    setSelectedTransaction(item);
    setDialogOpen(true);
  };

  const row = (item: any) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString();

    return (
      <>
        <TableCell className="cursor-pointer" onClick={() => handleViewDetails(item)}>
          <span className="font-mono text-xs">#{item._id.slice(-6).toUpperCase()}</span>
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleViewDetails(item)}>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{item.user?.email}</span>
            <span className="text-xs text-muted-foreground">ID: {item.user?._id?.slice(-6).toUpperCase()}</span>
          </div>
        </TableCell>
        <TableCell className="cursor-pointer font-semibold" onClick={() => handleViewDetails(item)}>
          {currencySymbol}{item.totalAmount}
        </TableCell>
        <TableCell className="capitalize" onClick={(e) => e.stopPropagation()}>
          {item.status}
          {/* <TransferStatusDropdown item={item} /> */}
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleViewDetails(item)}>
          {formattedDate}
        </TableCell>
      </>
    );
  };

  return (
    <>
      <div className="w-full">
        <DataTable
          data={data}
          cols={cols}
          row={row}
          isLoading={isLoading}
          headerClassName="bg-aqua/5 border-none"
          pagination={{
            total: pagination?.totalDocs,
            page: page,
            limit: pagination?.limit,
            setPage,
          }}
        />
      </div>

      <FinancialDetailDialog
        transaction={selectedTransaction}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        currencySymbol={currencySymbol}
      />
    </>
  );
};

export default FinancialTable;