'use client'


import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Store } from "@prisma/client"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Check, ChevronsUpDown, PlusIcon, StoreIcon } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandInput, CommandList,CommandItem,CommandGroup, CommandSeparator } from "./ui/command"



type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]
}
export function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const storeModal = useStoreModal()
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))
    const onStoreChange = (store: { label: string, value: string }) => {
        setIsOpen(false)
        router.push(`/${store.value}`)
    }
    const currentStore = items.find((item) => item.id === params.storeId)
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-label="Store switcher"
                    size='sm'
                    onClick={() => {}}
                    className={cn("w-[200px] justify-between")}
                >
                    <StoreIcon className="mr-2 h-4 w-4 shrink-0" />
                    {currentStore?.name}
                    <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                    <CommandInput placeholder="Select store" />
                    <CommandEmpty>No store found</CommandEmpty>
                        <CommandGroup heading='stores'>
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => onStoreChange(store)}
                                    className="text-sm"
                                >
                                    <StoreIcon className="mr-2 size-4 shrink-0" />
                                    <span className="text-ellipsis">{store.label}</span>
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 ml-auto shrink-0",
                                            currentStore?.id === store.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={()=>{
                                    storeModal.onOpen()
                                    setIsOpen(false)}}
                                className="text-sm cursor-pointer"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Create store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}