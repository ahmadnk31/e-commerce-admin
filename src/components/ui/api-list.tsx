'use client'

import { useOrigin } from "@/hooks/use-origin"
import { useParams } from "next/navigation"
import { APIAlert } from "./api-alert"

interface APIListProps {
    entityName: string
    entityIdName: string
}
export function APIList({entityName, entityIdName}: APIListProps) {
    const origin=useOrigin()
    const params=useParams()
    const baseUrl=`${origin}/api/${params.storeId}`
    return (
        <>
        <APIAlert
        title="GET"
        description={`${baseUrl}/${entityName}`}
        variant='public'
        />
        <APIAlert
        title="GET"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        variant='public'
        />
        <APIAlert
        title="POST"
        description={`${baseUrl}/${entityName}`}
        variant='admin'
        />
        <APIAlert
        title="PATCH"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        variant='admin'
        />
        <APIAlert
        title="DELETE"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        variant='admin'
        />
        </>
    )
}