import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory,deleteCategory, getCategory,getCategoryList,updateCategory } from "@/services/category.service"

export const useCategory = (search?: string) => {

    return useQuery({
        queryKey: ["categories",search],
        queryFn: () => getCategory(search),
    })
};

export const useCategoryList = () => {

    return useQuery({
        queryKey: ["categoryList"],
        queryFn: () => getCategoryList(),
    })
};

export const useCreateCategory = () =>{
    const queryClient=useQueryClient();//auto refresh when create new category
    return useMutation({
        mutationFn: createCategory,
        onSuccess:()=>{
            //for clear data after create new category successfully then show the new category in the list
            queryClient.invalidateQueries({queryKey:["categories"]})
            queryClient.invalidateQueries({queryKey:["categoryList"]})
        }
    })
}

export const useUpdateCategory = () =>{
    const queryClient=useQueryClient();//auto refresh when update category
    return useMutation({
        mutationFn:  ({id,request}:{id:number,request:any}) =>
        updateCategory(id,request),
        onSuccess:()=>{
            //for clear data after update category successfully then show the new category in the list
            queryClient.invalidateQueries({queryKey:["categories"]})
            queryClient.invalidateQueries({queryKey:["categoryList"]})
        }
    })
}

export const useDeleteCategory = () =>{
    const queryClient=useQueryClient();//auto refresh when update category
    return useMutation({
        mutationFn:  ({id}:{id?:number}) =>
        deleteCategory(id),
        onSuccess:()=>{
            //for clear data after update category successfully then show the new category in the list
            queryClient.invalidateQueries({queryKey:["categories"]})
        }
    })
}