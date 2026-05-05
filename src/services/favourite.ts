import api from "@/lib/axios";

export const getFavorites = async () => {
  const { data } = await api.get("/api/favorite");
  return data;
};

export const toggleFavorite = async (productId: string) => {
  const { data } = await api.post("/api/favorite", { productId });
  return data;
};