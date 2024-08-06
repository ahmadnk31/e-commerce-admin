import Navbar from "@/components/navbar";
import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export default async function DashboardLayout({children,params}:{
    children:React.ReactNode,
    params:{
        storeId:string
    }
}) {
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
        <div>
            <Navbar/>
            {children}
        </div>
    )
}