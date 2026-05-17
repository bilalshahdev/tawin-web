"use client";

import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { useTranslations } from "next-intl";
import { Trash2, Eye, Edit3 } from "lucide-react";
import MyImage from "../MyImage";
import CategoryDetailDialog from "@/components/dialog/CategoryDetailDialog";
import CategoryFormDialog from "@/components/dialog/CategoryFormDialog";
import { useDeleteCategory } from "@/hooks/useCategories";
import { Category } from "@/types/category";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { getLocalizedText } from "@/utils/getLocalizedText";

const CategoryTable = ({ 
  data, 
  isLoading, 
  pagination 
}: { 
  data: Category[]; 
  isLoading: boolean; 
  pagination?: {
    total: number | undefined;
    page: number | undefined;
    limit: number | undefined;
    setPage: (page: number) => void;
  };
}) => {
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const cols = ["thumbnail", "name", "parent", "actions"];

  const handleView = (item: Category) => {
    setSelectedCategory(item);
    setIsViewOpen(true);
  };

  const handleEdit = (item: Category) => {
    setSelectedCategory(item);
    setIsEditOpen(true);
  };

  const row = (item: Category, index: number, locale: "en" | "ar") => (
    <>
      <TableCell className="w-[100px]">
        <div className="flex justify-start">
          <MyImage
            src={item.thumbnail}
            alt="thumbnail"
            width={36}
            height={36}
            className="w-9 h-9 rounded-md object-contain border bg-slate-50 shadow-sm"
          />
        </div>
      </TableCell>

      <TableCell className="font-semibold text-slate-700 min-w-[150px] capitalize">
        {getLocalizedText(item.name, locale)}
      </TableCell>

      <TableCell className="text-slate-500">
        {item.parentCategory ? (
          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {getLocalizedText(item.parentCategory.name, locale)}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </TableCell>

      <TableCell className="w-[120px]">
        <div className="flex items-center justify-end gap-1 pr-2">
          {/* View Action */}
          <button
            className="text-slate-400 hover:text-aqua transition-colors p-2 rounded-md hover:bg-aqua/10 cursor-pointer"
            onClick={() => handleView(item)}
            title={t("view")}
          >
            <Eye size={18} />
          </button>

          {/* Edit Action */}
          <button
            className="text-slate-400 hover:text-purple-500 transition-colors p-2 rounded-md hover:bg-purple-50 cursor-pointer"
            onClick={() => handleEdit(item)}
            title={t("edit")}
          >
            <Edit3 size={18} />
          </button>

          {/* Delete Action with ConfirmDialog */}
          <ConfirmDialog
            title={tConfirm("delete.title", { value: t("category") })}
            description={tConfirm("delete.description", { value: t("category") })}
            variant="destructive"
            loading={isDeleting}
            onConfirm={(closeDialog) => {
              deleteCategory(item._id, {
                onSuccess: () => closeDialog(),
              });
            }}
            asChild
          >
            <button
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50 cursor-pointer disabled:opacity-50"
              title={t("delete")}
            >
              <Trash2 size={18} />
            </button>
          </ConfirmDialog>
        </div>
      </TableCell>
    </>
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border overflow-hidden">
      <DataTable
        data={data || []}
        cols={cols}
        row={row}
        isLoading={isLoading}
        headerClassName="bg-slate-50/80 border-b"
        tableClassName="w-full"
        pagination={pagination}
      />

      <CategoryDetailDialog
        category={selectedCategory}
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      <CategoryFormDialog
        category={selectedCategory}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
};

export default CategoryTable;