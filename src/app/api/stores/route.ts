import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req:Request){
try{
    const {userId}=auth();
    const body=await req.json()
    if(!userId){
        return new NextResponse('Unauthorized',{status:401})
    }
    if(!body.name){
        return new NextResponse('Name is required',{status:400})
    }
    const store=await prismaDB.store.create({
        data:{
            ...body,
            userId
        }
    })
    return NextResponse.json(store)
}catch(error){
    console.log('STORE_ROUTE_ERROR:',error)
    return new NextResponse('An error occurred',{status:500})
}
}