import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"



export async function GET(req:Request,{params}:{
    params:{categoryId:string}
}){
    try{
        if(!params.categoryId){
            return new NextResponse('CategoryId is required',{status:400})
        }
        const category=await prismaDB.category.findUnique({
            where:{
                id:params.categoryId
            },include:{
                billboards:true
            }
        })
        return NextResponse.json(category)
    }catch(error){
        console.log('CATEGORY_GET_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}


export async function PATCH(req:Request,{params}:{
    params:{storeId:string, categoryId:string}
}){
    try{
        const {userId}=auth();
        const body=await req.json()
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!body.name || !body.billboardId){
            return new NextResponse('Name or BillboardId is required',{status:400})
        }
        if(!params.categoryId){
            return new NextResponse('BillboardId is required',{status:400})
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
        
        const updatedCategory=await prismaDB.category.updateMany({
            where:{
                id:params.categoryId
            },
            data:{
                ...body
            }
        })
        return NextResponse.json(updatedCategory)
    }catch(error){
        console.log('CATEGORY_PATCH_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}
export async function DELETE(req:Request,{params}:{
    params:{storeId:string, categoryId:string}
}){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!params.categoryId){
            return new NextResponse('CategoryId is required',{status:400})
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
        const deletedCategory=await prismaDB.category.deleteMany({
            where:{
                id:params.categoryId,
                storeId:params.storeId
            }
        })

        return NextResponse.json(deletedCategory)
    }catch(error){
        console.log('CATEGORY_DELETE_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}