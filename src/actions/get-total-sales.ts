import { prismaDB } from "@/lib/prismaDB";

export async function getTotalSales(storeId: string) {
    const totalSales = await prismaDB.order.count({
        where: {
            storeId,
            isPaid: true
        },
        
    });
    return totalSales;
   
}