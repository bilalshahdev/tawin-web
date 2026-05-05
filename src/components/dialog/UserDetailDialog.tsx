"use client";

import { cn } from "@/lib/utils";
import { Copy, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MyImage from "../MyImage";
import { useVerifyUser } from "@/hooks/useAuth";
import { SpinnerLoader } from "../common/SpinnerLoader";

export default function UserDetailDialog({
  user,
  open,
  onClose,
}: {
  user: any;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("translation");
  const { mutate, isPending } = useVerifyUser();

  if (!user) return null;

  const isVerified = user.isVerified;
  const statusColor = isVerified ? "text-green-600" : "text-red-500";

  const handleToggleVerification = () => {
    mutate(user._id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
        {/* Header */}
        <DialogHeader className="px-5 pt-5 relative">
          <div className="flex items-center gap-3">
            <MyImage
              src={user.profileImage}
              alt={`${user.firstName} ${user.lastName}`}
              width={256}
              height={256}
              className="h-12 w-12 rounded-full object-cover shrink-0 border border-gray-100"
            />
            <div className="min-w-0">
              <DialogTitle className="capitalize">
                {user.firstName} {user.lastName}
              </DialogTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-gray-400 truncate">{user.username}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(user.username)}
                  className="text-purple-500 hover:text-aqua transition-colors shrink-0"
                >
                  <Copy size={12} />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-gray-400 truncate">{user.email}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(user.email)}
                  className="text-purple-500 hover:text-aqua transition-colors shrink-0"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-2">{t("userInfo")}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2.5">
                <MapPin size={15} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 font-medium">{user.country}</span>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <p className="text-xs text-gray-400 mb-2">{t("activity")}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-600">{t("verified")}:</span>
                <span className={cn("text-sm font-semibold", statusColor)}>
                  {user.isVerified ? t("yes") : t("no")}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button - Aligned to the Bottom Left */}
          <div className="flex justify-end pt-1">
            <Button
              onClick={handleToggleVerification}
              disabled={isPending}
              variant="outline"
              className={cn(
                "rounded-md h-10 font-medium px-6", // Added padding for better look
                isVerified
                  ? "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                  : "bg-green-50 border-green text-green hover:bg-green-100"
              )}
            >
              {isPending
                ? <SpinnerLoader />
                : isVerified
                  ? "Unverify"
                  : "Verify"
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}