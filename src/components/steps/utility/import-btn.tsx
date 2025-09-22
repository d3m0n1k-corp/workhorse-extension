import { usePipelineStore } from "@/lib/store";
import { Button } from "../../ui/button";
import { FileDown } from "lucide-react";

function importFile() {
    console.log("Importing file...");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (content) {
                    const pipeline = JSON.parse(content as string);
                    usePipelineStore.getState().replacePipeline(pipeline);
                }
            };
            reader.readAsText(file);
        }
    };
    fileInput.click();
}

export function ImportButton() {
    return <Button onClick={() => importFile()}>
        <FileDown />
        Import
    </Button>;
}

