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
import { Store } from "@prisma/client";
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
import { APIAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData:Store
}
const formSchema=z.object({
    name: z.string().min(1),
})

type SettingsFormValues=z.infer<typeof formSchema>

export function SettingsForm({initialData}:SettingsFormProps) {


    //window origin
    const origin=useOrigin()

    //states
    const [loading,setLoading]=React.useState(false)
    const [isOpen,setIsOpen]=React.useState(false)

    //routing
    const params=useParams()
    const router=useRouter()

    //form
    const form=useForm<SettingsFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData
    })
    //form state
    const {isSubmitting,isValid}=form.formState
    
    //api calling & form submission
    const onSubmit=async(values:SettingsFormValues)=>{
        console.log(values)
        try{
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`,values)
            toast.success('Store updated successfully')
            router.refresh()
        }catch{
            toast.error('An error occurred')
        }finally{
            setLoading(false)
        }
    }
    const onDelete=async()=>{
        try{
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.push('/')
            router.refresh()
            toast.success('Store deleted successfully')
        }catch{
            toast.error('Make sure to delete all products and orders before deleting the store.')
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
            <Heading title="Settings" description="Update your store settings here."/>
            <Button
                disabled={isSubmitting||loading}
                variant="destructive"
                onClick={() => setIsOpen(true)}
            >
                <Trash className="size-4 mr-2"/>
                Delete store
            </Button>
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
                placeholder="iPhone,Samsung..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button
        disabled={isSubmitting||loading||!isValid}
         type="submit">Save changes</Button>
      </form>
    </Form>
    <Separator/>
    <APIAlert
    title="NEXT_PUBLIC_API_URL"
    description={`${origin}/api/${params.storeId}`}
    variant="public"
    />
        </>
    );
}
