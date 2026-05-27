"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "../../types/category";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PencilIcon, TrashIcon } from "lucide-react";
// import Category from "@/pages/Category";

interface Props{
  onEdit:(category:Category)=>void;
  onDelete:(category:Category)=>void;
}

// (category:Category)=void;
// columns: ColumnDef<Category>[]
export const columns=({onEdit,onDelete}:Props): ColumnDef<Category>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    // accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
 
  {
    header: "Created At",
  cell: ({ row }) => {
  return <div>{format(row.original.createdAt, "MM/dd/yyyy hh:mm a")}</div>
}
  },
  //   {
  //   // accessorKey: "images",
  //   header: "Image",
  //   cell: ({ row }) =><div>
  //     <img className="w-20" src={row.original.images[0]} alt="image" />
  //   </div>
  // },
  {
    header: "Actions",
    // id:"actions",
    cell:({row})=>{
    return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <Button variant="outline">Actions</Button> */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-ellipsis-icon lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
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
