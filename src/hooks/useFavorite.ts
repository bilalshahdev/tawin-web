import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites, toggleFavorite } from "@/services/favourite";
import { toast } from "sonner";

export const useFavorites = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: !!token,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      toast.success("Wishlist updated");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};