import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  getFinancialTransfers, 
  getFinancialTransferById, 
  updateFinancialTransferStatus,
  deleteFinancialTransfer, 
  getFinancialStats
} from "@/services/financialtransfer";

export const useFinancialTransfers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["financial-transfers", params],
    queryFn: () => getFinancialTransfers(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFinancialTransfer = (id: string) => {
  return useQuery({
    queryKey: ["financial-transfer", id],
    queryFn: () => getFinancialTransferById(id),
    enabled: !!id,
  });
};

export const useGetFinancialStats = () => {
  return useQuery({
    queryKey: ["financial-stats"],
    queryFn: () => getFinancialStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateFinancialTransferStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFinancialTransferStatus,
    onSuccess: () => {
      toast.success("Transfer status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["financial-transfers"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update transfer status.");
    },
  });
};

export const useDeleteFinancialTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFinancialTransfer,
    onSuccess: () => {
      toast.success("Transfer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["financial-transfers"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete transfer.");
    },
  });
};