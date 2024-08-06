'use client'
  
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button"
import { HexColorPicker } from "react-colorful";
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
import { Color } from "@prisma/client";
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

interface ColorFormProps {
    initialData:Color|null
}
const formSchema=z.object({
    name:z.string().min(3),
    value:z.string().min(1)
})

type ColorFormValues=z.infer<typeof formSchema>

export function ColorForm({initialData}:ColorFormProps) {
    const [showColorPicker, setShowColorPicker] = React.useState(false);
    const title=initialData?'Edit color':'New color'
    const description=initialData?'Update your color settings here.':'Create a new color for your store.'
    const toastMessage=initialData?'color updated successfully':'Color created successfully'
    const action=initialData?'Save changes':'Create color'
    //window origin

    //states
    const [loading,setLoading]=React.useState(false)
    const [isOpen,setIsOpen]=React.useState(false)

    //routing
    const params=useParams()
    const router=useRouter()

    //form
    const form=useForm<ColorFormValues>({
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
    const onSubmit=async(values:ColorFormValues)=>{
        try{
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`,values)
            }else{
                await axios.post(`/api/${params.storeId}/colors`,values)
            }
            router.push(`/${params.storeId}/colors`)
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.push(`/${params.storeId}/colors`)
            router.refresh()
            toast.success('color deleted successfully')
        }catch{
            toast.error('Make sure you removed all products using this billboard first')
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
                        <Trash className="color-4 mr-2"/>
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
                placeholder="color name" {...field} />
                
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
              <FormLabel>Value</FormLabel>
              <FormControl>
                {/* <div className='flex items-center gap-4'>
                <Input 
                disabled={isSubmitting||loading}
                placeholder="#000ff0" {...field} />
                {
                    form.watch('value')&&(
                        <div className='p-4 border rounded-full' style={{backgroundColor:form.watch('value')}}/>
                    )
                }
                </div> */}
                <HexColorPicker 
                
                color={field.value} onChange={(color)=>field.onChange(color)}/>
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
