'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
import { OrderColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { Check, Copy, EditIcon, Ellipsis, Trash } from "lucide-react"
import React from "react"
import  {toast} from "sonner"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { AlertModal } from "@/components/modals/alert-modal"

interface CellActionProps{
    data:OrderColumn
}

export function CellAction({data}:CellActionProps){
    const router=useRouter()
    const params=useParams()
    const [isCopied,setIsCopied]=React.useState(false)
    const onCopy=(id:string)=>{
        navigator.clipboard.writeText(id)
        setIsCopied(true)
        toast.success('ID copied to clipboard')
    }
    React.useEffect(()=>{
        if(isCopied){
            setTimeout(()=>{
                setIsCopied(false)
            },2000)
        }
    },[isCopied])
    const [loading,setLoading]=React.useState(false)
    const [isOpen,setIsOpen]=React.useState(false)

    const onDelete=async()=>{
        try{
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
            router.push(`/${params.storeId}/billboards`)
            toast.success('Billboard removed successfully')
        }catch{
            toast.error('Make sure you removed all categories using this billboard first')
        }finally{
            setLoading(false)
            setIsOpen(false)
    }
}
    return(
        <>
        <AlertModal
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}
        isLoading={loading}
        onConfirm={onDelete}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="ghost"
                size='icon'
                className="p-0 text-muted-foreground hover:text-primary"
                >
                    <span className='sr-only'>Open menu</span>
                    <Ellipsis
                    className="size-6"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                onClick={()=>onCopy(data.id)}
                >
                    {
                        isCopied
                        ?<Check className="size-4 mr-2"/>
                        :<Copy className="size-4 mr-2"/>
                    }
                    Copy ID
                </DropdownMenuItem>
                
                <DropdownMenuItem
                onClick={
                    ()=>router.push(`/${params.storeId}/billboards/${data.id}`)
                }
                >
                    <EditIcon className="size-4 mr-2"/>
                    Edit
                    </DropdownMenuItem>
               
                <DropdownMenuItem
                onClick={()=>setIsOpen(true)}
                >
                    <Trash className="size-4 mr-2"/>
                    Delete
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}