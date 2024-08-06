import { prismaDB } from "@/lib/prismaDB";
import { ProductClient } from "./_components/client";
import { ProductColumn } from "./_components/columns";
import {format} from 'date-fns'
import { formatPrice } from "@/lib/format-price";
export default async function ProductsPage({params}:{params:{storeId:string}}){
    const products=await prismaDB.product.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            category:true,
            size:true,
            color:true
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    const formattedProducts:ProductColumn[]=products.map(item=>({
        id:item.id,
        name:item.name,
        isFeatured:item.isFeatured,
        isArchived:item.isArchived,
        category:item.category.name,
        price:formatPrice(item.price.toNumber()),
        size:item.size.name,
        color:item.color.value,
        createdAt:format(item.createdAt,'MMM do, yyyy'),
    }))
    return(
        <div className='flex-col'>
            <div className="flex-1 space-y-4 p-8 pt-6">
                 <ProductClient
                 data={formattedProducts}
                 />
            </div>
        </div>
    )
}