import { prismaDB } from "@/lib/prismaDB";

export async function getTotalProductsInStock(storeId: string) {
    const products = await prismaDB.product.findMany({
        where: {
            storeId,
            isArchived: false,
        }
    });
    return products.length;
}