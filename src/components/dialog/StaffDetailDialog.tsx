"use client";

import { cn } from "@/lib/utils";
import { Copy, Phone, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import MyImage from "@/components/MyImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Backend Types
type Operation = 'get' | 'post' | 'patch' | 'put' | 'delete';
type StaffModule = 
    | 'dashboard' | 'orders' | 'users' | 'staff' | 'products'
    | 'construction-basket' | 'reviews' | 'suppliers' | 'coupon codes'
    | 'financial transfers' | 'brand' | 'stock';

interface IPermission {
    module: StaffModule;
    operations: Operation[];
}

interface IStaff {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    password?: string;
    phone?: string;
    profileImage?: string;
    lastLogout?: Date;
    permissions: IPermission[];
    role: "staff";
    createdAt?: Date;
    updatedAt?: Date;
}

export default function StaffDetailDialog({
  staff,
  open,
  onClose,
}: {
  staff: IStaff | null;
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("translation");

  if (!staff) return null;

  const staffName = `${staff.firstName} ${staff.lastName}`;
  const isActive = staff.isActive;
  const regDate = staff.createdAt ? new Date(staff.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : "N/A";
  const lastLogout = staff.lastLogout ? new Date(staff.lastLogout).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') : "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-0 pb-3 overflow-hidden border border-gray-100 shadow-xl">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-gray-800 leading-snug">
                {staffName}
              </DialogTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-gray-400 truncate">{staff.email}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(staff.email)}
                  className="text-purple-500 hover:text-aqua transition-colors shrink-0"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Staff Info */}
          <div>
            <p className="text-xs text-gray-400 mb-2">{t("staffInfo") || "Staff Information"}</p>
            <div className="space-y-2">
              {staff.phone && (
                <div className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2.5">
                  <Phone size={15} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">{staff.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2.5">
                <Shield size={15} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 font-medium capitalize">{staff.role}</span>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div>
            <p className="text-xs text-gray-400 mb-2">{t("activity")}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-600">{t("status")}:</span>
                <span className={cn("text-sm font-semibold", isActive ? "text-aqua" : "text-red-500")}>
                  {isActive ? (t("active") || "Active") : (t("inactive") || "Inactive")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-600">
                  {t("joinedDate")}: <span className="font-medium text-gray-700">{regDate}</span>
                </span>
              </div>
              {staff.lastLogout && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600">
                    {t("lastLogout")}: <span className="font-medium text-gray-700">{lastLogout}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Permissions */}
          {staff.permissions && staff.permissions.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">{t("permissions") || "Permissions"}</p>
              <div className="space-y-1">
                {staff.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {permission.module}:
                    </span>
                    <span className="text-xs text-gray-500">
                      {permission.operations.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}