import { use, useEffect, useState } from "react"

export function useOrigin(){
    const [mounted, setMounted] = useState(false)
    const origin=typeof window!==undefined&&window.location.origin?window.location.origin:''
    useEffect(()=>{
        setMounted(true)
    },[])
    if(!mounted){
        setMounted(true)
    }
    return origin
}