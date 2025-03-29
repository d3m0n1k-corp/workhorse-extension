import { FileDown, FileUp, MoveDown, Plus, Save } from "lucide-react";
import { Button } from "../ui/button";
import { listConnectorNames, Step } from "./step";
import { Pipeline } from "@/lib/objects";
import { usePipelineStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";



export function StepView({
    pipelineInput,
}: {
    pipelineInput: Pipeline
}) {
    const populateSteps = () => {
        return (
            <>
                {...pipelineInput.steps.map((step, index) => {
                    return (
                        <>
                            <Step step={step} key={index} />
                            {(index < pipelineInput.steps.length - 1) ? <MoveDown className="my-2" size={16} /> : <></>}
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
                        usePipelineStore.getState().replacePipeline(pipeline);
                    }
                };
                reader.readAsText(file);
            }
        };
        fileInput.click();
    }

    function appendStep() {
        var newStep = {
            id: uuidv4(),
            name: listConnectorNames()[0],
            config: {} as Record<string, any>,
        };
        usePipelineStore.getState().addStep(newStep);
    }


    return (
        <div className="grow flex flex-col items-start justify-center min-w-full">
            <div className="flex flex-col items-start justify-center min-w-full min-h-full">
                <div className="flex flex-row min-w-full justify-between">
                    <div className="flex ">
                        <h1 className="text-3xl my-2">Builder</h1>
                        <div className="flex flex-col items-start justify-center mx-4 py-0">
                            <input type="text" placeholder="Pipeline Name" className="border-1 rounded-md p-2"
                                value={pipelineInput.name}
                                onChange={(e) => {
                                    pipelineInput.name = e.target.value;
                                    usePipelineStore.getState().replacePipeline(pipelineInput)
                                }}
                            />
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