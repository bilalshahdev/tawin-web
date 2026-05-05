"use client";

import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { cn } from "@/lib/utils";
import { Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConstructionBasketDetailDialog from "../dialog/ConstructionBasketDetailDialog";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import { useTranslations } from "next-intl";
import getStatusColor from "@/utils/getStatusColor";
import { useUpdateBasketRequestStatus, useDeleteBasketRequest } from "@/hooks/useBasket";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":  return <Clock size={14} className="text-orange-500" />;
    case "approved": return <CheckCircle size={14} className="text-green-500" />;
    case "rejected": return <XCircle size={14} className="text-red-500" />;
    default:         return null;
  }
};

const StatusBadge = ({ status, t, getStatusColor }: any) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 h-8 px-3 border rounded-md font-semibold text-xs capitalize",
      getStatusColor(status)
    )}
  >
    {getStatusIcon(status)}
    {t(status)}
  </span>
);

export const StatusDropdown = ({ item, t, getStatusColor }: any) => {
  const [currentStatus, setCurrentStatus] = useState(item.constructionBasket.status);
  const { mutate: updateStatus } = useUpdateBasketRequestStatus();

  const handleStatusChange = (newStatus: string) => {
    updateStatus(
      { id: item._id, status: newStatus },
      {
        onSuccess: () => {
          setCurrentStatus(newStatus);
        },
      }
    );
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger
        className={cn(
          "h-8 w-[140px] px-2 border rounded-md transition-all outline-none focus:ring-0 font-semibold text-xs",
          getStatusColor(currentStatus)
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-orange-500" />
            <span>{t("pending")}</span>
          </div>
        </SelectItem>
        <SelectItem value="approved" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" />
            <span>{t("approved")}</span>
          </div>
        </SelectItem>
        <SelectItem value="rejected" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-red-500" />
            <span>{t("rejected")}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

interface ConstructionBasketTableProps {
  data: any[];
  activeTab: string;
  isLoading?: boolean;
  meta?: any;
  setPage: (page: number) => void;
  onDelete?: (id: string, callback: () => void) => void;
  isDeleting?: boolean;
}

const ConstructionBasketTable = ({
  data,
  activeTab,
  isLoading,
  meta,
  setPage,
  isDeleting,
}: ConstructionBasketTableProps) => {
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");
  const [selectedBasket, setSelectedBasket] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate: deleteBasket } = useDeleteBasketRequest();

  const auth = useSelector((state: RootState) => state.auth.staff);
  const isStaff = auth?.role === "staff";

  const basketPermissions: string[] =
    auth?.permissions?.find((p: any) => p.module === "construction-basket")?.operations ?? [];

  const canDelete = isStaff ? basketPermissions.includes("delete") : true;
  const canPatch = isStaff
    ? (basketPermissions.includes("update") || basketPermissions.includes("patch"))
    : true;

  const baseCols = ["basketCode", "fullName", "phoneNumber", "occupation", "propertyType", "status"];
  const cols = canDelete ? [...baseCols, "action"] : baseCols;

  const filteredData = data?.filter((item) => {
    return activeTab === "All Applications" || item.constructionBasket.status === activeTab;
  });

  const handleRowClick = (item: any) => {
    setSelectedBasket(item);
    setDialogOpen(true);
  };

  const handleDelete = (id: string, closeDialog: () => void) => {
    deleteBasket(id, {
      onSuccess: () => {
        closeDialog();
      },
    });
  };

  const row = (item: any) => (
    <>
      <TableCell
        className="text-muted-foreground cursor-pointer"
        onClick={() => handleRowClick(item)}
      >
        #{item._id.slice(-6)}
      </TableCell>
      <TableCell
        className="font-medium cursor-pointer capitalize"
        onClick={() => handleRowClick(item)}
      >
        {item.constructionBasket.fullRegistrationName}
      </TableCell>
      <TableCell
        className="cursor-pointer text-sm"
        onClick={() => handleRowClick(item)}
      >
        <span dir="ltr">{item.constructionBasket.phoneNumber}</span>
      </TableCell>
      <TableCell
        className="cursor-pointer capitalize"
        onClick={() => handleRowClick(item)}
      >
        {item.constructionBasket.occupation}
      </TableCell>
      <TableCell
        className="cursor-pointer capitalize"
        onClick={() => handleRowClick(item)}
      >
        <span className="text-sm font-medium">
          {item.constructionBasket.propertyType}
        </span>
      </TableCell>

      <TableCell onClick={(e) => e.stopPropagation()}>
        {canPatch ? (
          <StatusDropdown item={item} t={t} getStatusColor={getStatusColor} />
        ) : (
          <StatusBadge
            status={item.constructionBasket.status}
            t={t}
            getStatusColor={getStatusColor}
          />
        )}
      </TableCell>

      {canDelete && (
        <TableCell>
          <div className="flex items-center gap-2">
            <div onClick={(e) => e.stopPropagation()}>
              <ConfirmDialog
                title={tConfirm("delete.title", { value: t("basket") })}
                description={tConfirm("delete.description", { value: t("basket") })}
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
                  disabled={isDeleting}
                >
                  <Trash2 size={16} />
                </button>
              </ConfirmDialog>
            </div>
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
        headerClassName="bg-aqua/5 border-none"
        isLoading={isLoading}
        pagination={{
          total: meta?.totalDocs || 0,
          page: meta?.page || 1,
          limit: meta?.limit || 10,
          setPage,
        }}
      />

      <ConstructionBasketDetailDialog
        basket={selectedBasket}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default ConstructionBasketTable;