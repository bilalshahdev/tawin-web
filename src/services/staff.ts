import api from "@/lib/axios";

export const getStaff = async (params?: PaginationParams) => {
  const { data } = await api.get("/api/staff", { params });
  return data;
};

export const getStaffStats = async () => {
  const { data } = await api.get("/api/staff/stats");
  return data.data.summary.cards;
};

export const getStaffById = async (id: string) => {
  const { data } = await api.get(`/api/staff/${id}`);
  return data.data;
};

export const createStaff = async (staffData: any) => {
  const { data } = await api.post("/api/staff", staffData);
  return data;
};

export const updateStaff = async (id: string, staffData: {
  name?: string;
  email?: string;
  role?: string;
  permissions?: string[];
}) => {
  const { data } = await api.patch(`/api/staff/${id}`, staffData);
  return data;
};

export const toggleStaffStatus = async (id: string) => {
  const { data } = await api.patch(`/api/staff/${id}/toggle-status`);
  return data;
};

export const deleteStaff = async (id: string) => {
  const { data } = await api.delete(`/api/staff/${id}`);
  return data;
};
