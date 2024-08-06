import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"



export async function GET(req:Request,{params}:{
    params:{billboardId:string}
}){
    try{
        if(!params.billboardId){
            return new NextResponse('BillboardId is required',{status:400})
        }
        const billboard=await prismaDB.billboard.findUnique({
            where:{
                id:params.billboardId
            }
        })
        return NextResponse.json(billboard)
    }catch(error){
        console.log('BILLBOARD_GET_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}


export async function PATCH(req:Request,{params}:{
    params:{storeId:string, billboardId:string}
}){
    try{
        const {userId}=auth();
        const body=await req.json()
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!body.label || !body.imageUrl){
            return new NextResponse('Label or ImageUrl is required',{status:400})
        }
        if(!params.billboardId){
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
        
        const updatedBillboard=await prismaDB.billboard.updateMany({
            where:{
                id:params.billboardId
            },
            data:{
                ...body
            }
        })
        return NextResponse.json(updatedBillboard)
    }catch(error){
        console.log('BILLBOARD_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}
export async function DELETE(req:Request,{params}:{
    params:{storeId:string, billboardId:string}
}){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!params.billboardId){
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
        const deletedBillboard=await prismaDB.billboard.deleteMany({
            where:{
                id:params.billboardId,
                storeId:params.storeId
            }
        })

        return NextResponse.json(deletedBillboard)
    }catch(error){
        console.log('BILLBOARD_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}