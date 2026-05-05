"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/DataTable";
import { cn } from "@/lib/utils";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserDetailDialog from "@/components/dialog/UserDetailDialog";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import { useTranslations } from "next-intl";
import { useVerifyUser, useDeleteUser } from "@/hooks/useAuth";
import { RootState } from "@/store/store";

interface UserTableProps {
  data: any[];
  pagination: any;
  isLoading?: boolean;
  page: number;
  setPage: (page: number) => void;
}

const getStatusColor = (isVerified: boolean) => {
  return isVerified
    ? "bg-green-50 text-green border-green-200"
    : "bg-red-50 text-red-600 border-red-200";
};

export const StatusDropdown = ({ item, t, getStatusColor }: any) => {
  const [currentStatus, setCurrentStatus] = useState<boolean>(item.isVerified);
  const { mutate: verifyUser } = useVerifyUser();

  const handleChange = (val: string) => {
    const newStatus = val === "verified";
    verifyUser(item._id);
    setCurrentStatus(newStatus);
  };

  return (
    <Select value={currentStatus ? "verified" : "unverified"} onValueChange={handleChange}>
      <SelectTrigger
        className={cn("h-8 w-[140px] px-2 border rounded-md transition-all outline-none focus:ring-0 font-semibold text-xs", getStatusColor(currentStatus))}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="verified" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" />
            <span>{t("translation.verified")}</span>
          </div>
        </SelectItem>
        <SelectItem value="unverified" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-red-500" />
            <span>{t("translation.unverified")}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

// Read-only status badge (no patch permission)
const StatusBadge = ({ isVerified, t, getStatusColor }: any) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 h-8 px-3 border rounded-md font-semibold text-xs",
      getStatusColor(isVerified)
    )}
  >
    {isVerified ? (
      <>
        <CheckCircle size={13} className="text-green-500" />
        {t("translation.verified")}
      </>
    ) : (
      <>
        <XCircle size={13} className="text-red-500" />
        {t("translation.unverified")}
      </>
    )}
  </span>
);

const UserTable = ({ data, pagination, isLoading, page, setPage }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations();
  const tConfirm = useTranslations("confirm");

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  // --- Permission checks ---
  const auth = useSelector((state: RootState) => state.auth.staff);
  const isStaff = auth?.role === "staff";

  const usersPermissions: string[] =
    auth?.permissions?.find((p: any) => p.module === "users")?.operations ?? [];

  // Staff users follow the permissions array; everyone else (admin) has full access
  const canDelete = isStaff ? usersPermissions.includes("delete") : true;
  const canPatch = isStaff ? usersPermissions.includes("patch") : true;
  // -------------------------

  // Build columns based on permissions
  const baseCols = ["userCode", "name", "email", "username", "verified"];
  const cols = canDelete ? [...baseCols, "actions"] : baseCols;

  const handleRowClick = (item: any) => {
    setSelectedUser(item);
    setDialogOpen(true);
  };

  const row = (item: any, index: number) => (
    <>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        #{item._id?.slice(-6) || `USR${index + 1}`}
      </TableCell>
      <TableCell className="cursor-pointer capitalize" onClick={() => handleRowClick(item)}>
        {item.firstName} {item.lastName}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {item.email}
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => handleRowClick(item)}>
        {item.username}
      </TableCell>

      {/* Status: dropdown if patch allowed, badge if not */}
      <TableCell>
        {canPatch ? (
          <StatusDropdown item={item} t={t} getStatusColor={getStatusColor} />
        ) : (
          <StatusBadge isVerified={item.isVerified} t={t} getStatusColor={getStatusColor} />
        )}
      </TableCell>

      {/* Actions column only rendered when delete is allowed */}
      {canDelete && (
        <TableCell>
          <div className="flex items-center gap-2">
            <div onClick={(e) => e.stopPropagation()}>
              <ConfirmDialog
                title={tConfirm("delete.title", { value: t("translation.user") })}
                description={tConfirm("delete.description", { value: t("translation.user") })}
                variant="destructive"
                loading={isDeleting}
                onConfirm={(closeDialog) => {
                  deleteUser(item._id, {
                    onSuccess: () => closeDialog(),
                  });
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
          </div>
        </TableCell>
      )}
    </>
  );

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
            total: pagination?.totalDocs,
            page: page,
            limit: pagination?.limit,
            setPage,
          }}
        />
      </div>

      <UserDetailDialog
        user={selectedUser}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default UserTable;