import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DatabaseManager } from "@/lib/db/manager";
import { PipelineStep } from "@/lib/objects";
import { usePipelineStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { Ref, useEffect, useState } from "react";

export function StepSelectionPopover({ converterSelectionPopoverOpen, setConverterSelectionPopoverOpen, converterSelectorTriggerRef, step, converterSelectionPopoverWidth }: { converterSelectionPopoverOpen: boolean; setConverterSelectionPopoverOpen: (open: boolean) => void; converterSelectorTriggerRef: Ref<HTMLDivElement>; step: PipelineStep; converterSelectionPopoverWidth: number; }) {
    return <Popover open={converterSelectionPopoverOpen} onOpenChange={setConverterSelectionPopoverOpen}>
        <PopoverTrigger asChild>
            <div
                ref={converterSelectorTriggerRef}
                className="flex flex-row mx-5 font-semibold w-full justify-between"
            >
                <div className="flex flex-col justify-center mx-2">
                    {step.name}
                </div>
                <div className="flex flex-col justify-center mx-2">
                    <ChevronDown size={18} role="combobox" aria-expanded={converterSelectionPopoverOpen} />
                </div>
            </div>
        </PopoverTrigger>
        <PopoverContent
            style={{ width: converterSelectionPopoverWidth }}
            className="p-0 backdrop-blur-sm border border-slate-200 shadow-lg"
        >
            {<ConverterSelectionPopoverContent step={step} setOpen={setConverterSelectionPopoverOpen} />}
        </PopoverContent>
    </Popover>;
}

function ConverterSelectionPopoverContent({ step, setOpen }: { step: PipelineStep; setOpen: (open: boolean) => void; }) {
    const [converterNameList, setConverterNameList] = useState<string[]>([]);
    useEffect(() => {
        DatabaseManager.converter.listConverterNames().then((list) => {
            setConverterNameList(list);
        });
    }, []);
    return <Command className="p-2 bg-transparent">
        <CommandInput placeholder="Search Converter" className="bg-transparent p-2" />
        <CommandList>
            <CommandGroup>
                {converterNameList.map((item) => {
                    return (
                        <CommandItem
                            key={item}
                            onSelect={async () => {
                                // Get the converter definition to update config
                                const converterDef = await DatabaseManager.converter.getConverterDefinition(item);
                                const updatedStep = {
                                    ...step,
                                    name: item,
                                    config: converterDef.config?.map((configItem) => ({
                                        name: configItem.name,
                                        type: configItem.type,
                                        default: configItem.default,
                                        value: configItem.default,
                                    })) ?? []
                                };
                                usePipelineStore.getState().updateStep(step.id, updatedStep);
                                setOpen(false);
                            }}
                        >
                            {item}
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    step.name === item ? "opacity-100" : "opacity-0"
                                )} />
                        </CommandItem>
                    );
                })}
            </CommandGroup>
        </CommandList>
    </Command>;
}