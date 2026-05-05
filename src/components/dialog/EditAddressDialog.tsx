"use client";

import { useState, useEffect } from "react";
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
import { useUpdateAddress } from "@/hooks/useAuth";

export default function EditAddressDialog({
  open,
  onOpenChange,
  address,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  address: any; // Ideally use a specific Address type
}) {
  const t = useTranslations("translation");
  const updateAddressMutation = useUpdateAddress();

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    label: "",
    zipCode: "",
    isDefault: false,
  });

  // Sync state with the address prop when dialog opens or address changes
  useEffect(() => {
    if (address && open) {
      setFormData({
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "",
        label: address.label || "",
        zipCode: address.zipCode || "",
        isDefault: address.isDefault || false,
      });
    }
  }, [address, open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!formData.street || !formData.city || !formData.country || !formData.zipCode) {
      return;
    }

    updateAddressMutation.mutate(
      { id: address._id, data: formData },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-xl">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-xl font-bold text-[#004d40]">
            {t("editAddress")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-gray-500">{t("street")}</Label>
            <Input
              className="border border-gray-200 bg-white rounded-md h-10 text-gray-700 focus-visible:ring-aqua/40"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-500">{t("city")}</Label>
            <Input
              className="border border-gray-200 bg-white rounded-md h-10 text-gray-700 focus-visible:ring-aqua/40"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-500">{t("state")}</Label>
            <Input
              className="border border-gray-200 bg-white rounded-md h-10 text-gray-700 focus-visible:ring-aqua/40"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-500">{t("country")}</Label>
            <Input
              className="border border-gray-200 bg-white rounded-md h-10 text-gray-700 focus-visible:ring-aqua/40"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-500">{t("label")}</Label>
            <Input
              className="border border-gray-200 bg-white rounded-md h-10 text-gray-700 focus-visible:ring-aqua/40"
              value={formData.label}
              onChange={(e) => handleInputChange("label", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-500">{t("zipCode")}</Label>
            <Input
              className="border border-gray-200 bg-white rounded-md h-10 text-gray-700 focus-visible:ring-aqua/40"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefaultEdit"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange("isDefault", e.target.checked)}
              className="rounded border-gray-300 text-aqua focus:ring-aqua/40"
            />
            <Label htmlFor="isDefaultEdit" className="text-sm text-gray-700">
              {t("setDefaultAddress")}
            </Label>
          </div>

          <div className="flex justify-center gap-3 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="w-32 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md h-10"
              onClick={handleClose}
            >
              {t("cancel")}
            </Button>
            <Button
              size="sm"
              className="w-32 bg-aqua hover:bg-aqua/90 text-white rounded-md h-10 font-medium"
              onClick={handleSubmit}
              disabled={updateAddressMutation.isPending}
            >
              {updateAddressMutation.isPending ? t("updating") : t("update")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}