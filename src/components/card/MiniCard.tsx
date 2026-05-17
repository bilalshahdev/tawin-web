"use client";

import Image from "@/components/MyImage";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale, useTranslations } from "next-intl";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import CategoryFormDialog from "@/components/dialog/CategoryFormDialog";
import CategoryDetailDialog from "@/components/dialog/CategoryDetailDialog";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import { useDeleteCategory } from "@/hooks/useCategories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLocalizedText } from "@/utils/getLocalizedText";

const MiniCard = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");

  const [editCategory, setEditCategory] = useState<any | null>(null);
  const [detailCategory, setDetailCategory] = useState<any | null>(null);

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="border shadow-none bg-white">
            <CardContent className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-14 w-14 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {data?.map((item: any) => (
        <Card
          key={item._id}
          className="border shadow-none hover:border-aqua transition-colors bg-white group relative cursor-pointer"
          onClick={() => setDetailCategory(item)}
        >
          <CardContent
            className="flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-gray-700 capitalize">
              {getLocalizedText(item.name, locale)}
            </span>
            <div className="h-14 w-14 mr-2 relative overflow-hidden rounded-lg">
              <Image
                src={item.thumbnail}
                alt={getLocalizedText(item.name, locale)}
                fill
                className="object-contain"
              />
            </div>
          </CardContent>

          {/* Three dots menu */}
          <div
            className="absolute top-1.5 ltr:right-1.5 rtl:left-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-slate-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer">
                  <MoreVertical size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-slate-600 focus:text-aqua focus:bg-aqua/10"
                  onSelect={() => setEditCategory(item)}
                >
                  <Pencil size={13} />
                  {t("edit")}
                </DropdownMenuItem>

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
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 text-slate-600 focus:text-red-500 focus:bg-red-50"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 size={13} />
                    {t("delete")}
                  </DropdownMenuItem>
                </ConfirmDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}

      <CategoryDetailDialog
        category={detailCategory}
        open={!!detailCategory}
        onClose={() => setDetailCategory(null)}
      />

      <CategoryFormDialog
        open={!!editCategory}
        onClose={() => setEditCategory(null)}
        category={editCategory}
      />
    </>
  );
};

export default MiniCard;