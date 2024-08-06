import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{
    params:{storeId:string}
}){
    try{
        const {userId}=auth();
        const {name,billboardId}=await req.json()
        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }
        if(!name || !billboardId){
            return new NextResponse('Name and BillboardId are required',{status:400})
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
        const category=await prismaDB.category.create({
            data:{
                name,
                billboardId,
                storeId:params.storeId
            }
        })
        return NextResponse.json(category)

    }catch(error){
        console.log('CATEGORY_POST_ERROR:',error)
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
        
        const categories=await prismaDB.category.findMany({
            where:{
                storeId:params.storeId
            }
        })
        return NextResponse.json(categories)
    }catch(error){
        console.log('CATEGORY_GET_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}