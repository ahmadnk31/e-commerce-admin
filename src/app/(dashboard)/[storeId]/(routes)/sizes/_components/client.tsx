'use client'

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { SizeColumn,columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { APIList } from "@/components/ui/api-list";

interface SizeClientProps {
    data:SizeColumn[]
}


export function SizeClient({data}:SizeClientProps){
    const router=useRouter();
    const params=useParams()
    return(
        <>
        <div className="flex items-center justify-between">
            <Heading
            title={`Sizes ${data.length}`}
            description="Create and manage sizes for your store."
            />
            <Button
            onClick={()=>router.push(`/${params.storeId}/sizes/new`)}
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
        description="API Calls for sizes."
        />
        <Separator/>
        <APIList
        entityIdName="sizeId"
        entityName="sizes"
        />
        </>
    )
}