import api from "@/lib/axios";

export const createOrder = async (formData: OrderFormData) => {
  const { data } = await api.post("/api/orders", formData);
  return data;
};

export const getOrderById = async (id: string) => {
  const { data } = await api.get(`/api/orders/${id}`);
  return data;
};

export const getOrders = async (params?: { status?: string; page?: number; search?: string }) => {
  const { data } = await api.get(`/api/orders`, { params });
  return data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { data } = await api.patch(`/api/orders/${id}`, { status });
  return data;
};

export const deleteOrder = async (id: string) => {
  const { data } = await api.delete(`/api/orders/${id}`);
  return data;
};

export const getOrderStats = async () => {
  const { data } = await api.get("/api/orders/stats");
  return data;
};
