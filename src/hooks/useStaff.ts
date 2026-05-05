import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getStaff, 
  getStaffStats, 
  getStaffById, 
  createStaff, 
  updateStaff, 
  toggleStaffStatus, 
  deleteStaff 
} from "@/services/staff";
import { toast } from "sonner";

export const useStaff = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () => getStaff(params),
  });
};

export const useStaffStats = () => {
  return useQuery({
    queryKey: ["staff-stats"],
    queryFn: getStaffStats,
  });
};

export const useStaffById = (id: string) => {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => getStaffById(id),
    enabled: !!id,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: (data) => {
      toast.success(data.message || "Staff member created successfully!");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create staff member");
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, staffData }: { id: string; staffData: any }) => 
      updateStaff(id, staffData),
    onSuccess: (data) => {
      toast.success(data.message || "Staff member updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update staff member");
    },
  });
};

export const useToggleStaffStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleStaffStatus,
    onSuccess: (data) => {
      toast.success(data.message || "Staff status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update staff status");
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: (data) => {
      toast.success(data.message || "Staff member deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete staff member");
    },
  });
};
