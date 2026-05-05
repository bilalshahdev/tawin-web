"use client";

import { useState } from "react";
import Image from "@/components/MyImage";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { useDeleteProduct } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";

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
  page,
  setPage,
  canDelete = false,
  canPatch = false,
  canPost = false,
}: ProductTableProps) => {
  const { data: settings } = useSettings();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const router = useRouter();

  // Show actions column only if at least one action is permitted
  const showActionsCol = canDelete || canPatch;

  const baseCols = ["no", "product", "price", "dateCreated"];
  const cols = showActionsCol ? [...baseCols, "actions"] : baseCols;

  const filteredData = data.filter((item) => {
    if (activeTab === "All Products") return true;
    return item.status?.en === activeTab;
  });

  const handleNavigate = (locale: string, slug: string) => {
    router.push(`/${locale}/admin/product-list/${slug}`);
  };

  const row = (item: any, index: number, locale: "en" | "ar") => (
    <>
      <TableCell className="cursor-pointer" onClick={() => handleNavigate(locale, item.slug)}>
        {index + 1}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleNavigate(locale, item.slug)}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 relative overflow-hidden rounded-md border">
            <Image
              src={item?.photo || ""}
              alt={item.title[locale]}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-medium text-sm capitalize">{item.title[locale]}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm font-medium cursor-pointer" onClick={() => handleNavigate(locale, item.slug)}>
        {settings?.currencySymbol}{item.price}
      </TableCell>
      <TableCell className="text-sm cursor-pointer" onClick={() => handleNavigate(locale, item.slug)}>
        {new Date(item.createdAt?.$date || item.createdAt).toLocaleDateString()}
      </TableCell>

      {/* Actions column — only rendered when at least one action is allowed */}
      {showActionsCol && (
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {/* Edit — only if patch is allowed */}
            {canPatch && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-aqua"
                onClick={() => handleNavigate(locale, item.slug)}
              >
                <Edit3 size={16} />
              </Button>
            )}

            {/* Delete — only if delete is allowed */}
            {canDelete && (
              <ConfirmDialog
                title="Delete Product"
                description={`Are you sure you want to delete ${item.title[locale]}?`}
                variant="destructive"
                loading={isDeleting}
                onConfirm={(close) => {
                  deleteProduct(item._id);
                  close();
                }}
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