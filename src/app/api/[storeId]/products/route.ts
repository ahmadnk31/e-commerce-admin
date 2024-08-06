import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{
    params:{storeId:string}
}){
    try{
        const {userId}=auth();
        const {
            name,
            price,
            categoryId,
            sizeId,
            colorId,
            isArchived,
            isFeatured,
            images
        }=await req.json()
        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }
        if(!name){
            return new NextResponse('Name is required',{status:400})
        }
        if(!price){
            return new NextResponse('Price is required',{status:400})
        }
        
        if(!categoryId){
            return new NextResponse('CategoryId is required',{status:400})
        }
        if(!sizeId){
            return new NextResponse('SizeId is required',{status:400})
        }
        if(!colorId){
            return new NextResponse('ColorId is required',{status:400})
        }
        if(!images||images.length===0){
            return new NextResponse('Images are required',{status:400})
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
        const product=await prismaDB.product.create({
            data:{
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isArchived,
                isFeatured,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>(image))
                        ]
                    }
                },
                storeId:params.storeId
            }
        })
        return NextResponse.json(product)

    }catch(error){
        console.log('PRODUCT_POST_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}

export async function GET(req:Request,{params}:{
    params:{storeId:string}
}){
    try{
        const {searchParams}=new URL(req.url)
        const categoryId=searchParams.get('categoryId')||undefined
        const sizeId=searchParams.get('sizeId')||undefined
        const colorId=searchParams.get('colorId')||undefined
        const isFeatured=searchParams.get('isFeatured')
        
        if(!params.storeId){
            return new NextResponse('StoreId is required',{status:400})
        }
        
        const products=await prismaDB.product.findMany({
            where:{
                storeId:params.storeId,
                categoryId,
                sizeId,
                colorId,
                isFeatured:isFeatured==='true'?true:undefined,
                isArchived:false
            },
            include:{
                category:true,
                size:true,
                color:true,
                images:true
            },
            orderBy:{
                createdAt:'desc'
            }
        })
        return NextResponse.json(products)
    }catch(error){
        console.log('PRODUCTS_GET_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}