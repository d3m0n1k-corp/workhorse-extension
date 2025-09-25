import { useEffect, useState } from "react";
import { DatabaseManager } from "@/lib/db/manager";
import { PipelineDbObject, PipelineStepDbObject } from "@/lib/objects";

export function DatabaseDebugger() {
    const [pipelines, setPipelines] = useState<PipelineDbObject[]>([]);
    const [steps, setSteps] = useState<Record<string, PipelineStepDbObject[]>>({});

    useEffect(() => {
        async function loadData() {
            try {
                const pipelineList = await DatabaseManager.pipeline.listPipelines(0, 10);
                setPipelines(pipelineList);

                const stepsData: Record<string, PipelineStepDbObject[]> = {};
                for (const pipeline of pipelineList) {
                    const pipelineSteps = await DatabaseManager.step.getSteps(pipeline.id);
                    stepsData[pipeline.id] = pipelineSteps;
                }
                setSteps(stepsData);
            } catch (error) {
                console.error("Error loading database data:", error);
            }
        }

        loadData();
    }, []);

    if (pipelines.length === 0) {
        return <div className="p-4 bg-yellow-100 border rounded">No saved pipelines found</div>;
    }

    return (
        <div className="p-4 bg-gray-100 border rounded max-h-96 overflow-y-auto">
            <h3 className="font-bold mb-4">Database Debug Info</h3>
            {pipelines.map((pipeline) => (
                <div key={pipeline.id} className="mb-4 p-2 bg-white border rounded">
                    <div className="font-semibold">Pipeline: {pipeline.name}</div>
                    <div className="text-sm text-gray-600">ID: {pipeline.id}</div>
                    <div className="mt-2">
                        <div className="font-medium">Steps:</div>
                        {steps[pipeline.id]?.map((step, index) => (
                            <div key={step.id} className={`ml-4 text-sm ${step.name === pipeline.name ? 'bg-red-100 text-red-800' : 'text-gray-700'
                                }`}>
                                Step {index + 1} (order: {step.order ?? 'undefined'}): "{step.name}" {step.name === pipeline.name && '⚠️ (INCORRECT - matches pipeline name)'}
                            </div>
                        )) || <div className="ml-4 text-sm text-gray-500">Loading...</div>}
                    </div>
                </div>
            ))}
        </div>
    );
}