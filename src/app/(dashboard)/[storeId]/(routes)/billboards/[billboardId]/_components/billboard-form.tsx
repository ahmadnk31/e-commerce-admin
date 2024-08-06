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
import { Billboard } from "@prisma/client";
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

interface BillboardFormProps {
    initialData:Billboard|null
}
const formSchema=z.object({
    label: z.string().min(1),
    imageUrl: z.string()
})

type BillboardFormValues=z.infer<typeof formSchema>

export function BillboardForm({initialData}:BillboardFormProps) {

    const title=initialData?'Edit billboard':'New billboard'
    const description=initialData?'Update your billboard settings here.':'Create a new billboard for your store.'
    const toastMessage=initialData?'Billboard updated successfully':'Billboard created successfully'
    const action=initialData?'Save changes':'Create billboard'
    //window origin

    //states
    const [loading,setLoading]=React.useState(false)
    const [isOpen,setIsOpen]=React.useState(false)

    //routing
    const params=useParams()
    const router=useRouter()

    //form
    const form=useForm<BillboardFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData||{
            label:'',
            imageUrl:''
        }
    })
    //form state
    const {isSubmitting,isValid}=form.formState

    //disable save changes button if there are no changes
    const isDirty=Object.keys(form.formState.dirtyFields).length>0
    
    console.log(isDirty)

    //api calling & form submission
    const onSubmit=async(values:BillboardFormValues)=>{
        try{
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,values)
            }else{
                await axios.post(`/api/${params.storeId}/billboards`,values)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.push('/billboards')
            router.refresh()
            toast.success('Store deleted successfully')
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
      <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background image</FormLabel>
              <FormControl>
                <ImageUpload
                disabled={isSubmitting||loading}
                value={field.value?[field.value]:[]}
                onChange={(url)=>field.onChange(url)}
                onDelete={()=>field.onChange('')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input 
                disabled={isSubmitting||loading}
                placeholder="Billboard label" {...field} />
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
