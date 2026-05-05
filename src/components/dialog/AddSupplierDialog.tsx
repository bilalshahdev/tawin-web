"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { useCreateSupplier } from "@/hooks/useSupplier";
import { toast } from "sonner";
import { SupplierFormValues, supplierSchema } from "@/validations/supplier";

export default function AddSupplierDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const t = useTranslations("translation");
  const { mutate: createSupplier, isPending } = useCreateSupplier();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      code: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = (data: SupplierFormValues) => {
    createSupplier(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md scrollbar-hide overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#004d40]">
            {t("addSupplier")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <Label>
              {t("name")} <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("name")}
              placeholder={t("supplierName")}
              error={!!errors.name}
              errorMessage={errors.name?.message}
              className="rounded-md h-11"
            />
          </div>

          {/* Code */}
          <div className="space-y-1">
            <Label>
              {t("supplierCode")} <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("code")}
              placeholder="SUP-001"
              error={!!errors.code}
              errorMessage={errors.code?.message}
              className="rounded-md h-11"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label>
              {t("phoneNumber")} <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("phone")}
              type="number"
              placeholder="+92..."
              error={!!errors.phone}
              errorMessage={errors.phone?.message}
              className="rounded-md h-11"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>{t("email")}</Label>
            <Input
              {...register("email")}
              placeholder="supplier@example.com"
              error={!!errors.email}
              errorMessage={errors.email?.message}
              className="rounded-md h-11"
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <Label>{t("address")}</Label>
            <Input
              {...register("address")}
              placeholder={t("addressPlaceholder")}
              error={!!errors.address}
              errorMessage={errors.address?.message}
              className="rounded-md h-11"
            />
          </div>

          {/* Action Buttons - Right Aligned */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-28"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="w-28"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}