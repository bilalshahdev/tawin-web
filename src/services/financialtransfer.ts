import api from "@/lib/axios";

export const getFinancialTransfers = async (params?: PaginationParams) => {
  const { data } = await api.get("/api/admin/financials", { params });
  return data;
};

export const getFinancialTransferById = async (id: string) => {
  const { data } = await api.get(`/api/admin/financials/${id}`);
  return data.data;
};

export const getFinancialStats = async () => {
  const { data } = await api.get("/api/admin/financial-stats");
  return data;
};

export const updateFinancialTransferStatus = async ({ 
  id, 
  status 
}: { 
  id: string; 
  status: string;
}) => {
  const { data } = await api.patch(`/api/admin/financials/${id}/status`, { status });
  return data;
};

export const deleteFinancialTransfer = async (id: string) => {
  const { data } = await api.delete(`/api/admin/financials/${id}`);
  return data;
};