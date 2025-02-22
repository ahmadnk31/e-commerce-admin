import { prismaDB } from "@/lib/prismaDB";
import { ColorClient } from "./_components/client";
import { ColorColumn } from "./_components/columns";
import {format} from 'date-fns'
export default async function ColorsPage({params}:{params:{storeId:string}}){
    const colors=await prismaDB.color.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    const formattedColors:ColorColumn[]=colors.map(item=>({
        id:item.id,
        name:item.name,
        value:item.value,
        createdAt:format(item.createdAt,'MMMM do, yyy')
    }))
    return(
        <div className='flex-col'>
            <div className="flex-1 space-y-4 p-8 pt-6">
                 <ColorClient
                 data={formattedColors}
                 />
            </div>
        </div>
    )
}