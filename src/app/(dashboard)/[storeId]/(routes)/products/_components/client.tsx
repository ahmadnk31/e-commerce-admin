'use client'

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn,columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { APIList } from "@/components/ui/api-list";
import React from "react";

interface ProductClientProps {
    data:ProductColumn[]
}


export function ProductClient({data}:ProductClientProps){
    const router=useRouter();
    const params=useParams()
    const [mounted,setMounted]=React.useState(false)
    React.useEffect(()=>{
        setMounted(true)
    },[])
    if(!mounted){
        return null
    }
    
    return(
        <>
        <div className="flex items-center justify-between">
            <Heading
            title={`Products ${data.length}`}
            description="Create and manage products for your store."
            />
            <Button
            onClick={()=>router.push(`/${params.storeId}/products/new`)}
            >
                <Plus className="size-4 mr-2"/>
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable
        searchKey="name"
        columns={columns}
        data={data}
        />
        <Heading
        title="API"
        description="API Calls for products"
        />
        <Separator/>
        <APIList
        entityIdName="productId"
        entityName="products"
        />
        </>
    )
}