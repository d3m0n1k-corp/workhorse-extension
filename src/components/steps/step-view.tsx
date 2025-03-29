import { FileDown, FileUp, MoveDown, Plus, Save } from "lucide-react";
import { Button } from "../ui/button";
import { listConnectorNames, Step } from "./step";
import { Pipeline } from "@/lib/objects";
import { useState } from "react";

export function StepView({
    pipelineInput,
}: {
    pipelineInput: Pipeline
}) {

    const [pipeline, _setPipeline] = useState(pipelineInput);
    const [steps, _setSteps] = useState(pipeline.steps || []);
    const [name, setName] = useState(pipeline.name || "");

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

    function importFile() {
        console.log("Importing file...");
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.onchange = (e) => {
            var file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    var content = e.target?.result;
                    if (content) {
                        var pipeline = JSON.parse(content as string);
                        _setPipeline(pipeline);
                        _setSteps(pipeline.steps || []);
                        setName(pipeline.name || "");
                    }
                };
                reader.readAsText(file);
            }
        };
        fileInput.click();
    }

    function appendStep() {
        var newStep = {
            name: listConnectorNames()[0],
            config: {} as Record<string, any>,
        };
        pipeline.steps = [...steps, newStep];
        _setSteps(pipeline.steps);
        _setPipeline(pipeline);
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
                            <Button>
                                <Save />Save Pipeline
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-row ">
                        <div className="flex flex-col items-start justify-center py-0">
                            <Button onClick={(_) => importFile()}>
                                <FileDown />Import
                            </Button>
                        </div>
                        <div className="flex flex-col items-start justify-center py-0">
                            <Button>
                                <FileUp />Export
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-2 min-w-full overflow-y-scroll max-h-50 no-scrollbar">
                    {populateSteps()}
                </div>
                <div className="grow flex flex-col items-center justify-center min-w-full">
                    <Button className="w-20" onClick={(_) => appendStep()}>
                        <Plus />
                    </Button>
                </div>
            </div>
        </div >
    )
}