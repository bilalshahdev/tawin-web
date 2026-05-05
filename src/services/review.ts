import api from "@/lib/axios";

export const getReviews = async (params?: PaginationParams) => {
  const { data } = await api.get(`/api/reviews`, { params });
  return data;
};

export const getProductReviews = async (productId: string) => {
  const { data } = await api.get(`/api/reviews/product/${productId}`);
  return data.data;
};

export const createReview = async (reviewData: {
  product: string;
  rating: number;
  comment: string;
}) => {
  const { data } = await api.post("/api/reviews", reviewData);
  return data;
};

export const deleteReview = async (reviewId: string) => {
  const { data } = await api.delete(`/api/reviews/${reviewId}`);
  return data;
};

export const getReviewStats = async (params?: any) => {
  const { data } = await api.get('/api/reviews/stats', { params });
  return data.data;
};