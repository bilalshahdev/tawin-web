"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "@/components/MyImage";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { cn } from "@/lib/utils";
import { CheckCircle, Truck, Package, XCircle, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderDetailDialog from "@/components/dialog/OrderDetailDialog";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUpdateOrderStatus } from "@/hooks/useOrder";
import { useSettings } from "@/hooks/useSettings";
import { RootState } from "@/store/store";

interface OrderTableProps {
  data: any[];
  pagination: any;
  isLoading?: boolean;
  page: number;
  setPage: (page: number) => void;
  onDelete?: (id: string, callback: () => void) => void;
  isDeleting?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":    return "text-orange-600 bg-orange-100 border-orange-200";
    case "processing": return "text-blue-600 bg-blue-100 border-blue-200";
    case "shipped":    return "text-purple-600 bg-purple-100 border-purple-200";
    case "delivered":  return "text-green-600 bg-green-100 border-green-200";
    case "cancelled":  return "text-red-600 bg-red-100 border-red-200";
    default:           return "text-gray-600 bg-gray-100 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":    return <Clock size={14} className="text-orange-500" />;
    case "processing": return <Package size={14} className="text-blue-500" />;
    case "shipped":    return <Truck size={14} className="text-purple-500" />;
    case "delivered":  return <CheckCircle size={14} className="text-green-500" />;
    case "cancelled":  return <XCircle size={14} className="text-red-500" />;
    default:           return null;
  }
};

const OrderStatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 h-8 px-3 border rounded-md font-semibold text-xs capitalize",
      getStatusColor(status)
    )}
  >
    {getStatusIcon(status)}
    {status}
  </span>
);

const OrderStatusDropdown = ({ item }: { item: any }) => {
  const [currentStatus, setCurrentStatus] = useState(item.status);
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  const handleStatusChange = (newStatus: string) => {
    updateOrderStatus(
      { id: item._id, status: newStatus },
      { onSuccess: () => setCurrentStatus(newStatus) }
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
            <span>Pending</span>
          </div>
        </SelectItem>
        <SelectItem value="processing" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-blue-500" />
            <span>Processing</span>
          </div>
        </SelectItem>
        <SelectItem value="shipped" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-purple-500" />
            <span>Shipped</span>
          </div>
        </SelectItem>
        <SelectItem value="delivered" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" />
            <span>Delivered</span>
          </div>
        </SelectItem>
        <SelectItem value="cancelled" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-red-500" />
            <span>Cancelled</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

const OrderTable = ({ data, pagination, isLoading, page, setPage, onDelete, isDeleting }: OrderTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations();
  const tConfirm = useTranslations("confirm");

  const { data: settings } = useSettings();

  const auth = useSelector((state: RootState) => state.auth.staff);
  const isStaff = auth?.role === "staff";

  const ordersPermissions: string[] =
    auth?.permissions?.find((p: any) => p.module === "orders")?.operations ?? [];

  // Staff users follow the permissions array; everyone else (admin) has full access
  const canDelete = isStaff ? ordersPermissions.includes("delete") : true;
  const canPatch = isStaff ? ordersPermissions.includes("patch") : true;

  const baseCols = ["orderId", "customer", "product", "date", "price", "payment", "status"];
  const cols = canDelete ? [...baseCols, "action"] : baseCols;

  const handleRowClick = (item: any) => {
    setSelectedOrder(item);
    setDialogOpen(true);
  };

  const row = (item: any, index: number, locale: "en" | "ar") => {
    const firstItem = item.items?.[0]?.product;
    const formattedDate = new Date(item.createdAt).toLocaleDateString();

    return (
      <>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          <span className="font-mono text-xs">#{item._id.slice(-6).toUpperCase()}</span>
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{item.user?.firstName} {item.user?.lastName}</span>
            <span className="text-xs text-muted-foreground">{item.phone}</span>
          </div>
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 relative overflow-hidden rounded shrink-0 bg-gray-100">
              <Image src={firstItem?.photo} alt={firstItem?.title[locale] || ""} fill className="object-cover" />
            </div>
            <span className="text-sm font-medium line-clamp-1">
              {firstItem?.title[locale]}
            </span>
          </div>
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          {formattedDate}
        </TableCell>
        <TableCell className="cursor-pointer font-semibold" onClick={() => handleRowClick(item)}>
          {settings?.currencySymbol || "$"}{item.finalAmount}
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                item.paymentMethod === "COD" ? "bg-orange-400" : "bg-aqua"
              )}
            />
            <span>{item.paymentMethod}</span>
          </div>
        </TableCell>

        <TableCell onClick={(e) => e.stopPropagation()}>
          {canPatch ? (
            <OrderStatusDropdown item={item} />
          ) : (
            <OrderStatusBadge status={item.status} />
          )}
        </TableCell>

        {canDelete && (
          <TableCell>
            <div onClick={(e) => e.stopPropagation()}>
              <ConfirmDialog
                title={tConfirm("delete.title", { value: t("translation.order") })}
                description={tConfirm("delete.description", { value: t("translation.order") })}
                variant="destructive"
                loading={isDeleting}
                onConfirm={(closeDialog) => {
                  if (onDelete) {
                    onDelete(item._id, closeDialog);
                  } else {
                    closeDialog();
                  }
                }}
                asChild
              >
                <button
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50 cursor-pointer disabled:opacity-50"
                  title={t("translation.delete")}
                >
                  <Trash2 size={18} />
                </button>
              </ConfirmDialog>
            </div>
          </TableCell>
        )}
      </>
    );
  };

  return (
    <>
      <div className="w-full">
        <DataTable
          data={data}
          cols={cols}
          row={row}
          isLoading={isLoading}
          headerClassName="bg-aqua/5 border-none"
          pagination={{
            total: pagination?.total,
            page: page,
            limit: pagination?.limit,
            setPage,
          }}
        />
      </div>

      <OrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        currencySymbol={settings?.currencySymbol || "$"}
      />
    </>
  );
};

export default OrderTable;