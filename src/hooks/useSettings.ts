import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAppSettings, updateAdminSettings } from "@/services/settings";
import { toast } from "sonner";

export const useSettings = () => {
  return useQuery({
    queryKey: ["appSettings"],
    queryFn: getAppSettings,
    staleTime: 10 * 60 * 1000, 
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminSettings,
    onSuccess: () => {
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update settings");
    },
  });
};
