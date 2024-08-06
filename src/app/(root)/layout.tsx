import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SettingsLayoutPage({children}:{children:React.ReactNode}){
    const {userId}=auth();
    if(!userId){
        return redirect('/sign-in')
    }
    const store=await prismaDB.store.findFirst({
        where:{
            userId
        }
    })
    if(store){
        return redirect(`/${store.id}`)
    }
    return(
        <>
        {children}
        </>
    )
}