'use client'

import React from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading: boolean
}

export function AlertModal({isOpen,onClose,onConfirm,isLoading}:AlertModalProps){
    const [isMounted,setIsMounted]=React.useState(false)
    React.useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }
    return(
        <Modal
        title="Are you sure you want to delete this?"
        description="This action cannot be undone."
         onClose={onClose} isOpen={isOpen} >
            <div className='pt-6 w-full flex items-center justify-end space-x-2'>
                <Button
                variant='outline'
                onClick={onClose}
                disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                onClick={onConfirm}
                disabled={isLoading}
                 variant="destructive">
                    Delete
                </Button>
            </div>
        </Modal>
    )
}