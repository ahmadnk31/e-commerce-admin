import { prismaDB } from "@/lib/prismaDB";
import { OrderClient } from "./_components/client";
import { OrderColumn } from "./_components/columns";
import {add, format} from 'date-fns'
import { formatPrice } from "@/lib/format-price";
export default async function OrdersPage({params}:{params:{storeId:string}}){
    const orders=await prismaDB.order.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            orderItems:{
                include:{
                    product:true
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    const formattedOrders:OrderColumn[]=orders.map(order=>({
        id:order.id,
        phone:order.phone,
        address:order.address,
        products:order.orderItems.map(orderItem=>orderItem.product.name).join(', '),
        totalPrice:formatPrice(order.orderItems.reduce((total,item)=>{
            return total+Number(item.product.price)
        },0)),
        isPaid:order.isPaid,
        createdAt:format(order.createdAt,'MMM do, yyyy'),
    }))
    return(
        <div className='flex-col'>
            <div className="flex-1 space-y-4 p-8 pt-6">
                 <OrderClient
                 data={formattedOrders}
                 />
            </div>
        </div>
    )
}