import { Clipboard, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopupInputProps {
    hasInput: boolean;
    inputLength: number;
    onClipboardClick: () => void;
    onFileClick: () => void;
}

export function PopupInput({ hasInput, inputLength, onClipboardClick, onFileClick }: PopupInputProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Input</label>
                <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={onClipboardClick} title="Paste from clipboard">
                        <Clipboard className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={onFileClick} title="Upload file">
                        <File className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {hasInput && (
                <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded border">
                    ✓ Input ready ({inputLength.toLocaleString()} characters)
                </div>
            )}
        </div>
    );
}