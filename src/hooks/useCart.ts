import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartQuantity, removeFromCart } from "@/services/cart";
import { toast } from "sonner";

export const useCart = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!token,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Item added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add item");
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove item");
    },
  });
};