'use client'

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn,columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { APIList } from "@/components/ui/api-list";

interface BillboardClientProps {
    data:BillboardColumn[]
}


export function BillboardClient({data}:BillboardClientProps){
    const router=useRouter();
    const params=useParams()
    return(
        <>
        <div className="flex items-center justify-between">
            <Heading
            title={`Billboards ${data.length}`}
            description="Create and manage billboards for your store."
            />
            <Button
            onClick={()=>router.push(`/${params.storeId}/billboards/new`)}
            >
                <Plus className="size-4 mr-2"/>
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable
        searchKey="label"
        columns={columns}
        data={data}
        />
        <Heading
        title="API"
        description="API Calls for billboards"
        />
        <Separator/>
        <APIList
        entityIdName="billboardId"
        entityName="billboards"
        />
        </>
    )
}