'use client'
import React, { useEffect } from "react"

import { StoreModal } from "@/components/modals/store-modal"

export const ModalProvider=()=>{
    const [isMounted,setIsMounted]=React.useState(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }
    return(
        <StoreModal/>
    )
}