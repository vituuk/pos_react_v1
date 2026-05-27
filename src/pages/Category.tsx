import { columns } from "../components/category/Columns";
import { DataTable } from "../components/data-table/data-table";
import { useState } from "react";
import { Button } from "../components/ui/button";
import  CategoryForm from "../components/category/CategoryForm";
import {  CirclePlus } from "lucide-react";
import { useCategory, useDeleteCategory } from "@/hooks/use-category";
import type { Category } from "@/types/category";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import ConfirmDelete from "@/components/category/ConfirmDelete";
import { useDebounce } from 'use-debounce';
import { getAccessToken } from "@/utils/tokenStorage";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [open,setOpen]=useState(false);
  const {mutate: deleteCategoryMutate} = useDeleteCategory();
  const [isDelete,setIsDelete] = useState(false);
  const [category,setCategory]=useState<Category | undefined>(undefined);

  //handle Edit
  const handleEdit=(category:Category)=>{
    console.log("Edit category",category);
    setCategory(category);
    setOpen(true);
  }
  //then
  const handleClose = (open:boolean) =>{
    setOpen(open);
    setCategory(undefined);
  }
  
  //handle delete
  const handleDelete=(category:Category)=>{
    console.log("Delete category",category);
    setCategory(category);
    setIsDelete(true);
    
  }
  
  const confirmDelete = () => {
    deleteCategoryMutate({id:category?.id},{
      onSuccess:()=>{
        toast.success("Category deleted successfully")
      }
    })
  }
  
  const [searchInput,setSearchInput] = useState("");
  const [value] = useDebounce(searchInput, 1000);
  const {data}= useCategory(value);
  console.log("value",value);
  
    const accessToken = getAccessToken();
  if (!accessToken) {
    navigate("/login");
  }
  return (
     <div>
       
      <div className="py-2 flex mb-4 justify-between ">
        <div className="flex justify-center gap-2">
          <Input className="w-[290px]" 
          value={searchInput}
          onChange={(e)=>setSearchInput(e.target.value)}
          placeholder="Search"/> 
      <Button>Search</Button>
        </div>
        <Button onClick={()=>{setCategory(undefined); setOpen(true);}} className="bg-black text-white"><CirclePlus/>Create</Button>
      </div>

      <DataTable columns={columns({onEdit:handleEdit, onDelete:handleDelete})} data={data?.data ?? []} />

      <CategoryForm category={category} open={open} setOpen={handleClose}/>
       
       <ConfirmDelete isOpen={isDelete} setIsOpen={setIsDelete} category={category} confirmDelete={confirmDelete}/>
    </div>
  )
}

export default CategoryPage