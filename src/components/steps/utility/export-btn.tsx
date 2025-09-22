import { Button } from "@/components/ui/button";
import { usePipelineStore } from "@/lib/store";
import { FileUp } from "lucide-react";

function exportFile() {
    console.log("Exporting file...");
    const pipeline = usePipelineStore.getState().pipeline;
    if (pipeline.name === undefined || pipeline.name === "") {
        pipeline.name = "pipeline";
    }
    const blob = new Blob([JSON.stringify(pipeline)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pipeline.json";
    a.click();
    URL.revokeObjectURL(url);
}

export function ExportButton() {
    return <Button onClick={() => exportFile()}>
        <FileUp />
        Export
    </Button>;
}
