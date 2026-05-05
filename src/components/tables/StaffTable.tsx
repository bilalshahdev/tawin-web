"use client";

import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { cn } from "@/lib/utils";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaffDetailDialog from "@/components/dialog/StaffDetailDialog";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import { useTranslations } from "next-intl";
import { useDeleteStaff, useToggleStaffStatus } from "@/hooks/useStaff";
import AddStaffDialog from "../dialog/AddStaffDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle } from "lucide-react";

export const StatusDropdown = ({ item, t }: any) => {
  const [currentStatus, setCurrentStatus] = useState(item.isActive ? "active" : "inactive");
  const { mutate: toggleStaffStatus } = useToggleStaffStatus();

  const handleStatusChange = (newStatus: string) => {
    toggleStaffStatus(item._id, {
      onSuccess: () => {
        setCurrentStatus(newStatus);
      },
    });
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
    >
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
        <SelectItem value="inactive" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-red-500" />
            <span>{t("inactive")}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

const StaffTable = ({
  data,
  activeTab,
  isLoading,
  meta,
  setPage
}: {
  data: any[];
  activeTab: string;
  isLoading: boolean;
  meta?: any;
  setPage: (p: number) => void;
}) => {
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");

  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { mutate: deleteStaff, isPending: isDeleting } = useDeleteStaff();
  const { mutate: toggleStaffStatus, isPending: isToggling } = useToggleStaffStatus();

  const cols = ["staffCode", "name", "email", "phone", "status", "actions"];

  const filteredData = data.filter((item) => {
    const statusLabel = item.isActive ? "Active" : "Closed";
    return activeTab === "All Accounts" || statusLabel === activeTab;
  });

  const handleRowClick = (item: any) => {
    setSelectedStaff(item);
    setDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setEditStaff(item);
    setEditDialogOpen(true);
  };

  const handleToggleStatus = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    toggleStaffStatus(item._id);
  };

  const row = (item: any) => {
    const isActive = item.isActive;
    const staffName = `${item.firstName} ${item.lastName}`;

    return (
      <>
        <TableCell className="text-muted-foreground cursor-pointer" onClick={() => handleRowClick(item)}>
          {`#STF${String(item._id).slice(-6).toUpperCase()}`}
        </TableCell>
        <TableCell className="font-medium cursor-pointer" onClick={() => handleRowClick(item)}>
          {staffName}
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          {item.email}
        </TableCell>
        <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
          {item.phone}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <StatusDropdown item={item} t={t} />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-aqua"
              onClick={(e) => handleEditClick(e, item)}
            >
              <Pencil size={16} />
            </Button>

            <ConfirmDialog
              title={tConfirm("delete.title", { value: t("staff") })}
              description={tConfirm("delete.description", { value: t("staff") })}
              variant="destructive"
              loading={isDeleting}
              onConfirm={(closeDialog) => {
                deleteStaff(item._id, {
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
          </div>
        </TableCell>
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

      <StaffDetailDialog
        staff={selectedStaff}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />

      <AddStaffDialog
        open={editDialogOpen}
        onOpenChange={(val) => {
          setEditDialogOpen(val);
          if (!val) setEditStaff(null);
        }}
        staff={editStaff}
      />
    </>
  );
};

export default StaffTable;