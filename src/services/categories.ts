import api from "@/lib/axios";
import { Category } from "@/types/category";

export const getCategories = async (params?: { page?: number; limit?: number; isAdmin?: boolean }) => {
  const queryParams = new URLSearchParams();
  queryParams.append('admin', params?.isAdmin ? 'true' : 'false');
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  const { data } = await api.get(`/api/categories?${queryParams.toString()}`);
  return data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const { data } = await api.get(`/api/categories/id/${id}`);
  return data.data;
};

export const createCategory = async (formData: FormData): Promise<Category> => {
  const { data } = await api.post("/api/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateCategory = async ({ id, formData }: { id: string; formData: FormData }): Promise<Category> => {
  const { data } = await api.patch(`/api/categories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/api/categories/${id}`);
};
