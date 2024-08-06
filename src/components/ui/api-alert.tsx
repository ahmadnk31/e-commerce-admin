'use client'
import { Check, Copy, Server } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Badge, BadgeProps } from "./badge"
import { Button } from "./button"
import { toast } from "sonner"
import React, { useEffect } from "react"

interface APIAlertProps{
    title: string
    description: string
    variant:'public'|'admin'
}
const textMap:Record<APIAlertProps['variant'],string>={
    public:'public',
    admin:'Admin'
}

const variantMap:Record<APIAlertProps['variant'],BadgeProps['variant']>={
    public:'secondary',
    admin:'destructive'
}

export function APIAlert({title,description,variant='public'}:APIAlertProps){
    const [copied,setCopied]=React.useState(false)
    const onCopy=(description:string)=>{
        navigator.clipboard.writeText(description)
        toast.success('Copied to clipboard')
        setCopied(true)
    }
    useEffect(()=>{
        if(copied){
            const timer=setTimeout(()=>{
                setCopied(false)
            },5000)
            return ()=>clearTimeout(timer)
        }
    },[copied])
    return(
        <Alert
        >
            <Server className="size-4" />
            <AlertTitle className="flex items-center gap-x-4">
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
                </AlertTitle>
            <AlertDescription className="mt-4 flex items-center  justify-between">
                <code className="relative text-sm font-mono px-[.3rem] py-[.2rem] font-semibold">
                    {description}
                </code>
                <Button variant="outline" className="text-muted-foreground" size='icon' onClick={()=>onCopy(description)}>
                    {
                        copied?
                        <Check className="size-4"/>:
                        <Copy className="size-4"/>
                    }
                </Button>
            </AlertDescription>
        </Alert>
    )
}