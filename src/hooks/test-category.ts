import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory ,createCategory,updateCategory,deleteCategory} from "@/services/test-category.service";

export const useCategories = () => {
    return useQuery({//useQuery for method get
        queryKey: ["categories"],//queryKey for unique key for store data in cache
        queryFn: getCategory,//queryFn for fetch data from service that name create data in service of API post create
    })
}

export const createdCategory = () =>{
    const queryClient = useQueryClient();//user
    return useMutation({//useMutation for method post,put,delete
     mutationFn: createCategory,
     onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:["categories"]})//auto clear data and to display  new category
     }
    })
}

export const updateCategories = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id,request}:{id:number,request:any})=>
        updateCategory(id,request),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["categories"]})//auto clear data and to display  new category after updateCategory
        }
    })
}

export const deleteCategories = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id}:{id?:number})=>
        deleteCategory(id),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["categories"]})
        }
    })
}