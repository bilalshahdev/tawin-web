"use client";

import Image from "@/components/MyImage";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { Archive, Edit3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { useArchiveProduct, useRestoreProduct } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";
import { getLocalizedText } from "@/utils/getLocalizedText";

interface ProductTableProps {
  activeTab: string;
  data: any[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
  };
  page: number;
  setPage: (p: number) => void;
  canDelete?: boolean;
  canPatch?: boolean;
  canPost?: boolean;
}

const ProductTable = ({
  activeTab,
  data,
  isLoading,
  pagination,
  setPage,
  canDelete = false,
  canPatch = false,
}: ProductTableProps) => {
  const { data: settings } = useSettings();
  const { mutate: archiveProduct, isPending: isArchiving } = useArchiveProduct();
  const { mutate: restoreProduct, isPending: isRestoring } = useRestoreProduct();
  const router = useRouter();

  const showActionsCol = canDelete || canPatch;
  const baseCols = ["no", "product", "productCode", "price", "dateCreated"];
  const cols = showActionsCol ? [...baseCols, "actions"] : baseCols;

  const filteredData = data.filter((item) => {
    if (activeTab === "All Products" || activeTab === "Archived") return true;
    return item.status?.en === activeTab;
  });

  const handleNavigate = (locale: string, slug: string) => {
    router.push("/" + locale + "/admin/product-list/" + slug);
  };

  const row = (item: any, index: number, locale: "en" | "ar") => {
    const isArchived = item.isArchived === true;
    const productName = getLocalizedText(item.title, locale) || "Product";

    return (
      <>
        <TableCell className="cursor-pointer" onClick={() => !isArchived && handleNavigate(locale, item.slug)}>
          {index + 1}
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => !isArchived && handleNavigate(locale, item.slug)}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 relative overflow-hidden rounded-md border">
              <Image
                src={item?.photo || ""}
                alt={productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="font-medium text-sm capitalize block truncate">{productName}</span>
              {isArchived && <span className="text-[11px] text-red-500">Archived</span>}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {item.productTag || item._id?.slice(-8) || "-"}
        </TableCell>
        <TableCell className="text-sm font-medium cursor-pointer" onClick={() => !isArchived && handleNavigate(locale, item.slug)}>
          {settings?.currencySymbol}{item.price}
        </TableCell>
        <TableCell className="text-sm cursor-pointer" onClick={() => !isArchived && handleNavigate(locale, item.slug)}>
          {new Date(item.createdAt?.$date || item.createdAt).toLocaleDateString()}
        </TableCell>

        {showActionsCol && (
          <TableCell onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              {canPatch && !isArchived && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-aqua"
                  onClick={() => handleNavigate(locale, item.slug)}
                >
                  <Edit3 size={16} />
                </Button>
              )}

              {canDelete && !isArchived && (
                <ConfirmDialog
                  title="Archive Product"
                  description={"Archive " + productName + "? It will be hidden from customers but kept in history."}
                  loading={isArchiving}
                  onConfirm={(close) => {
                    archiveProduct(item._id);
                    close();
                  }}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                    <Archive size={16} />
                  </Button>
                </ConfirmDialog>
              )}

              {canPatch && isArchived && (
                <ConfirmDialog
                  title="Restore Product"
                  description={"Restore " + productName + " to the active product list?"}
                  loading={isRestoring}
                  onConfirm={(close) => {
                    restoreProduct(item._id);
                    close();
                  }}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-aqua">
                    <RotateCcw size={16} />
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
    <DataTable
      data={filteredData}
      cols={cols}
      row={row}
      headerClassName="bg-aqua/5 border-none"
      isLoading={isLoading}
      pagination={{
        total: pagination?.totalDocs || 0,
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        setPage,
      }}
    />
  );
};

export default ProductTable;
