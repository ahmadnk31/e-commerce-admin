import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{
    params:{storeId:string}
}){
    try{
        const {userId}=auth();
        const {label,imageUrl}=await req.json()
        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }
        if(!label || !imageUrl){
            return new NextResponse('Label and imageUrl are required',{status:400})
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
        const billboard=await prismaDB.billboard.create({
            data:{
                label,
                imageUrl,
                storeId:params.storeId
            }
        })
        return NextResponse.json(billboard)

    }catch(error){
        console.log('BILLBOARD_POST_ERROR:',error)
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
        
        const billboards=await prismaDB.billboard.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(billboards)
    }catch(error){
        console.log('BILLBOARD_GET_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}