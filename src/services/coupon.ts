import api from "@/lib/axios";
import { Coupon, CouponFormData, CouponStats } from "@/types/coupon";

export const getCouponsAdmin = async (params?: PaginationParams) => {
  const { data } = await api.get("/api/coupons/admin", { params });
  return data;
};

export const createCouponAdmin = async (formData: CouponFormData | FormData): Promise<Coupon> => {
  const isFormData = formData instanceof FormData;
  const { data } = await api.post("/api/coupons/admin", formData, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return data;
};

export const getCouponStatsAdmin = async (): Promise<CouponStats> => {
  const { data } = await api.get("/api/coupons/admin/stats");
  return data.data;
};

export const updateCouponAdmin = async (id: string, formData: Partial<CouponFormData> | FormData): Promise<Coupon> => {
  const isFormData = formData instanceof FormData;
  const { data } = await api.patch(`/api/coupons/admin/${id}`, formData, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return data;
};

export const deleteCouponAdmin = async (id: string): Promise<void> => {
  await api.delete(`/api/coupons/admin/${id}`);
};

export const toggleCouponStatusAdmin = async (id: string): Promise<Coupon> => {
  const { data } = await api.patch(`/api/coupons/admin/toggle-status/${id}`);
  return data;
};

// User Coupon APIs
export interface ValidateCouponRequest {
  code: string;
}

export interface ValidateCouponResponse {
  isValid: boolean;
  discountAmount: number;
  finalAmount: number;
  message?: string;
}

export const validateCoupon = async (request: ValidateCouponRequest)=> {
  const { data } = await api.post("/api/coupons/validate", request);
  return data;
};