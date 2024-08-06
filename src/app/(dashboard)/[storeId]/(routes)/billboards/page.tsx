import { prismaDB } from "@/lib/prismaDB";
import { BillboardClient } from "./_components/client";
import { BillboardColumn } from "./_components/columns";
import {format} from 'date-fns'
export default async function BillboardsPage({params}:{params:{storeId:string}}){
    const billboards=await prismaDB.billboard.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    const formattedBillboards:BillboardColumn[]=billboards.map(billboard=>({
        id:billboard.id,
        label:billboard.label,
        createdAt:format(billboard.createdAt,'MMM do, yyyy'),
    }))
    return(
        <div className='flex-col'>
            <div className="flex-1 space-y-4 p-8 pt-6">
                 <BillboardClient
                 data={formattedBillboards}
                 />
            </div>
        </div>
    )
}