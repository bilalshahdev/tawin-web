export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount?: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
  appliesTo: "all" | "category" | "product";
  categories?: string[];
  products?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CouponFormData {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expiryDate: string;
  usageLimit: number;
  appliesTo: "all" | "category" | "product";
  categories?: string[];
  products?: string[];
  isPromotional?: boolean;
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalUsageCount: number;
  expiredCoupons: number;
}

export interface PromotionalCoupon {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  usedBy: string[];
  isActive: boolean;
  isPromotional: boolean;
  thumbnail: string;
  appliesTo: "all" | "categories" | "products";
  categories: string[];
  products: string[];
  createdAt: string;
}