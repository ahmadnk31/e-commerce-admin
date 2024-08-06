import { prismaDB } from "@/lib/prismaDB"
import { auth } from "@clerk/nextjs/server"
import { CategoryForm } from "./_components/category-form"

export default async function BillboardPage({params}:{params:{storeId:string,categoryId:string}}){
    const category=await prismaDB.category.findUnique({
        where:{
            id:params.categoryId
        }
    })
    const billboards=await prismaDB.billboard.findMany({
        where:{
            storeId:params.storeId
        }
    })
    return(
        <div className='flex-col'>
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CategoryForm
                billboards={billboards}
                initialData={category}
                />
            </div>
        </div>
    )
}