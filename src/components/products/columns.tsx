"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "../../types/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PencilIcon, ShareIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import ImagePreviewModal from "./ImagePreviewModal";

interface Props{
  onEdit:(product:Product)=>void;
  onDelete:(product:Product)=>void;
}

export const columns = ({onEdit,onDelete}:Props): ColumnDef<Product>[] =>[
  {
    header: "NO",
    cell: ({ row }) => <div>{row.index+1}</div>,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
    {
    header: "Image",
    cell: ({ row }) => {
      const [isPreviewOpen, setIsPreviewOpen] = useState(false);

      return (
        <>
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsPreviewOpen(true)}
          >
            <img
              className="aspect-square w-[75px] h-[75px] object-cover rounded"
              src={row.original.productImages?.[0]?.imageUrl ?? "/img/no-image.jpg"}
              alt="Product"
            />
          </div>

          {row.original.productImages && row.original.productImages.length > 0 && (
            <ImagePreviewModal
              images={row.original.productImages}
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              initialIndex={0}
            />
          )}
        </>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    //  cell:({row})=>{
    //   return <div>{row.original.description.slice(0, 10)}</div>
    // }
  },
  {
    accessorKey: "color",
    header: "Color",
    //  cell:({row})=>{
    //   return <div>{row.original.description.slice(0, 10)}</div>
    // }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell:({row})=>{
      return <div className="bg-sky-500 text-center py-[2px] w-[60px] rounded-2xl text-white">{row.original.price}</div>
      
    }
  },
  {
    accessorKey: "qty",
    header: "Quantity",
    cell:({row})=>{
      return <div className="text-red-600 text-2xl">{row.original.qty}</div>
    }
  },
  {
    accessorKey: "category",
    header: "Category",

    cell: ({ row }) => {
     return <div className="bg-sky-500 text-center py-[2px] w-[100px] rounded-2xl text-white" id="">{row.original.category?.name}</div>;
    },
  },
  // {
  //   accessorKey: "price",
  //   header: "Price",
  // },
  //   {
  //   // accessorKey: "images",
  //   header: "Image",
  //   cell: ({ row }) =><div>
  //     <img className="w-20" src={row.original.images[0]} alt="image" />
  //   </div>
  // },
  {
    accessorKey: "actions",
    header: "Actions",
    // id:"actions",
    cell:({row})=>{
    return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <Button variant="outline">Actions</Button> */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-icon lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=>onEdit(row.original)}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
        
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=>onDelete(row.original)}>
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
    }
  }
];
