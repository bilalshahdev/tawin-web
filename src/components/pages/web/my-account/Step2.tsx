"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useAllAddresses, useDeleteAddress } from "@/hooks/useAuth";
import AddAddressDialog from "@/components/dialog/AddAddressDialog";
import EditAddressDialog from "@/components/dialog/EditAddressDialog";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";

export default function AddressBook() {
  const t = useTranslations("translation");
  const tConfirm = useTranslations("confirm");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const { data: addresses, isLoading, error } = useAllAddresses();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  const handleEdit = (addr: any) => {
    setSelectedAddress(addr);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">{t("address")}</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          variant="primary"
          className="w-38"
          size="sm"
        >
          <Plus size={16} />
          {t("addAddress")}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">{t("loading")}</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{t("errorLoadingAddresses")}</div>
      ) : addresses?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t("noAddresses")}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses?.map((addr: any) => (
            <div key={addr._id} className="border border-gray-200 rounded-2xl p-6 space-y-4 relative group">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-900 capitalize">
                    {addr.label || t("deliveryAddress")}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs bg-aqua/10 text-aqua px-2 py-1 rounded-full">
                        {t("default")}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-xs text-gray-400 cursor-pointer font-medium hover:text-aqua transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>

                  <ConfirmDialog
                    title={tConfirm("delete.title", { value: t("address") })}
                    description={tConfirm("delete.description", { value: t("address") })}
                    variant="destructive"
                    loading={isDeleting}
                    onConfirm={(closeDialog) => {
                      deleteAddress(addr._id, {
                        onSuccess: () => closeDialog(),
                      });
                    }}
                    asChild
                  >
                    <button className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </ConfirmDialog>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900 capitalize">{addr.street}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {addr.city}, {addr.state}, {addr.country}
                </p>
                <p className="text-sm text-gray-600 capitalize">{addr.zipCode}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddAddressDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <EditAddressDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        address={selectedAddress}
      />
    </div>
  );
}