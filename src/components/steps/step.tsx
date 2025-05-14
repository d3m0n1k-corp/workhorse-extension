import { Popover } from "@radix-ui/react-popover";
import { Check, ChevronDown, Settings, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { CommandInput } from "cmdk";
import { cn } from "@/lib/utils";
import { PipelineStep, PipelineStepConfig } from "@/lib/objects";
import { usePipelineStore } from "@/lib/store";
import { DatabaseManager } from "@/lib/db/manager";

export function Step({ step }: { step: PipelineStep }) {
  const [converterSelectionPopoverOpen, setConverterSelectionPopoverOpen] = useState(false);
  const [converterSelectionPopoverWidth, setConverterSelectionPopoverWidth] = useState(0);
  const converterSelectorTriggerRef = useRef<HTMLDivElement>(null);

  const [configPopoverOpen, setConfigPopoverOpen] = useState(false);

  useEffect(() => {
    if (converterSelectionPopoverOpen && converterSelectorTriggerRef.current) {
      setConverterSelectionPopoverWidth(converterSelectorTriggerRef.current.offsetWidth);
    }
  }, [converterSelectionPopoverOpen]);
  return (
    <div className="flex flex-row w-full">
      <div className="flex border-1 rounded-md w-full h-15">
        <Popover open={converterSelectionPopoverOpen} onOpenChange={setConverterSelectionPopoverOpen}>
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
            {converterSelectionPopoverContent(step, setConverterSelectionPopoverOpen)}
          </PopoverContent>
        </Popover>
        <div className="flex flex-row w-fit">
          <div className="flex flex-row mx-5">
            <Popover open={configPopoverOpen} onOpenChange={setConfigPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="flex flex-col justify-center">
                  <Settings size={18} />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 backdrop-blur-sm border border-slate-200 shadow-lg"
              >
                {configPopoverContent(step)}
              </PopoverContent>
            </Popover>
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

function converterSelectionPopoverContent(step: PipelineStep, setOpen: (open: boolean) => void) {
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
                )} />
            </CommandItem>
          );
        })}
      </CommandGroup>
    </CommandList>
  </Command>;
}

function configPopoverContent(step: PipelineStep) {
  return (
    <div className="p-2 bg-transparent">
      <div className="flex flex-col items-center ">
        <div className="flex flex-row">
          <span className="text-lg font-semibold mb-2">Configuration for {step.name}</span>
        </div>
        {step.config.map((item) => stepConfigItem(step, item))}
      </div>
    </div>
  );
}

function stepConfigItem(step: PipelineStep, item: PipelineStepConfig) {
  return <div className="flex flex-row">
    <label htmlFor={item.name} className="text-sm font-medium self-center">{item.name}</label>
    <input
      type={getTypeName(item.type)}
      id="step-name"
      onChange={() => {
        usePipelineStore.getState().updateStepConfig(step.id, item);
      }}
      className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 "
    />
  </div>
}

function getTypeName(type: string) {
  switch (type) {
    case "string":
      return "String";
    case "number":
      return "Number";
    case "boolean":
      return "Boolean";
    default:
      return type;
  }
}