import { columns } from "../components/products/columns";
import { DataTable } from "../components/data-table/data-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../components/ui/button";
import ProductForm from "../components/products/ProductForm";
import {  CirclePlus } from "lucide-react";
import { getProduct, useDeleteProduct } from "../hooks/use-product";
import type { Product } from "@/types/product";

import { getAccessToken } from "@/utils/tokenStorage";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import ConfirmDelete from "@/components/products/ConfirmDelete";
import { toast } from "sonner";
import { Field, FieldLabel } from "@/components/ui/field";
import FileUpload01 from "@/components/file-upload-01";
 
const Product = () => {
  
  const navigate = useNavigate();
  const [searchInput,setSearchInput]=useState("");
  const [open,setOpen]=useState(false);
  const [page,setPage] = useState(1);
  const [limit,setLimit] = useState(5);
  const {data:productData,isLoading} = getProduct(searchInput,page,limit);
  const pagination = productData?.data?.pagination;
  const totalPages = Math.ceil((pagination?.total || 0) / (pagination?.limit || 1));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  //search
  const handleSearch=()=>{
    console.log("searching for",searchInput);
    setSearchInput(searchInput);
  }

  const [product,setProduct] = useState<Product | undefined>(undefined);
  
  const handleEdit = (product:Product)=>{
    
    setProduct(product);
    setOpen(true);
  }

  const handleClose = (open:boolean) =>{
    setOpen(open);
    setProduct(undefined);
  }

  const [isDelete,setIsDelete] = useState(false);
  const {mutate: deleteProductMutate} = useDeleteProduct();
  const handleDelete = (product: Product)=>{
    setProduct(product);
    setIsDelete(true);
  }

   const confirmDelete = () => {
    deleteProductMutate({id:product?.id},{
      onSuccess:()=>{
        toast.success("Product deleted successfully")
      }
    })
  }

   const accessToken = getAccessToken();
  if (!accessToken) {
    navigate("/login");
  }

  return (
    <div>
      <div className="py-2 flex mb-4 justify-between ">
        <div className="flex justify-center gap-2">
        <Input className="w-64" onChange={(e)=>setSearchInput(e.target.value)} value={searchInput}/>
        <Button onClick={()=>handleSearch()}>Search</Button>
        </div>
        <Button onClick={()=>{setProduct(undefined); setOpen(true);}} className="bg-black text-white"><CirclePlus/>Create</Button>
      </div>

      <ProductForm open={open}   setOpen={() => {
          setOpen(false);
          setProduct(undefined)
        }} product={product} />

      <DataTable columns={columns({onEdit:handleEdit,onDelete:handleDelete})} data={ productData?.data ?? []}/>
    
      <ConfirmDelete isOpen={isDelete} setIsOpen={setIsDelete} product={product} confirmDelete={confirmDelete} />
    
    <div className="flex justify-between mt-4 items-center">
      <Field orientation="horizontal" className="w-[220px]">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
       
        <Select defaultValue="10" onValueChange={(value)=> setLimit(Number(value))}>
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>

          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

         <Pagination className="flex justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={()=>{setPage(pagination?.prevPage)}} />
        </PaginationItem>

                {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => setPage(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
        
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={()=>{setPage(pagination?.nextPage)}} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
    </div> 
  );
};

export default Product;
