"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const LogoutDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: LogoutDialogProps) => {
  const t = useTranslations("translation");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{t("confirmLogout")}</DialogTitle>
          <DialogDescription>
            {t("confirmLogoutDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 sm:justify-start mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
            className="w-full rounded-full border-gray-300"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            size="sm"
            className="rounded-full"
          >
            {t("logout")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};