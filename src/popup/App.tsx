import { useEffect, useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastNotification } from "@/components/ui/toast";
import { PipelineSelector } from "@/components/popup/pipeline-selector";
import { PopupInput } from "@/components/popup/popup-input";
import { PopupOutput } from "@/components/popup/popup-output";
import { useSavedPipelineStore } from "@/lib/store";
import { getPipelineObjects, getPipelineById } from "@/services/saved-pipelines";
import { readFromClipboard, copyToClipboard } from "@/services/clipboard";
import { readFileAsText, downloadAsFile } from "@/services/file";
import { useToast } from "@/hooks/use-toast";
import { usePipelineExecution } from "@/hooks/use-pipeline-execution";
import { PipelineObject, Pipeline } from "@/lib/objects";
import "./App.css";

function App() {
  const { savedPipelines } = useSavedPipelineStore();
  const { toast, showToast } = useToast();
  const { executePipeline, isExecuting } = usePipelineExecution();

  const [selectedPipeline, setSelectedPipeline] = useState<PipelineObject | null>(null);
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPipelines = async () => {
      try {
        await getPipelineObjects(0, 100);
      } catch (error) {
        showToast("error", "Failed to load pipelines");
      } finally {
        setIsLoading(false);
      }
    };
    loadPipelines();
  }, [showToast]);

  const handlePipelineSelect = async (pipelineObj: PipelineObject) => {
    setSelectedPipeline(pipelineObj);
    try {
      const loadedPipeline = await getPipelineById(pipelineObj.id);
      setPipeline(loadedPipeline);
      showToast("success", `Pipeline "${pipelineObj.name}" loaded`);
    } catch (error) {
      showToast("error", "Failed to load pipeline");
    }
  };

  const handleClipboardInput = async () => {
    try {
      const text = await readFromClipboard();
      setInput(text);
      showToast("success", `Input loaded from clipboard (${text.length} chars)`);
    } catch (error) {
      showToast("error", "Failed to read from clipboard");
    }
  };

  const handleFileInput = async () => {
    try {
      const { content, fileName } = await readFileAsText();
      setInput(content);
      showToast("success", `File "${fileName}" loaded (${content.length} chars)`);
    } catch (error) {
      showToast("error", "Failed to read file");
    }
  };

  const handleCopyOutput = () => {
    const success = copyToClipboard(output);
    showToast(success ? "success" : "error", success ? "Output copied to clipboard" : "Failed to copy to clipboard");
  };

  const handleDownloadOutput = () => {
    try {
      const fileName = `output-${selectedPipeline?.name || 'pipeline'}-${Date.now()}.txt`;
      downloadAsFile(output, fileName);
      showToast("success", "Output downloaded");
    } catch (error) {
      showToast("error", "Failed to download file");
    }
  };

  const handleExecutePipeline = async () => {
    if (!selectedPipeline || !input || !pipeline) return;

    try {
      console.log("Executing pipeline:", selectedPipeline.name,
        "with input: ", input
      );
      const result = await executePipeline(pipeline, input);
      setOutput(result);
      showToast("success", "Pipeline executed successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Pipeline execution failed";
      setOutput(`Error: ${errorMessage}`);
      showToast("error", "Pipeline execution failed");
    }
  };

  const handleClearAll = () => {
    setInput("");
    setOutput("");
    showToast("success", "Cleared input and output");
  };

  const handleOpenInTab = () => {
    const extensionUrl = (globalThis as any).chrome.runtime.getURL('index.html');
    (globalThis as any).chrome.tabs.create({ url: extensionUrl });
  };

  if (isLoading) {
    return (
      <div className="w-80 p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-sm text-muted-foreground">Loading pipelines...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 min-h-96 flex flex-col">
      <div className="flex-1 p-4 space-y-4 relative">
        <ToastNotification toast={toast} />

        {/* Header */}
        <div className="text-center relative">
          <h1 className="text-lg font-semibold">Workhorse</h1>
          <p className="text-xs text-muted-foreground">Quick Pipeline Execution</p>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleOpenInTab}
            className="absolute right-0 top-0 p-1 h-6 w-6"
            title="Open in new tab"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>

        {/* Pipeline Selection */}
        <PipelineSelector
          savedPipelines={savedPipelines}
          selectedPipeline={selectedPipeline}
          onPipelineSelect={handlePipelineSelect}
        />

        {/* Input Section */}
        <PopupInput
          hasInput={!!input}
          inputLength={input.length}
          onClipboardClick={handleClipboardInput}
          onFileClick={handleFileInput}
        />

        {/* Execute Button */}
        {selectedPipeline && input && (
          <Button
            onClick={handleExecutePipeline}
            disabled={isExecuting}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {isExecuting ? "Processing..." : `Run ${selectedPipeline.name}`}
          </Button>
        )}

        {/* Output Section */}
        {output && (
          <PopupOutput
            output={output}
            onCopyClick={handleCopyOutput}
            onDownloadClick={handleDownloadOutput}
          />
        )}

        {/* Clear Button */}
        {(input || output) && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Footer - Always at bottom */}
      <div className="text-center p-4 border-t bg-background">
        <div className="text-xs text-muted-foreground">Workhorse Extension v1.0</div>
      </div>
    </div>
  );
}

export default App;
