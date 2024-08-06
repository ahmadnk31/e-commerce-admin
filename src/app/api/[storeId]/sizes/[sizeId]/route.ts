import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"



export async function GET(req:Request,{params}:{
    params:{sizeId:string}
}){
    try{
        if(!params.sizeId){
            return new NextResponse('sizeId is required',{status:400})
        }
        const size=await prismaDB.size.findUnique({
            where:{
                id:params.sizeId
            }
        })
        return NextResponse.json(size)
    }catch(error){
        console.log('[SIZE_GET_ERROR]:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}


export async function PATCH(req:Request,{params}:{
    params:{storeId:string, sizeId:string}
}){
    try{
        const {userId}=auth();
        const body=await req.json()
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!body.name || !body.value){
            return new NextResponse('Name or Value is required',{status:400})
        }
        if(!params.sizeId){
            return new NextResponse('sizeId is required',{status:400})
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
        
        const updatedSize=await prismaDB.size.updateMany({
            where:{
                id:params.sizeId
            },
            data:{
                ...body
            }
        })
        return NextResponse.json(updatedSize)
    }catch(error){
        console.log('[SIZE_PATCH_ERROR]:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}
export async function DELETE(req:Request,{params}:{
    params:{storeId:string, sizeId:string}
}){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!params.sizeId){
            return new NextResponse('sizeId is required',{status:400})
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
        const deletedSize=await prismaDB.size.deleteMany({
            where:{
                id:params.sizeId,
                storeId:params.storeId
            }
        })

        return NextResponse.json(deletedSize)
    }catch(error){
        console.log('[SIZE_DELETE_ERROR]:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}