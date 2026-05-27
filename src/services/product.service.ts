import type { ProductPayload } from "@/types/product";
import api from "./lib/axios";

export const fetchProduct = async (
  search?: string,
  page: number = 1,
  limit: number = 10,
    categoryId?: number,
) => {
 return await api.get(`/api/v1/product`, {
    params: {
      search,
      page,
      limit,
         categoryId,
    },
      });
};

export const createProduct = async (request: ProductPayload) => {
  return await api.post(`/api/v1/product`, request);
};

export const updateProduct = async (id: number, request: ProductPayload) => {
    return await api.put(`/api/v1/product/${id}`, request);
};

export const deleteProduct = async (id?: number) => {
    return await api.delete(`/api/v1/product/${id}`);
};

export const uploadProductImage = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await api.post(`/api/v1/product-image/${id}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProductImage = async (id?: number) => {
  return await api.delete(`/api/v1/product-image/${id}`);
};
 