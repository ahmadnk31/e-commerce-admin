import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import { StoreSwitcher } from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prismaDB } from "@/lib/prismaDB";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Navbar(){
    const {userId}=auth();
    if(!userId){
        return redirect('/sign-in')
    }
    const stores=await prismaDB.store.findMany({
        where:{
            userId
        }
    })
    return(
        <div className='border-b'>
            <div className="flex items-center h-16 px-4 gap-x-4">
                <StoreSwitcher
                    items={stores}
                />
                <MainNav/>
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle/>
                    <UserButton/>
                </div>
            </div>
        </div>
    )
}