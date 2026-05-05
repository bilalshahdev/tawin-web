// @services/basket.ts (or wherever your products services are)
import api from "@/lib/axios";

export interface BasketApplicationData {
  fullRegistrationName: string;
  phoneNumber: string;
  occupation: string;
  unifiedCard: string;
  residenceCard: string;
  propertyArea: string;
  propertyType: "Leasehold" | string; // Matches your schema
  monthlyIncome: number;
  country: string;
}

export const applyForBasket = async (payload: BasketApplicationData) => {
  const { data } = await api.post("/api/users/apply-for-basket", payload);
  return data;
};

export const getAdminBasketRequests = async (params?: {
  page?: number;
  status?: string;
  search?: string;
}) => {
  const { data } = await api.get("/api/admin/construction-basket-requests", { params });
  return data.data;
};

export const updateBasketRequestStatus = async (id: string, status: string) => {
  const { data } = await api.patch(`/api/admin/construction-basket-requests/${id}/status`, { status });
  return data;
};

export const deleteBasketRequest = async (id: string) => {
  const { data } = await api.delete(`/api/admin/construction-basket-requests/${id}`);
  return data;
};
