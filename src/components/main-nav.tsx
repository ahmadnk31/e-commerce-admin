'use client'
import {usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

export function MainNav({className,...props}:React.HTMLAttributes<HTMLElement>) {
    const pathname=usePathname();
    const params=useParams();
    const routes=[
        {
            href:`/${params.storeId}`,
            label:'Overview',
            active:`/${params.storeId}`===pathname
        },
        {
            href:`/${params.storeId}/billboards`,
            label:'Billboards',
            active:pathname.includes(`/${params.storeId}/billboards`)
        },
        {
            href:`/${params.storeId}/categories`,
            label:'Categories',
            active:pathname.includes(`/${params.storeId}/categories`)
        },
        {
            href:`/${params.storeId}/sizes`,
            label:'Sizes',
            active:pathname.includes(`/${params.storeId}/sizes`)
        },
        {
            href:`/${params.storeId}/colors`,
            label:'Colors',
            active:pathname.includes(`/${params.storeId}/colors`)
        },
        {
            href:`/${params.storeId}/products`,
            label:'Products',
            active:pathname.includes(`/${params.storeId}/products`)
        },
        {
            href:`/${params.storeId}/orders`,
            label:'Orders',
            active:pathname.includes(`/${params.storeId}/orders`)
        },
        {
            href:`/${params.storeId}/settings`,
            label:'Settings',
            active:pathname.includes(`/${params.storeId}/settings`)
        }
    ]
return(
    <nav className={cn('flex items-center space-x-4 lg:space-x-6',className)}>
{routes.map((route)=>(
    <Link key={route.href} href={route.href}
    className={cn('text-sm font-medium transition-all hover:text-primary',route.active?'text-black dark:text-white':'text-muted-foreground')}
    >
        {route.label}
        </Link>
))}
    </nav>
)
}