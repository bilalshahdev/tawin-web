import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  getBrands, 
  getBrandById, 
  createBrand, 
  updateBrand, 
  deleteBrand 
} from "@/services/brand";

export const useBrands = (params?: { page?: number; search?: string }) => {
  return useQuery({
    queryKey: ["brands", params],
    queryFn: () => getBrands(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBrand = (id: string) => {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: () => getBrandById(id),
    enabled: !!id,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      toast.success("Brand created successfully!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create brand.");
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBrand,
    onSuccess: (data) => {
      toast.success("Brand updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brand", data?.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update brand.");
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      toast.success("Brand deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete brand.");
    },
  });
};