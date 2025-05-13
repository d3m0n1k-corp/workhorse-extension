import { PipelineGrid } from "./pipeline-grid";
import { SavedPipeline } from "./saved-pipeline";
import { useEffect } from "react";
import { getPipelineObjects } from "@/services/saved-pipelines";
import { PipelineObject } from "@/lib/objects";



export function PipelineView({ className, savedPipelineInput }: { className?: string, savedPipelineInput: PipelineObject[] }) {
    useEffect(() => {
        getPipelineObjects(0, 10);
    }, []);

    return (
        <div className={`${className}`}>
            <div className="flex flex-col items-start justify-center min-w-full">
                <h1 className="text-2xl my-2">Saved Pipelines</h1>
                <div className="flex flex-row items-center justify-center my-2 min-w-full">
                    <PipelineGrid className="overflow-y-scroll h-40 min-w-full">
                        {savedPipelineInput.map((pipeline) => (
                            <SavedPipeline
                                key={pipeline.id}
                                id={pipeline.id}
                                name={pipeline.name}
                                step_count={pipeline.step_count}
                            />
                        ))}
                    </PipelineGrid>
                </div>
            </div>
        </div>
    )
}