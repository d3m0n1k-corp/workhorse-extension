import { FileDown, FileUp, MoveDown, Plus, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Step } from "./step";
import { Pipeline } from "@/lib/objects";
import { useState } from "react";

export function StepView({
    pipeline: pipeline,
}: {
    pipeline: Pipeline
}) {

    const [pipelineObject, _setPipeline] = useState(pipeline);
    const [steps, _setSteps] = useState(pipelineObject.steps || []);
    const [name, setName] = useState(pipelineObject.name || "");

    const populateSteps = () => {
        return (
            <>
                {...steps.map((step, _index) => {
                    return (
                        <>
                            <Step name={step.name} config={step.config} />
                            <MoveDown className="my-2" size={16} />
                        </>
                    )
                })}
            </>
        )
    }

    return (
        <div className="grow flex flex-col items-start justify-center min-w-full">
            <div className="flex flex-col items-start justify-center min-w-full min-h-full">
                <div className="flex flex-row min-w-full justify-between">
                    <div className="flex ">
                        <h1 className="text-3xl my-2">Builder</h1>
                        <div className="flex flex-col items-start justify-center mx-4 py-0">
                            <input type="text" placeholder="Pipeline Name" className="border-1 rounded-md p-2" value={name} onChange={(e) => { setName(e.target.value) }} />
                        </div>
                        <div className="flex flex-col items-start justify-center py-0">
                            <Button><Save />Save Pipeline</Button>
                        </div>
                    </div>
                    <div className="flex flex-row ">
                        <div className="flex flex-col items-start justify-center py-0">
                            <Button><FileDown />Import</Button>
                        </div>
                        <div className="flex flex-col items-start justify-center py-0">
                            <Button><FileUp />Export</Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-2 min-w-full overflow-y-scroll max-h-50 no-scrollbar">
                    {populateSteps()}
                </div>
                <div className="grow flex flex-col items-center justify-center min-w-full">
                    <Button className="w-20">
                        <Plus />
                    </Button>
                </div>
            </div>
        </div >
    )
}