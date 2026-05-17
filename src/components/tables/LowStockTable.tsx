"use client";

import Image from "@/components/MyImage";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { useDeleteProduct } from "@/hooks/useProducts";
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
  page,
  setPage,
  canDelete,
  canPatch,
  canPost,
}: ProductTableProps) => {
  const { data: settings } = useSettings();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const router = useRouter();

  const cols = ["no", "product", "price", "dateCreated", "action"];

  const filteredData = data.filter((item) => {
    if (activeTab === "All Products") return true;
    return item.status?.en === activeTab;
  });

  const handleNavigate = (locale: string, slug: string) => {
    router.push(`/${locale}/admin/low-stock/${slug}`);
  };

  const row = (item: any, index: number, locale: "en" | "ar") => (
    <>
      <TableCell className="cursor-pointer" onClick={() => handleNavigate(locale, item.slug)}>{index + 1}</TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleNavigate(locale, item.slug)}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 relative overflow-hidden">
            <Image
              src={item?.photo || ""}
              alt={getLocalizedText(item.title, locale)}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-medium text-sm capitalize">{getLocalizedText(item.title, locale)}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm font-medium cursor-pointer" onClick={() => handleNavigate(locale, item.slug)}>{settings?.currencySymbol}{item.price}</TableCell>
      <TableCell className="text-sm cursor-pointer" onClick={() => handleNavigate(locale, item.slug)}>{new Date(item.createdAt?.$date || item.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {canPatch && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-aqua"
              onClick={() => router.push(`/${locale}/admin/low-stock/${item.slug}`)}
            >
              <Edit3 size={16} />
            </Button>
          )}
          {canDelete && (
            <ConfirmDialog
              title="Delete Product"
              description={`Are you sure you want to delete ${getLocalizedText(item.title, locale)}?`}
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
        setPage
      }}
    />
  );
};

export default ProductTable;