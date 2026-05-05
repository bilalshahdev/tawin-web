import { useMutation, useQuery } from "@tanstack/react-query";
import { applyForBasket, getAdminBasketRequests, updateBasketRequestStatus, deleteBasketRequest, BasketApplicationData } from "@/services/basket";
import { toast } from "sonner";

export const useApplyForBasket = () => {
  return useMutation({
    mutationFn: (data: BasketApplicationData) => applyForBasket(data),
    onSuccess: () => {
      toast.success("Application submitted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit application");
    },
  });
};

export const useAdminBasketRequests = (params?: {
  page?: number;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["admin", "basket-requests", params?.page, params?.status, params?.search],
    queryFn: () => getAdminBasketRequests(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateBasketRequestStatus = () => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateBasketRequestStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });
};

export const useDeleteBasketRequest = () => {
  return useMutation({
    mutationFn: (id: string) => deleteBasketRequest(id),
    onSuccess: () => {
      toast.success("Request deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete request");
    },
  });
};