import api from "@/lib/axios";

export const getAppSettings = async () => {
  const { data } = await api.get("/api/settings");
  return data.data;
};

export const updateAdminSettings = async (formData: FormData) => {
  const { data } = await api.patch("/api/settings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};