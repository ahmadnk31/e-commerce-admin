import { prismaDB } from "@/lib/prismaDB";
import { CategoryClient } from "./_components/client";
import { CategoryColumn } from "./_components/columns";
import {format} from 'date-fns'
export default async function CategoriesPage({params}:{params:{storeId:string}}){
    const categories=await prismaDB.category.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            billboards:true
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    const formattedCategories:CategoryColumn[]=categories.map(item=>({
        id:item.id,
        name:item.name,
        billboardLabel:item.billboards.label,
        createdAt:format(item.createdAt,'MMMM do, yyy')
    }))
    return(
        <div className='flex-col'>
            <div className="flex-1 space-y-4 p-8 pt-6">
                 <CategoryClient
                 data={formattedCategories}
                 />
            </div>
        </div>
    )
}