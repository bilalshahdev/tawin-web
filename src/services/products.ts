import api from "@/lib/axios";
import { ProductsResponse,Product } from "@/types/product";

interface ProductParams {
  category?: string;
  allProducts?: boolean;
  featuredProducts?: boolean;
  reduced?: boolean;
  outOfStock?: boolean;
}

export const getProducts = async (params?: ProductParams, options?: { page?: number; limit?: number }) => {
  const { data } = await api.get("/api/products", { params, ...options });
  return data;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const { data } = await api.get(`/api/products/slug/${slug}`);
  return data.data;
};

export const getProductsByCategory = async (categoryId: string, options?: { page?: number; limit?: number }): Promise<ProductsResponse> => {
  const { data } = await api.get(`/api/products/category/${categoryId}`, { params: options });
  return data;
};

export const addProduct = async (formData: FormData): Promise<any> => {
  const { data } = await api.post("/api/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateProduct = async (id: string, formData: FormData): Promise<any> => {
  const { data } = await api.patch(`/api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteProduct = async (id: string): Promise<any> => {
  const { data } = await api.delete(`/api/products/${id}`);
  return data;
};

export const getLowStockProducts = async (params?: { allProducts?: boolean; featuredProducts?: boolean; reduced?: boolean; outOfStock?: boolean; page?: number; search?: string }): Promise<any> => {
  const { data } = await api.get("/api/products/low-stock", { params });
  return data;
};

export const updateProductStock = async (id: string, stock: number): Promise<any> => {
  const { data } = await api.patch(`/api/product/${id}/stock`, { stock });
  return data;
};
