import api from "@/lib/axios";
import { SupplierFormValues } from "@/validations/supplier";

export const getSuppliers = async (params?: { search?: string; page?: number }) => {
  const { data } = await api.get("/api/suppliers", { params });
  return data;
};

export const createSupplier = async (formData: SupplierFormValues) => {
  const { data } = await api.post("/api/suppliers", formData);
  return data;
};

export const updateSupplier = async (id: string, formData: Partial<SupplierFormValues>) => {
  const { data } = await api.patch(`/api/suppliers/${id}`, formData);
  return data;
};

export const deleteSupplier = async (id: string) => {
  const { data } = await api.delete(`/api/suppliers/${id}`);
  return data;
};

export const getSupplierStats = async (params?: { period?: string }) => {
  const { data } = await api.get("/api/suppliers/stats", { params });
  return data.data;
};
