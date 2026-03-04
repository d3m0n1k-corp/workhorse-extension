import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopupOutputProps {
    output: string;
    onCopyClick: () => void;
    onDownloadClick: () => void;
}

export function PopupOutput({ output, onCopyClick, onDownloadClick }: PopupOutputProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Output</label>
                <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={onCopyClick} title="Copy to clipboard">
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={onDownloadClick} title="Download file">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded border">
                ✓ Output ready ({output.length.toLocaleString()} characters)
                {output.startsWith("Error:") && (
                    <div className="text-red-600 mt-1">⚠ Execution error occurred</div>
                )}
            </div>
        </div>
    );
}