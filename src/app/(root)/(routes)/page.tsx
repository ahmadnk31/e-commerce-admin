'use client'
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

export default function SetupPage() {
    // const onOpen=useStoreModal(state=>state.onOpen)
    // const isOpen=useStoreModal(state=>state.isOpen)
    //this is the same as the above two lines
    const {isOpen,onOpen}=useStoreModal()

    //we want to open the modal when the page loads
    useEffect(()=>{
        if(!isOpen){
            onOpen()
        }
    },[isOpen,onOpen])
    return null
}