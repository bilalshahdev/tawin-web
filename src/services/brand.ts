import api from "@/lib/axios";

export const getBrands = async (params?: { page?: number; search?: string }) => {
  const { data } = await api.get("/api/brands", { params });
  return data;
};

export const getBrandById = async (id: string) => {
  const { data } = await api.get(`/api/brands/${id}`);
  return data.data;
};

export const createBrand = async (formData: FormData) => {
  const { data } = await api.post("/api/brands", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateBrand = async ({ id, data }: { id: string; data: FormData }) => {
  const response = await api.patch(`/api/brands/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBrand = async (id: string) => {
  const { data } = await api.delete(`/api/brands/${id}`);
  return data;
};