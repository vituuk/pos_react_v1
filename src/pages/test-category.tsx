import { columns } from "../components/test-category/columns";
import { DataTable } from "@/components/data-table/data-table";
import { useCategories } from "@/hooks/test-category";
import { FormTest } from "@/components/test-category/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category";
import { deleteCategories } from "@/hooks/test-category";
import { toast } from "sonner";
import ConfirmDelete from "@/components/test-category/ConfirmDelete";

const Categories = () => {
  const { data, isLoading } = useCategories();
  const [open,setOpen]=useState(false);
  const [category,setCategory] = useState<Category | undefined>(undefined)//for edit form
  const {mutate: deleteCategoryMutate} = deleteCategories();
  const [isDelete,setIsDelete] = useState(false);

  const handleEdit=(category:Category)=>{
    console.log("Edit",category);
    setCategory(category);
    setOpen(true);
  }

  const onDelete= (category:Category)=>{
    console.log("Delete",category);
    setCategory(category)
    setIsDelete(true);
  
  }

   const confirmDelete = () => {   
    deleteCategoryMutate({id:category?.id},{
      onSuccess:()=>{    
        toast.success("Category deleted successfully");
      }                 
    })        
 }

  return (
    <div>

      <div>
        <Button onClick={()=>{setCategory(undefined); setOpen(true)}}>Create Category</Button>
      </div>
      <FormTest open={open} setOpen={setOpen} category={category} />
      <DataTable columns={columns({onEdit:handleEdit,onDelete})} data={data?.data ?? []} />
    
      <ConfirmDelete isOpen={isDelete} setIsOpen={setIsDelete} category={category} confirmDelete={confirmDelete}  />
    
    </div>
  );
};

export default Categories;
