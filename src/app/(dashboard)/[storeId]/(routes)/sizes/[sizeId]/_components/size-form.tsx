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
import { Billboard, Category, Size } from "@prisma/client";
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

interface SizeFormProps {
    initialData:Size|null
}
const formSchema=z.object({
    name:z.string().min(3),
    value:z.string().min(1)
})

type SizeFormValues=z.infer<typeof formSchema>

export function SizeForm({initialData}:SizeFormProps) {

    const title=initialData?'Edit size':'New size'
    const description=initialData?'Update your size settings here.':'Create a new size for your store.'
    const toastMessage=initialData?'Size updated successfully':'Size created successfully'
    const action=initialData?'Save changes':'Create size'
    //window origin

    //states
    const [loading,setLoading]=React.useState(false)
    const [isOpen,setIsOpen]=React.useState(false)

    //routing
    const params=useParams()
    const router=useRouter()

    //form
    const form=useForm<SizeFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData||{
            name:'',
            value:''
        }
    })
    //form state
    const {isSubmitting,isValid}=form.formState

    //disable save changes button if there are no changes
    const isDirty=Object.keys(form.formState.dirtyFields).length>0
    
    console.log(isDirty)

    //api calling & form submission
    const onSubmit=async(values:SizeFormValues)=>{
        try{
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`,values)
            }else{
                await axios.post(`/api/${params.storeId}/sizes`,values)
            }
            router.push(`/${params.storeId}/sizes`)
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
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.push(`/${params.storeId}/sizes`)
            router.refresh()
            toast.success('Size deleted successfully')
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
                placeholder="Size name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Input 
                type="number"
                step={0.1}
                disabled={isSubmitting||loading}
                placeholder="Size" {...field} />
           </FormControl>
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
