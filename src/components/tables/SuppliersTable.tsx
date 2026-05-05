"use client";

import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SupplierDetailDialog from "../dialog/SupplierDetailDialog";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import { useTranslations } from "next-intl";

interface SuppliersTableProps {
  data: any[];
  isLoading: boolean;
  pagination: any;
  page: number;
  setPage: (p: number) => void;
  onDelete: (id: string, close: () => void) => void;
  isDeleting: boolean;
  canDelete: boolean;
}

const SuppliersTable = ({
  data,
  isLoading,
  pagination,
  page,
  setPage,
  onDelete,
  isDeleting,
  canDelete,
}: SuppliersTableProps) => {
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const baseCols = ["supplierCode", "supplierName", "phone", "email", "status"];
  const cols = canDelete ? [...baseCols, "action"] : baseCols;

  const handleRowClick = (item: any) => {
    setSelectedSupplier(item);
    setDialogOpen(true);
  };

  const row = (item: any) => (
    <>
      <TableCell className="cursor-pointer font-mono text-xs" onClick={() => handleRowClick(item)}>
        {item.code}
      </TableCell>
      <TableCell className="cursor-pointer font-medium" onClick={() => handleRowClick(item)}>
        {item.name}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {item.phone}
      </TableCell>
      <TableCell className="cursor-pointer text-gray-500" onClick={() => handleRowClick(item)}>
        {item.email}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        <div className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", item.isActive ? "bg-aqua" : "bg-red-500")} />
          <span className={cn("text-xs font-medium", item.isActive ? "text-aqua" : "text-red-600")}>
            {item.isActive ? t("active") : t("inactive")}
          </span>
        </div>
      </TableCell>

      {canDelete && (
        <TableCell>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <ConfirmDialog
              title={tConfirm("delete.title", { value: t("supplier") })}
              description={tConfirm("delete.description", { value: t("supplier") })}
              variant="destructive"
              loading={isDeleting}
              onConfirm={(close) => onDelete(item._id, close)}
              asChild
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                <Trash2 size={16} />
              </Button>
            </ConfirmDialog>
          </div>
        </TableCell>
      )}
    </>
  );

  return (
    <>
      <DataTable
        data={data}
        cols={cols}
        row={row}
        isLoading={isLoading}
        headerClassName="bg-aqua/5 border-none"
        pagination={{
          total: pagination?.totalDocs || data.length,
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          setPage,
        }}
      />

      <SupplierDetailDialog
        supplier={selectedSupplier}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default SuppliersTable;