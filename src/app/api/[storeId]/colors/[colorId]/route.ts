import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"



export async function GET(req:Request,{params}:{
    params:{colorId:string}
}){
    try{
        if(!params.colorId){
            return new NextResponse('colorId is required',{status:400})
        }
        const color=await prismaDB.color.findUnique({
            where:{
                id:params.colorId
            }
        })
        return NextResponse.json(color)
    }catch(error){
        console.log('[color_GET_ERROR]:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}


export async function PATCH(req:Request,{params}:{
    params:{storeId:string, colorId:string}
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
        if(!params.colorId){
            return new NextResponse('colorId is required',{status:400})
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
        
        const updatedColor=await prismaDB.color.updateMany({
            where:{
                id:params.colorId
            },
            data:{
                ...body
            }
        })
        return NextResponse.json(updatedColor)
    }catch(error){
        console.log('[color_PATCH_ERROR]:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}
export async function DELETE(req:Request,{params}:{
    params:{storeId:string, colorId:string}
}){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!params.colorId){
            return new NextResponse('colorId is required',{status:400})
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
        const deletedColor=await prismaDB.color.deleteMany({
            where:{
                id:params.colorId,
                storeId:params.storeId
            }
        })

        return NextResponse.json(deletedColor)
    }catch(error){
        console.log('[COLOR_DELETE_ERROR]:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}