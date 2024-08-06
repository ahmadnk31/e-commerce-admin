import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage({params}:{
    params:{
        storeId:string
    }
}){
    const {userId}=auth();
    if(!userId){
        return redirect('/sign-in')
    }
    const store=await prismaDB.store.findFirst({
        where:{
            id:params.storeId,
            userId
        }
    })
    if(!store){
        return redirect('/')
    }
    return(
        <div className='flex-col'>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store}/>
            </div>
        </div>
    )
}