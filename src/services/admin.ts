import api from "@/lib/axios";

export const getAdminSummary = async (period: string) => {
  const { data } = await api.get("/api/admin/dashboard", {
    params: {
      period,
    },
  });
  return data;
};
