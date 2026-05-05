import api from "@/lib/axios";

export const getNotifications = async (params?: PaginationParams) => {
  const { data } = await api.get("/api/notifications", { params });
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const { data } = await api.patch("/api/notifications/read-all");
  return data;
};

export const markNotificationAsRead = async (id: string) => {
  const { data } = await api.patch(`/api/notifications/${id}/read`);
  return data;
};