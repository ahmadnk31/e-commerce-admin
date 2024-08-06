import { prismaDB } from "@/lib/prismaDB"
import { auth } from "@clerk/nextjs/server"
import { ColorForm } from "./_components/color-form"

export default async function BillboardPage({params}:{params:{storeId:string,colorId:string}}){
    const color=await prismaDB.color.findUnique({
        where:{
            id:params.colorId
        }
    })
    return(
        <div className='flex-col'>
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ColorForm
                initialData={color}
                />
            </div>
        </div>
    )
}