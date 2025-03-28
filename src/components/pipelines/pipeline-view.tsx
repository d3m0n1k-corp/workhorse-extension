import { PipelineGrid } from "./pipeline-grid";
import { SavedPipeline } from "./saved-pipeline";

export function PipelineView({ className = "" }: { className?: string }) {
    return (
        <div className={`${className}`}>
            <div className="flex flex-col items-start justify-center min-w-full">
                <h1 className="text-2xl my-2">Saved Pipelines</h1>
                <div className="flex flex-row items-center justify-center my-2 min-w-full">
                    <PipelineGrid className="overflow-y-scroll h-40 min-w-full">
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                        <SavedPipeline id="" name="TEST1" step_count={3} />
                    </PipelineGrid>
                </div>
            </div>
        </div>
    )
}