import { IOView } from "@/components/io/io-view";
import "./App.css";
import { PipelineView } from "@/components/pipelines/pipeline-view";
import { StepView } from "@/components/steps/step-view";
import { DatabaseDebugger } from "@/components/debug/database-debugger";
import { usePipelineStore, useSavedPipelineStore } from "@/lib/store";

function App() {
  const pipeline = usePipelineStore((state) => state.pipeline);
  const savedPipelines = useSavedPipelineStore((state) => state.savedPipelines);
  return (
    <div className="flex-col flex min-w-full min-h-full">
      {import.meta.env.DEV && <DatabaseDebugger />}
      <StepView pipelineInput={pipeline} />
      <IOView />
      <PipelineView savedPipelineInput={savedPipelines} />
    </div>
  );
}

export default App;
