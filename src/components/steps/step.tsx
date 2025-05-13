import { Popover } from "@radix-ui/react-popover"
import { Check, ChevronDown, Settings, Trash2 } from "lucide-react"
import { useState } from "react"
import { PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command"
import { CommandInput } from "cmdk"
import { cn } from "@/lib/utils"
import { PipelineStep } from "@/lib/objects"
import { usePipelineStore } from "@/lib/store"
import { DatabaseManager } from "@/lib/db/manager"

export function Step({
    step,
}: {
    step: PipelineStep
}) {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-row w-full">
            <div className="flex border-1 rounded-md w-full h-15 justify-between">
                < div className="flex flex-col justify-center mx-5 font-semibold" >
                    {step.name}
                </div >
                <div className="flex flex-row">
                    <div className="flex flex-row mx-5">
                        <div className="flex flex-col justify-center mx-2">
                            {ConverterSelectionPopover(open, setOpen, step)}
                        </div>
                        <div className="flex flex-col justify-center">
                            <Settings size={18} />
                        </div>
                    </div>
                </div>
            </div >
            <div className="flex flex-col justify-center mx-5">
                <Trash2 size={18} onClick={() => {
                    usePipelineStore.getState().removeStep(step.id)
                }} />
            </div>
        </div >
    )
}

async function ConverterSelectionPopover(open: boolean, setOpen: (open: boolean) => void, step: PipelineStep) {
    return <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <ChevronDown size={18} role="combobox" aria-expanded={open} />
        </PopoverTrigger>
        <PopoverContent>
            <Command>
                <CommandInput placeholder="Search Converter" />
                <CommandList>
                    <CommandGroup>
                        {(await DatabaseManager.converter.listConverterNames()).map((item) => {
                            return (
                                <CommandItem key={item} onSelect={() => {
                                    step.name = item
                                    usePipelineStore.getState().updateStep(step.id, step)
                                    setOpen(false)
                                }}>
                                    {item}
                                    <Check className={cn(
                                        "mr-2 h-4 w-4",
                                        step.name === item ? "opacity-100" : "opacity-0"
                                    )} />
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
}
