import { Button } from "@/components/ui/button";
import { PipelineObject } from "@/lib/objects";

interface PipelineSelectorProps {
    savedPipelines: PipelineObject[];
    selectedPipeline: PipelineObject | null;
    onPipelineSelect: (pipeline: PipelineObject) => void;
}

export function PipelineSelector({ savedPipelines, selectedPipeline, onPipelineSelect }: PipelineSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Select Pipeline</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
                {savedPipelines.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-3 text-center border rounded-md bg-muted/50">
                        No saved pipelines found.
                        <br />
                        <span className="text-xs">Create pipelines in the main app.</span>
                    </div>
                ) : (
                    savedPipelines.map((pipelineObj) => (
                        <Button
                            key={pipelineObj.id}
                            variant={selectedPipeline?.id === pipelineObj.id ? "default" : "outline"}
                            className="w-full justify-start text-sm h-auto p-2"
                            onClick={() => onPipelineSelect(pipelineObj)}
                        >
                            <div className="text-left">
                                <div className="font-medium">{pipelineObj.name}</div>
                                <div className="text-xs opacity-70">{pipelineObj.step_count} steps</div>
                            </div>
                        </Button>
                    ))
                )}
            </div>
        </div>
    );
}