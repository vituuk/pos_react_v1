"use client"

import type { ColumnDef } from "@tanstack/react-table";
import type { TestCategory } from "@/types/test-category";

 
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns/format";
import { Edit } from "lucide-react";
import { Delete } from "lucide-react";
import type { Category } from "@/types/category";
 
interface Props{
  onEdit:(category:Category)=>void;
  onDelete:(category:Category)=>void;
}

export const columns=({onEdit,onDelete}:Props): ColumnDef<TestCategory>[] => [
 

  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {  
      return <div>{format(row.original.createdAt, "MM/dd/yyyy hh:mm a")}</div>
    },
  },
   {
    header: "Action",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>onEdit(row.original)}><PencilIcon/>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>onDelete(row.original)}><TrashIcon/> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },

 
]