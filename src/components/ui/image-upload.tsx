'use client'
import {CldUploadWidget} from "next-cloudinary"
import React from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
    onChange: (value:string) => void
    onDelete: (value:string) => void
    disabled?: boolean
    value: string[]
}

export function ImageUpload({onChange,onDelete,disabled,value}:ImageUploadProps) {
    const [isMounted,setIsMounted]=React.useState(false)
    React.useEffect(()=>{
        setIsMounted(true)
    },[])
    
    function onUpload(result:any){
        onChange(result.info.secure_url)
    }
    if(!isMounted){
        return null
    }
    return(
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url,index)=>(
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" variant='destructive' size='icon' onClick={()=>onDelete(url)}>
                                <Trash className="size-4"/>
                            </Button>
                        </div>
                        <Image
                                src={url}
                                alt="Product Image"
                                fill
                                className="object-cover"
                            />
                    </div>
                ))}
            </div>
            <CldUploadWidget
            
            onUpload={onUpload}
              uploadPreset="br0vky8t">
                {({open})=>{
                    const onClick=()=>{
                        open()
                    }
                    return(
                        <Button
                            disabled={disabled}
                            onClick={onClick}
                            variant='secondary'
                            type="button"
                        >
                            <ImagePlus className="size-4 mr-2"/>
                            Upload an image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}