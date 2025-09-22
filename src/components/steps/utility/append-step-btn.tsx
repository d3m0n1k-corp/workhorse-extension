import { Button } from "@/components/ui/button";
import { DatabaseManager } from "@/lib/db/manager";
import { PipelineStepConfig } from "@/lib/objects";
import { usePipelineStore } from "@/lib/store";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

async function appendStep() {
    const config = await DatabaseManager.converter.getFirstConverterDefinition();
    const newStep = {
        id: uuidv4(),
        name: config.name,
        config:
            config.config?.map((item) => {
                return {
                    name: item.name,
                    type: item.type,
                    default: item.default,
                    value: item.default,
                } as PipelineStepConfig;
            }) ?? [],
    };
    usePipelineStore.getState().addStep(newStep);
}

export function AppendStep() {
    return <Button className="w-20" onClick={() => appendStep()}>
        <Plus />
    </Button>;
}

