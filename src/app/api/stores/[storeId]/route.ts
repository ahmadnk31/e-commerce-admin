import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{
    params:{storeId:string}
}){
    try{
        const {userId}=auth();
        const body=await req.json()
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!body.name){
            return new NextResponse('Name is required',{status:400})
        }
        
        const updatedStore=await prismaDB.store.updateMany({
            where:{
                id:params.storeId
            },
            data:{
                ...body
            }
        })
        return NextResponse.json(updatedStore)
    }catch(error){
        console.log('STORE_UPDATING_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}
export async function DELETE(req:Request,{params}:{
    params:{storeId:string}
}){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        await prismaDB.store.delete({
            where:{
                id:params.storeId,
                userId
            }
        })
        return new NextResponse('Deleted')
    }catch(error){
        console.log('STORE_DELETING_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}