'use client'

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ImageUpload } from "@/components/ui/image-upload";
import { SelectValue,Select,SelectContent,SelectGroup,SelectLabel,SelectTrigger, SelectItem, } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
    initialData:Product&{
        images:Image[]
    }|null,
    categories:Category[],
    sizes:Size[],
    colors:Color[]

}
const formSchema=z.object({
    name:z.string().min(1),
    price:z.coerce.number().min(1),
    isArchived:z.boolean().optional(),
    isFeatured:z.boolean().optional(),
    colorId:z.string().min(1),
    sizeId:z.string().min(1),
    categoryId:z.string().min(1),
    images:z.object({url:z.string()}).array()
})

type ProductFormValues=z.infer<typeof formSchema>

export function ProductForm({initialData,categories,sizes,colors}:ProductFormProps) {

    const title=initialData?'Edit Product':'Create product'
    const description=initialData?'Update your Product settings here.':'Create a new Product for your store.'
    const toastMessage=initialData?'Product updated successfully':'Product created successfully'
    const action=initialData?'Save changes':'Create Product'
    //window origin

    //states
    const [loading,setLoading]=React.useState(false)
    const [isOpen,setIsOpen]=React.useState(false)

    //routing
    const params=useParams()
    const router=useRouter()

    //form
    const form=useForm<ProductFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData?{
            ...initialData,
            price:parseFloat(String(initialData.price)),
        }:{
            name:'',
            price:0,
            isArchived:false,
            isFeatured:false,
            colorId:'',
            sizeId:'',
            categoryId:'',
            images:[]
        }
    })
    //form state
    const {isSubmitting,isValid}=form.formState

    //disable save changes button if there are no changes
    const isDirty=Object.keys(form.formState.dirtyFields).length>0
    
    console.log(isDirty)

    //api calling & form submission
    const onSubmit=async(values:ProductFormValues)=>{
        try{
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,values)
            }else{
                await axios.post(`/api/${params.storeId}/products`,values)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success(toastMessage)
        }catch{
            toast.error('An error occurred')
        }finally{
            setLoading(false)
        }
    }
    const onDelete=async()=>{
        try{
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.push(`/${params.storeId}/products`)
            router.refresh()
            toast.success('Product deleted successfully')
        }catch{
            toast.error('Make sure you removed all categories using this product page first')
        }finally{
            setLoading(false)
            setIsOpen(false)
    }
}
    return (
        <>
        <AlertModal
            isLoading={loading}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={onDelete}
        />
        <div className="flex items-center justify-between">
            <Heading title={title} description={description}/>
            {
                initialData&&(
                    <Button
                    onClick={()=>setIsOpen(true)}
                    variant="destructive"
                    disabled={isSubmitting||loading}
                    >
                        <Trash className="size-4 mr-2"/>
                        Delete
                    </Button>
                )
            }
        </div>
        <Separator/>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product image</FormLabel>
              <FormControl>
                <ImageUpload
                disabled={isSubmitting||loading}
                value={field.value.map((image)=>image.url)}
                onChange={(url)=>field.onChange([...field.value,{url}])}
                onDelete={(url)=>field.onChange([...field.value.filter((image)=>image.url!==url)])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                disabled={isSubmitting||loading}
                placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product price</FormLabel>
              <FormControl>
                <Input 
                type="number"
                disabled={isSubmitting||loading}
                placeholder="9.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product category</FormLabel>
              <Select 
                disabled={isSubmitting||loading}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                        <SelectValue
                        placeholder="Select a category"
                        defaultValue={field.value}

                        >

                        </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
           
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="colorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product color</FormLabel>
              <Select 
                disabled={isSubmitting||loading}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                        <SelectValue
                        placeholder="Select a color"
                        defaultValue={field.value}

                        >

                        </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    
                    {colors.map((item) => (
                        <SelectItem key={item.id} value={item.id} className="flex items-center">
                            <div className="flex justify-between items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor:item.value}}/>
                            {item.name}
                            </div>
                        </SelectItem>
                    ))}
                    
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sizeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product size</FormLabel>
              <Select 
                disabled={isSubmitting||loading}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                        <SelectValue
                        placeholder="Select a size"
                        defaultValue={field.value}

                        >

                        </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sizes.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
           
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Featured
                </FormLabel>
                <FormDescription>
                    This product will be displayed on your store's homepage.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isArchived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Archived
                </FormLabel>
                <FormDescription>
                  This product will not be displayed in your store.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        </div>
        <Button
        disabled={isSubmitting||loading||!isValid||!isDirty}
         type="submit">
                {action}
         </Button>
      </form>
    </Form>
        </>
    );
}
