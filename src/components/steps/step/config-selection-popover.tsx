import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PipelineStep, PipelineStepConfig } from "@/lib/objects";
import { usePipelineStore } from "@/lib/store";
import { Settings } from "lucide-react";
import { useState } from "react";

export function ConfigPopover({ configPopoverOpen, setConfigPopoverOpen, step }: { configPopoverOpen: boolean; setConfigPopoverOpen: (open: boolean) => void; step: PipelineStep }) {
    return <Popover open={configPopoverOpen} onOpenChange={setConfigPopoverOpen}>
        <PopoverTrigger asChild>
            <div className="flex flex-col justify-center cursor-pointer hover:bg-gray-100 rounded p-1">
                <Settings size={18} />
            </div>
        </PopoverTrigger>
        <PopoverContent
            className="w-80 p-4 backdrop-blur-sm border border-slate-200 shadow-lg"
        >
            {ConfigPopoverContent(step, setConfigPopoverOpen)}
        </PopoverContent>
    </Popover>;
}

function ConfigPopoverContent(step: PipelineStep, setConfigPopoverOpen: (open: boolean) => void) {
    const [localConfig, setLocalConfig] = useState<Record<string, string | number | boolean | null>>(
        step.config.reduce((acc, item) => {
            acc[item.name] = item.value !== null ? item.value : item.default;
            return acc;
        }, {} as Record<string, string | number | boolean | null>)
    );

    const handleSave = () => {
        // Update all config items with new values
        step.config.forEach((item) => {
            const updatedItem: PipelineStepConfig = {
                ...item,
                value: localConfig[item.name] !== undefined ? localConfig[item.name] : item.default
            };
            usePipelineStore.getState().updateStepConfig(step.id, updatedItem);
        });
        setConfigPopoverOpen(false);
    };

    const handleCancel = () => {
        setConfigPopoverOpen(false);
    };

    // If no config items, show message
    if (!step.config || step.config.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-3">Configuration for {step.name}</h3>
                    <p className="text-sm text-gray-500 py-4">This converter has no configurable options.</p>
                </div>
                <div className="flex justify-end pt-2 border-t">
                    <Button size="sm" onClick={() => setConfigPopoverOpen(false)}>
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Configuration for {step.name}</h3>
                <div className="space-y-3">
                    {step.config.map((item) =>
                        stepConfigItem(item, localConfig, setLocalConfig)
                    )}
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                    Save
                </Button>
            </div>
        </div>
    );
}

function stepConfigItem(
    item: PipelineStepConfig,
    localConfig: Record<string, string | number | boolean | null>,
    setLocalConfig: (config: Record<string, string | number | boolean | null>) => void
) {
    const currentValue = localConfig[item.name] !== undefined ? localConfig[item.name] : item.default;

    const handleChange = (value: string | number | boolean | null) => {
        setLocalConfig({
            ...localConfig,
            [item.name]: value
        });
    };

    return (
        <div key={item.name} className="space-y-1">
            <label htmlFor={item.name} className="text-sm font-medium text-gray-700">
                {item.name}
                {item.type && (
                    <span className="text-xs text-gray-500 ml-1">({item.type})</span>
                )}
            </label>
            {renderInputField(item, currentValue, handleChange)}
        </div>
    );
}

function renderInputField(
    item: PipelineStepConfig,
    currentValue: string | number | boolean | null,
    handleChange: (value: string | number | boolean | null) => void
) {
    const inputClassName = "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    switch (item.type.toLowerCase()) {
        case "boolean":
            return (
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id={item.name}
                        checked={!!currentValue}
                        onChange={(e) => handleChange(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-600">
                        {currentValue ? "Enabled" : "Disabled"}
                    </span>
                </div>
            );

        case "number":
        case "int":
        case "integer":
            return (
                <input
                    type="number"
                    id={item.name}
                    value={typeof currentValue === 'number' ? currentValue : ''}
                    onChange={(e) => handleChange(Number(e.target.value))}
                    className={inputClassName}
                    placeholder={`Default: ${item.default}`}
                />
            );

        case "string":
        default:
            return (
                <input
                    type="text"
                    id={item.name}
                    value={typeof currentValue === 'string' ? currentValue : ''}
                    onChange={(e) => handleChange(e.target.value)}
                    className={inputClassName}
                    placeholder={`Default: ${item.default}`}
                />
            );
    }
}