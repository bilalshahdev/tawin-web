"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SpinnerLoader } from "../common/SpinnerLoader";

interface ConfirmDialogProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (closeDialog: () => void) => void;
  loading?: boolean;
  variant?: "default" | "destructive";
  children: React.ReactNode;
  asChild?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "confirm",
  onConfirm,
  loading = false,
  variant = "default",
  children,
  asChild,
}) => {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const closeDialog = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

         <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="h-10"
            >
              {t(`translation.cancel`)}
            </Button>
            <Button
              variant={variant}
              onClick={() => onConfirm?.(closeDialog)}
              disabled={loading}
              className="h-10"
            >
              {loading ? <SpinnerLoader /> : t(`translation.${confirmText}`)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </>
    </Dialog>
  );
};

export default ConfirmDialog;
