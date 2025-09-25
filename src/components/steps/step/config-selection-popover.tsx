import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PipelineStep, PipelineStepConfig } from "@/lib/objects";
import { usePipelineStore } from "@/lib/store";
import { Settings } from "lucide-react";

export function ConfigPopover({ configPopoverOpen, setConfigPopoverOpen, step }: { configPopoverOpen: boolean; setConfigPopoverOpen: (open: boolean) => void; step: PipelineStep }) {
    return <Popover open={configPopoverOpen} onOpenChange={setConfigPopoverOpen}>
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
    </Popover>;
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