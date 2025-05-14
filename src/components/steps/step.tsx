import { Popover } from "@radix-ui/react-popover";
import { Check, ChevronDown, Settings, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { CommandInput } from "cmdk";
import { cn } from "@/lib/utils";
import { PipelineStep } from "@/lib/objects";
import { usePipelineStore } from "@/lib/store";
import { DatabaseManager } from "@/lib/db/manager";

export function Step({ step }: { step: PipelineStep }) {
  const [open, setOpen] = useState(false);
  const [converterNameList, setConverterNameList] = useState<string[]>([]);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    DatabaseManager.converter.listConverterNames().then((list) => {
      setConverterNameList(list);
    });
  }, []);

  useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  return (
    <div className="flex flex-row w-full">
      <div className="flex border-1 rounded-md w-full h-15">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              ref={triggerRef}
              className="flex flex-row mx-5 font-semibold w-[90%] justify-between"
            >
              <div className="flex flex-col justify-center mx-2">
                {step.name}
              </div>
              <div className="flex flex-col justify-center mx-2">
                <ChevronDown size={18} role="combobox" aria-expanded={open} />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            style={{ width: `${triggerWidth}px` }}
            className="p-0 backdrop-blur-sm border border-slate-200 shadow-lg"
          >
            <Command className="p-2 bg-transparent">
              <CommandInput placeholder="Search Converter" className="bg-transparent p-2" />
              <CommandList>
                <CommandGroup>
                  {converterNameList.map((item) => {
                    return (
                      <CommandItem
                        key={item}
                        onSelect={() => {
                          step.name = item;
                          usePipelineStore.getState().updateStep(step.id, step);
                          setOpen(false);
                        }}
                      >
                        {item}
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            step.name === item ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex flex-row w-[10%]">
          <div className="flex flex-row mx-5">
            <div className="flex flex-col justify-center">
              <Settings size={18} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center mx-5">
        <Trash2
          size={18}
          onClick={() => {
            usePipelineStore.getState().removeStep(step.id);
          }}
        />
      </div>
    </div>
  );
}