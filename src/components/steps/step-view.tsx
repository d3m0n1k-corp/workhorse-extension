import { FileDown, FileUp, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Step } from "./step";

export function StepView() {
    return (
        <div className="grow flex flex-col items-start justify-center min-w-full">
            <div className="flex flex-col items-start justify-center min-w-full min-h-full">
                <div className="flex flex-row min-w-full justify-between">
                    <div className="flex ">
                        <h1 className="text-2xl my-2">Builder</h1>
                        <div className="flex flex-col items-start justify-center mx-4 py-0">
                            <input type="text" placeholder="Pipeline Name" className="border-1 rounded-md" />
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
                <div className="grow flex flex-row items-center justify-center my-2 min-w-full">
                    <Step />
                </div>
            </div>
        </div>
    )
}