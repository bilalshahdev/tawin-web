import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProductBySlug, getProductsByCategory, addProduct, updateProduct, deleteProduct, getLowStockProducts, updateProductStock } from "@/services/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useProducts = (params?: PaginationParams, options?: PaginationParams) => {
  return useQuery({
    queryKey: ["products", params, options],
    queryFn: () => getProducts(params, options),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductsByCategory = (categoryId: string, options?: PaginationParams) => {
  return useQuery({
    queryKey: ["products", "category", categoryId, options],
    queryFn: () => getProductsByCategory(categoryId, options),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/admin/product-list");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add product.");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product.");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product.");
    },
  });
};

export const useLowStockProducts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["products", "low-stock", params],
    queryFn: () => getLowStockProducts(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) => updateProductStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", "low-stock"] });
      toast.success("Product stock updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product stock.");
    },
  });
};