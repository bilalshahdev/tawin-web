"use client";

import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import ReviewDetailDialog from "@/components/dialog/ReviewDetailDialog";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteReview } from "@/hooks/useReviews";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getLocalizedText } from "@/utils/getLocalizedText";

const ReviewsTable = ({
  data,
  isLoading,
  meta,
  setPage,
  page,
  ratingFilter,
}: {
  data: any[];
  isLoading: boolean;
  meta: any;
  setPage: (p: number) => void;
  page: number;
  ratingFilter: number | null;
}) => {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  const auth = useSelector((state: RootState) => state.auth.staff);
  const isStaff = auth?.role === "staff";

  const reviewsPermissions: string[] =
    auth?.permissions?.find((p: any) => p.module === "reviews")?.operations ?? [];

  const canDelete = isStaff ? reviewsPermissions.includes("delete") : true;

  const baseCols = ["productCode", "product", "userName", "rating", "date"];
  const cols = canDelete ? [...baseCols, "actions"] : baseCols;

  const filteredData = (data || []).filter((item) => {
    if (ratingFilter !== null) return item.rating === ratingFilter;
    return true;
  });

  const handleDelete = (reviewId: string, closeDialog: () => void) => {
    deleteReview(reviewId, {
      onSuccess: () => {
        closeDialog();
      },
    });
  };

  const handleRowClick = (item: any) => {
    setSelectedReview(item);
    setDialogOpen(true);
  };

  const row = (item: any) => (
    <>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        #{item._id?.slice(-6) || "N/A"}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {item.product
          ? <span className="text-sm text-gray-700">{getLocalizedText(item.product.title, locale)}</span>
          : <span className="text-sm text-gray-400">—</span>
        }
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {item.user?.firstName} {item.user?.lastName}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {item.rating}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {item.comment}
      </TableCell>

      {canDelete && (
        <TableCell>
          <div onClick={(e) => e.stopPropagation()}>
            <ConfirmDialog
              title={tConfirm("delete.title", { value: t("review") })}
              description={tConfirm("delete.description", { value: t("review") })}
              variant="destructive"
              loading={isDeleting}
              onConfirm={(closeDialog) => {
                handleDelete(item._id, closeDialog);
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
      )}
    </>
  );

  return (
    <>
      <DataTable
        data={filteredData}
        cols={cols}
        row={row}
        isLoading={isLoading}
        headerClassName="bg-aqua/5 border-none"
        pagination={{
          total: meta?.total || 0,
          page: page,
          limit: meta?.limit || 10,
          setPage,
        }}
      />
      <ReviewDetailDialog
        review={selectedReview}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default ReviewsTable;