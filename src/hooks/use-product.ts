import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  fetchProduct,
  updateProduct,
  uploadProductImage,
} from "@/services/product.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const getProduct = (search?: string, page?: number, limit?: number, categoryId?: number) => {
  return useQuery({
    queryKey: ["products", search, page, limit,categoryId],
    queryFn: () => fetchProduct(search, page, limit,categoryId),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      //when create new product successfully then clear the products to show the new product in the list
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to created product");
      console.log("error creating product", error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: any }) =>
      updateProduct(id, request),
    onSuccess: () => {
      //when update product successfully then clear the products to show the new product in the list
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to created product");
      console.log("Failed to create product", error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id?: number }) => deleteProduct(id),
    onSuccess: () => {
      //when delete product successfully then clear the products to show the new product in the list
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: File }) =>
      uploadProductImage(id, request),
    onSuccess: () => {
      console.log("Product image uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to upload product image");
      console.log("Failed to upload product image", error);
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteProductImage(id),
    onSuccess: () => {
      // toast.success("Product image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete product image");
      console.log("Failed to delete product image", error);
    },
  });
};
