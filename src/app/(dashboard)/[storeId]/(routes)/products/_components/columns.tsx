"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { formatPrice } from "@/lib/format-price"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface ProductColumn {
    name:string
    id:string,
    price:string,
    isFeatured:boolean,
    isArchived:boolean,
    category:string,
    size:string,
    color:string,
    createdAt:string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },{
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell:({row})=><div className="w-4 h-4 rounded-full" style={{backgroundColor:row.original.color}}/>
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id:'actions',
    cell:({row})=><CellAction data={row.original}/>
  }
 
]
