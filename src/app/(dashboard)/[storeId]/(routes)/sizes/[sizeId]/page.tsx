import { prismaDB } from "@/lib/prismaDB"
import { auth } from "@clerk/nextjs/server"
import { SizeForm } from "./_components/size-form"

export default async function BillboardPage({params}:{params:{storeId:string,sizeId:string}}){
    const size=await prismaDB.size.findUnique({
        where:{
            id:params.sizeId
        }
    })
    return(
        <div className='flex-col'>
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SizeForm
                initialData={size}
                />
            </div>
        </div>
    )
}