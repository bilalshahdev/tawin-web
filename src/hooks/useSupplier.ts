import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierStats,
} from "@/services/supplier";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SupplierFormValues } from "@/validations/supplier";

export const useGetSuppliers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier created successfully!");
      router.push("/admin/suppliers");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create supplier.");
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: Partial<SupplierFormValues> }) =>
      updateSupplier(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
      toast.success("Supplier updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update supplier.");
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete supplier.");
    },
  });
};

export const useSupplierStats = (params?: { period?: string }) => {
  return useQuery({
    queryKey: ["supplier-stats", params?.period],
    queryFn: () => getSupplierStats(params),
    staleTime: 5 * 60 * 1000,
  });
};
