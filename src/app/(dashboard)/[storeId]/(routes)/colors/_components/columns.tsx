"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface ColorColumn {
    name:string
    id:string
    createdAt:string
    value:string
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell:({row})=>(
      <div className='flex items-center'>
        <div className='w-6 h-6 rounded-full' style={{backgroundColor:row.original.value}}></div>
        <span className='ml-2'>{row.original.value}</span>
      </div>
    )
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
