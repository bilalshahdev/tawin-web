"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddAddress } from "@/hooks/useAuth";
import { type Address, AddressSchema } from "@/validations/auth";

export default function AddAddressDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const t = useTranslations("translation");
  const addAddressMutation = useAddAddress();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Address>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      country: "",
      label: "",
      zipCode: "",
      isDefault: false,
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (data: Address) => {
    addAddressMutation.mutate(data, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#004d40]">
              {t("addAddress")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Street */}
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-500">{t("street")}</Label>
              <Input
                variant="default"
                className="rounded-md h-10"
                placeholder="123 Main St"
                error={!!errors.street}
                errorMessage={errors.street?.message}
                {...register("street")}
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-500">{t("city")}</Label>
              <Input
                variant="default"
                className="rounded-md h-10"
                placeholder="Islamabad"
                error={!!errors.city}
                errorMessage={errors.city?.message}
                {...register("city")}
              />
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <Label>{t("state")}</Label>
              <Input
                variant="default"
                className="rounded-md h-10"
                placeholder="Punjab"
                error={!!errors.state}
                errorMessage={errors.state?.message}
                {...register("state")}
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label>{t("country")}</Label>
              <Input
                variant="default"
                className="rounded-md h-10"
                placeholder="Pakistan"
                error={!!errors.country}
                errorMessage={errors.country?.message}
                {...register("country")}
              />
            </div>

            {/* Label */}
            <div className="space-y-1.5">
              <Label>{t("label")}</Label>
              <Input
                variant="default"
                className="rounded-md h-10"
                placeholder="Home"
                error={!!errors.label}
                errorMessage={errors.label?.message}
                {...register("label")}
              />
            </div>

            {/* Zip Code */}
            <div className="space-y-1.5">
              <Label>{t("zipCode")}</Label>
              <Input
                variant="default"
                className="rounded-md h-10"
                placeholder="44000"
                error={!!errors.zipCode}
                errorMessage={errors.zipCode?.message}
                {...register("zipCode")}
              />
            </div>

            {/* Is Default */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                {...register("isDefault")}
                className="rounded border-gray-300 text-aqua focus:ring-aqua/40"
              />
              <Label htmlFor="isDefault">
                {t("setDefaultAddress")}
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="w-32 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md h-10"
                onClick={handleClose}
                type="button"
              >
                {t("cancel")}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-32 bg-aqua hover:bg-aqua/90 text-white rounded-md h-10 font-medium"
                type="submit"
                disabled={addAddressMutation.isPending}
              >
                {addAddressMutation.isPending ? t("adding") : t("add")}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}