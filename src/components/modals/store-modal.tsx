'use client'

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal"
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

import * as z from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema=z.object({
    name: z.string().min(3,{message:"Name must be at least 3 characters long"}),
})


export const StoreModal=()=>{
    const router=useRouter()
    const storeModal=useStoreModal()
    const {isOpen,onClose}=storeModal
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
        },
      })
      async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        try{
            setLoading(true)
            const response=await axios.post('/api/stores',values)
            const store=response.data
            window.location.assign(`/${store.id}`)
            form.reset()
            toast.success('Store created successfully')

        }catch{
            toast.error('An error occurred')
        }finally{
            setLoading(false)
        }
      }

      //
      //loading state
    const [loading,setLoading]=React.useState(false)
    const {isSubmitting,isValid}=form.formState
    
    
    return(
        <Modal
        title="Create Store"
        description="Add a new store to manage products and categories"
        isOpen={isOpen}
        onClose={onClose}
        >
            <div>
                <div className="sapce-y-4 pb-2 py-4">
                <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store name</FormLabel>
              <FormControl>
                <Input
                disabled={isSubmitting||loading}
                 placeholder="iPhone,Samsung,..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
            <Button
            disabled={isSubmitting||loading}
             variant="outline" onClick={onClose}>
                Cancel
            </Button>
            <Button
            disabled={isSubmitting||loading||!isValid}
             type="submit">Continue</Button>
        </div>
      </form>
    </Form>
                </div>
            </div>
        </Modal>
    )
}