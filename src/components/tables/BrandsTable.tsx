"use client";

import { useState, useMemo } from "react";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { cn } from "@/lib/utils";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandDetailDialog from "../dialog/BrandDetailDialog";
import ConfirmDialog from "../dialog/ConfirmDialog";
import AddBrandDialog from "../dialog/AddBrandDialog";
import { useLocale, useTranslations } from "next-intl";
import MyImage from "../MyImage";
import { useDeleteBrand } from "@/hooks/useBrand";
import { getLocalizedText } from "@/utils/getLocalizedText";

const BrandsTable = ({
  data,
  activeTab,
  isLoading,
  meta,
  setPage,
  canPatch,
  canDelete,
}: {
  data: any[];
  activeTab: string;
  isLoading: boolean;
  meta?: any;
  setPage: (p: number) => void;
  canPatch?: boolean;
  canDelete?: boolean;
}) => {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");

  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBrand, setEditBrand] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { mutate: deleteBrand, isPending: isDeleting } = useDeleteBrand();

  const cols = useMemo(() => {
    const baseCols = ["brandCode", "brandName", "registrationDate", "brandLogo", "status"];
    if (canPatch || canDelete) {
      baseCols.push("action");
    }
    return baseCols;
  }, [canPatch, canDelete]);

  const filteredData = data.filter((item) => {
    const statusLabel = item.isActive ? "Active" : "Closed";
    return activeTab === "All Brands" || statusLabel === activeTab;
  });

  const handleRowClick = (item: any) => {
    setSelectedBrand(item);
    setDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setEditBrand(item);
    setEditDialogOpen(true);
  };

  const row = (item: any) => {
    const isActive = item.isActive;
    const statusText = isActive ? t("active") : t("closed");
    const regDate = new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US');

    return (
      <>
        <TableCell className="text-muted-foreground cursor-pointer" onClick={() => handleRowClick(item)}>
          {item.slug?.toUpperCase().substring(0, 8) || "N/A"}
        </TableCell>
        <TableCell className="font-medium cursor-pointer" onClick={() => handleRowClick(item)}>
          {getLocalizedText(item.name, locale)}
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          {regDate}
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          <div className="relative h-10 w-10 border rounded-md overflow-hidden bg-gray-50">
            <MyImage src={item.image} alt={item.name.en} width={256} height={256} />
          </div>
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          <div className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-aqua" : "bg-red-500")} />
            <span className={cn("text-xs font-medium", isActive ? "text-aqua" : "text-red-600")}>
              {statusText}
            </span>
          </div>
        </TableCell>
        {(canPatch || canDelete) && (
          <TableCell>
            <div className="flex items-center gap-2">
              {canPatch && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-aqua"
                  onClick={(e) => handleEditClick(e, item)}
                >
                  <Pencil size={16} />
                </Button>
              )}

              {canDelete && (
                <ConfirmDialog
                  title={tConfirm("delete.title", { value: t("brand") })}
                  description={tConfirm("delete.description", { value: t("brand") })}
                  variant="destructive"
                  loading={isDeleting}
                  onConfirm={(closeDialog) => {
                    deleteBrand(item._id, {
                      onSuccess: () => closeDialog(),
                    });
                  }}
                  asChild
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </ConfirmDialog>
              )}
            </div>
          </TableCell>
        )}
      </>
    );
  };

  return (
    <>
      <DataTable
        data={filteredData}
        cols={cols}
        row={row}
        isLoading={isLoading}
        headerClassName="bg-aqua/5 border-none"
        pagination={{
          total: meta?.totalDocs || 0,
          page: meta?.page || 1,
          limit: meta?.limit || 10,
          setPage
        }}
      />

      <BrandDetailDialog
        brand={selectedBrand}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />

      <AddBrandDialog
        open={editDialogOpen}
        onOpenChange={(val) => {
          setEditDialogOpen(val);
          if (!val) setEditBrand(null);
        }}
        brand={editBrand}
      />
    </>
  );
};

export default BrandsTable;