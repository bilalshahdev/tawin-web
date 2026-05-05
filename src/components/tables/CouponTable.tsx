"use client";

import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import CouponDetailDialog from "@/components/dialog/CouponDetailDialog";
import AddCouponDialog from "@/components/dialog/AddCouponDialog";
import { useDeleteCouponAdmin, useToggleCouponStatusAdmin } from "@/hooks/useCoupon";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { useSettings } from "@/hooks/useSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";

export const CouponStatusDropdown = ({ item, t }: any) => {
  const [currentStatus, setCurrentStatus] = useState(item.isActive ? "active" : "cancelled");
  const { mutate: toggleCouponStatus } = useToggleCouponStatusAdmin();

  const handleStatusChange = (newStatus: string) => {
    toggleCouponStatus(item._id, {
      onSuccess: () => {
        setCurrentStatus(newStatus);
      },
    });
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger
        className={cn(
          "h-8 w-[120px] px-2 border rounded-md transition-all outline-none focus:ring-0 font-semibold text-xs",
          currentStatus === "active"
            ? "bg-green-50 text-green-600 border-green-200"
            : "bg-red-50 text-red-600 border-red-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" />
            <span>{t("active")}</span>
          </div>
        </SelectItem>
        <SelectItem value="cancelled" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-red-500" />
            <span>{t("cancelled")}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

const CouponsTable = ({
  data,
  isLoading,
  meta,
  setPage,
  canDelete,
  canPatch
}: {
  data: any[];
  isLoading: boolean;
  meta: any;
  setPage: (p: number) => void;
  activeTab: string;
  canDelete: boolean;
  canPatch: boolean;
}) => {
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");

  const { data: settings } = useSettings();

  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: deleteCoupon, isPending: isDeleting } = useDeleteCouponAdmin();

  const cols = [
    "couponCode",
    "type",
    "discountRate",
    "minOrder",
    "usageLimit",
    "expiryDate",
    "status",
    "actions",
  ];

  const handleRowClick = (item: any) => {
    setSelectedCoupon(item);
    setDetailOpen(true);
  };

  const handleEditClick = (item: any) => {
    setSelectedCoupon(item);
    setEditOpen(true);
  };

  const row = (item: any) => (
    <>
      <TableCell className="cursor-pointer font-medium" onClick={() => handleRowClick(item)}>
        {item.code}
      </TableCell>
      <TableCell className="cursor-pointer capitalize" onClick={() => handleRowClick(item)}>
        {item.type || "-"}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {item.type === "percentage"
          ? `${item.value}%`
          : `${item.value} ${settings?.currencySymbol || "$"}`}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {settings?.currencySymbol || "$"}
        {item.minOrderAmount || 0}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        <span className="text-gray-500">{item.usedCount || 0}</span> / {item.usageLimit || 0}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("en-GB") : "-"}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <CouponStatusDropdown item={item} t={t} />
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-blue-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(item);
            }}
            disabled={!canPatch}
          >
            <Edit size={16} />
          </Button>

          <ConfirmDialog
            title={tConfirm("delete.title", { value: t("coupon") })}
            description={tConfirm("delete.description", { value: t("coupon") })}
            variant="destructive"
            loading={isDeleting}
            onConfirm={(closeDialog) => {
              deleteCoupon(item._id, {
                onSuccess: () => closeDialog(),
              });
            }}
            asChild
          >
            <button
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50 cursor-pointer disabled:opacity-50"
              title={t("delete")}
              disabled={isDeleting || !canDelete}
            >
              <Trash2 size={18} />
            </button>
          </ConfirmDialog>
        </div>
      </TableCell>
    </>
  );

  return (
    <>
      <DataTable
        data={data || []}
        cols={cols}
        row={row}
        isLoading={isLoading}
        headerClassName="bg-aqua/5 border-none"
        pagination={{
          total: meta?.totalDocs || 0,
          page: meta?.page || 1,
          limit: meta?.limit || 10,
          setPage,
        }}
      />

      {/* View-only details dialog (opens on row click) */}
      <CouponDetailDialog
        coupon={selectedCoupon}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        currencySymbol={settings?.currencySymbol || "$"}
      />

      {/* Edit dialog (opens on edit icon click, reuses AddCouponDialog) */}
      <AddCouponDialog
        open={editOpen}
        onOpenChange={(val) => {
          setEditOpen(val);
          if (!val) setSelectedCoupon(null);
        }}
        coupon={selectedCoupon}
      />
    </>
  );
};

export default CouponsTable;