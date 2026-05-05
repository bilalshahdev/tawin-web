import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductReviews, createReview, getReviews, deleteReview, getReviewStats } from "@/services/review";
import { toast } from "sonner";

export const useReviews = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => getReviews(params),
  });
};

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      toast.success(data.message || "Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Review deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });
};

export const useReviewStats = (params?: any) => {
  return useQuery({
    queryKey: ["review-stats", params],
    queryFn: () => getReviewStats(params),
  });
};
