'use client'

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn,columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { APIList } from "@/components/ui/api-list";

interface ColorClientProps {
    data:ColorColumn[]
}


export function ColorClient({data}:ColorClientProps){
    const router=useRouter();
    const params=useParams()
    return(
        <>
        <div className="flex items-center justify-between">
            <Heading
            title={`Colors ${data.length}`}
            description="Create and manage colors for your store."
            />
            <Button
            onClick={()=>router.push(`/${params.storeId}/colors/new`)}
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
        description="API Calls for colors."
        />
        <Separator/>
        <APIList
        entityIdName="colorId"
        entityName="colors"
        />
        </>
    )
}