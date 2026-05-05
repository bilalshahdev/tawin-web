import api from "@/lib/axios";

export const getCart = async () => {
  const { data } = await api.get("/api/cart");
  return data.data;
};

export const addToCart = async (payload: { productId: string; quantity: number; attributes?: any }) => {
  const { data } = await api.post("/api/cart", payload);
  return data.data;
};

export const updateCartQuantity = async (payload: { productId: string; quantity: number }) => {
  const { data } = await api.patch("/api/cart/quantity", payload);
  return data.data;
};

export const removeFromCart = async (productId: string) => {
  const { data } = await api.delete("/api/cart/remove", {
    data: { productId },
  });
  return data;
};
