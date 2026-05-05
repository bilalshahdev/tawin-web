import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCouponsAdmin,
  createCouponAdmin,
  getCouponStatsAdmin,
  updateCouponAdmin,
  deleteCouponAdmin,
  toggleCouponStatusAdmin,
  validateCoupon,
  ValidateCouponRequest
} from "@/services/coupon";
import { toast } from "sonner";
import { CouponFormData } from "@/types/coupon";

export const useCouponsAdmin = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["coupons", "admin", params],
    queryFn: () => getCouponsAdmin(params),
    staleTime: 3 * 60 * 1000,
  });
};

export const useCouponStatsAdmin = () => {
  return useQuery({
    queryKey: ["coupons", "admin", "stats"],
    queryFn: getCouponStatsAdmin,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCouponAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CouponFormData) => createCouponAdmin(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin", "stats"] });
      toast.success("Coupon created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create coupon.");
    },
  });
};

export const useUpdateCouponAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CouponFormData> }) =>
      updateCouponAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin"] });
      toast.success("Coupon updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update coupon.");
    },
  });
};

export const useDeleteCouponAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCouponAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin", "stats"] });
      toast.success("Coupon deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete coupon.");
    },
  });
};

export const useToggleCouponStatusAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleCouponStatusAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["coupons", "admin", "stats"] });
      toast.success("Coupon status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to toggle coupon status.");
    },
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (request: ValidateCouponRequest) => validateCoupon(request),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid coupon code.");
    },
  });
};
