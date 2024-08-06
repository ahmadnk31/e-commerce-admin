import { prismaDB } from "@/lib/prismaDB"
import { auth } from "@clerk/nextjs/server"
import { BillboardForm } from "./_components/billboard-form"

export default async function BillboardPage({params}:{params:{billboardId:string}}){
    const billboard=await prismaDB.billboard.findUnique({
        where:{
            id:params.billboardId
        }
    })
    return(
        <div className='flex-col'>
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillboardForm
                    initialData={billboard}
                />
            </div>
        </div>
    )
}