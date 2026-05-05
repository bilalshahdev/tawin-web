import api from "@/lib/axios";

export const getUserStats = async ({period}: {period?: string}) => {
  const { data } = await api.get("/api/users/stats", { params: { period } });
  return data;
};