import api from "./lib/axios";
import type {  CategoryPayload  } from "@/types/category";

 export const getCategory = async (search?: string) => {
  return await api.get(`/api/v1/category`, { params: { search } });
};

export const getCategoryList = async () => {
      return await api.get("/api/v1/category/list")
};

export const createCategory = async (request: CategoryPayload) => {
  return await api.post("/api/v1/category", request)
};

export const updateCategory = async (id: number, request: CategoryPayload) => {
  return await api.put(`/api/v1/category/${id}`, request)
};

export const deleteCategory = async (id?: number) => {
     return await api.delete(`/api/v1/category/${id}`)
}
 