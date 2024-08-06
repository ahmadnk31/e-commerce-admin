'use client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
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
import { Billboard, Category } from "@prisma/client";
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

interface CategoryFormProps {
    initialData:Category|null
    billboards:Billboard[]
}
const formSchema=z.object({
    name:z.string().min(3),
    billboardId:z.string().min(2)
})

type CategoryFormValues=z.infer<typeof formSchema>

export function CategoryForm({initialData,billboards}:CategoryFormProps) {

    const title=initialData?'Edit category':'New category'
    const description=initialData?'Update your category settings here.':'Create a new billboard for your store.'
    const toastMessage=initialData?'Category updated successfully':'Category created successfully'
    const action=initialData?'Save changes':'Create category'
    //window origin

    //states
    const [loading,setLoading]=React.useState(false)
    const [isOpen,setIsOpen]=React.useState(false)

    //routing
    const params=useParams()
    const router=useRouter()

    //form
    const form=useForm<CategoryFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData||{
            name:'',
            billboardId:''
        }
    })
    //form state
    const {isSubmitting,isValid}=form.formState

    //disable save changes button if there are no changes
    const isDirty=Object.keys(form.formState.dirtyFields).length>0
    
    console.log(isDirty)

    //api calling & form submission
    const onSubmit=async(values:CategoryFormValues)=>{
        try{
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,values)
            }else{
                await axios.post(`/api/${params.storeId}/categories`,values)
            }
            router.push(`/${params.storeId}/categories`)
            router.refresh()
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.push('/categories')
            router.refresh()
            toast.success('Category deleted successfully')
        }catch{
            toast.error('Make sure you removed all categories using this billboard first')
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
                placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billboardId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billboard</FormLabel>
              
                <Select 
                disabled={isSubmitting||loading}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                        <SelectValue
                        placeholder="Select a billboard"
                        defaultValue={field.value}

                        >

                        </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
           
              <FormMessage />
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
