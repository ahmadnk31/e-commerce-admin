import { prismaDB } from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"



export async function GET(req:Request,{params}:{
    params:{productId:string}
}){
    try{
        if(!params.productId){
            return new NextResponse('ProductId is required',{status:400})
        }
        const product=await prismaDB.product.findUnique({
            where:{
                id:params.productId
            },
            include:{
                images:true,
                category:true,
                size:true,
                color:true
            }
        })
        return NextResponse.json(product)
    }catch(error){
        console.log('PRODUCT_GET_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}


export async function PATCH(req:Request,{params}:{
    params:{storeId:string, productId:string}
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
            return new NextResponse('Unauthorized',{status:401})
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
        if(!params.productId){
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
        
        await prismaDB.product.update({
            where:{
                id:params.productId,
            },
            data:{
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isArchived,
                isFeatured,
                images:{
                    deleteMany:{},
                }
            }
        })
        const product=await prismaDB.product.update({
            where:{
                id:params.productId
            },
            data:{
                images:{
                    createMany:{
                        data:[...images.map((image:{url:string})=>(image))],
                    }
                }
            }
        })
        return NextResponse.json(product)
    }catch(error){
        console.log('PRODUCT_PATCH_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}
export async function DELETE(req:Request,{params}:{
    params:{storeId:string, productId:string}
}){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }
        if(!params.productId){
            return new NextResponse('ProoductId is required',{status:400})
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
        const deletedProduct=await prismaDB.product.deleteMany({
            where:{
                id:params.productId,
            }
        })

        return NextResponse.json(deletedProduct)
    }catch(error){
        console.log('BPRODUCT_DELETE_ERROR:',error)
        return new NextResponse('An error occurred',{status:500})
    }
}