import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{
    params:{storeId:string}
}){
    try{
        const {userId}=auth();
        const {name,value}=await req.json()
        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }
        if(!name || !value){
            return new NextResponse('Name and Value are required',{status:400})
        }
        if(!params.storeId){
            return new NextResponse('StoreId is required',{status:400})
        }
        const storeByUserId=await prismaDB.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUserId){
            return new NextResponse('Unauthorized',{status:403})
        }
        const size=await prismaDB.size.create({
            data:{
                name,
                value,
                storeId:params.storeId
            }
        })
        return NextResponse.json(size)

    }catch(error){
        console.log('[SIZE_POST_ERROR]:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}

export async function GET(req:Request,{params}:{
    params:{storeId:string}
}){
    try{
        
        if(!params.storeId){
            return new NextResponse('StoreId is required',{status:400})
        }
        
        const sizes=await prismaDB.size.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(sizes)
    }catch(error){
        console.log('[SIZE_GET_ERROR]:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}