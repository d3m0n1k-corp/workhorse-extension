import { MoveDown, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Step } from "./step";
import { usePipelineStore } from "@/lib/store";
import { savePipeline } from "@/services/saved-pipelines";
import { ImportButton } from "./utility/import-btn";
import { ExportButton } from "./utility/export-btn";
import { AppendStep } from "./utility/append-step-btn";
import { Pipeline } from "@/lib/objects";

function StepList({ step, index, pipelineInput }: { step: any; index: number; pipelineInput: Pipeline }) {
  return (
    <>
      <Step step={step} key={index} />
      {
        index < pipelineInput.steps.length - 1 ? (
          <MoveDown className="my-2" size={16} />
        ) : (
          <></>
        )
      }
    </>
  );
}

const populateSteps = (pipelineInput: Pipeline) => {
  return (
    <>
      {...pipelineInput.steps.map((step, index) => {
        return <StepList step={step} index={index} pipelineInput={pipelineInput} key={index} />;
      })}
    </>
  );
};

export function StepView({ pipelineInput }: { pipelineInput: Pipeline }) {

  return (
    <div className="grow flex flex-col items-start justify-center min-w-full">
      <div className="flex flex-col items-start justify-center min-w-full min-h-full">
        <div className="flex flex-row min-w-full justify-between">
          <div className="flex ">
            <h1 className="text-3xl my-2">Builder</h1>
            <div className="flex flex-col items-start justify-center mx-4 py-0">
              <input
                type="text"
                placeholder="Pipeline Name"
                className="border-1 rounded-md p-2"
                value={pipelineInput.name}
                id="pipeline-name"
                onChange={(e) => {
                  usePipelineStore.getState().renamePipeline(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col items-start justify-center py-0">
              <SavePipelineButton />
            </div>
          </div>
          <div className="flex flex-row ">
            <div className="flex flex-col items-start justify-center py-0">
              <ImportButton />
            </div>
            <div className="flex flex-col items-start justify-center py-0">
              <ExportButton />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-2 min-w-full overflow-y-scroll max-h-50 no-scrollbar">
          {populateSteps(pipelineInput)}
        </div>
        <div className="grow flex flex-col items-center justify-center min-w-full">
          <AppendStep />
        </div>
      </div>
    </div>
  );
}

function SavePipelineButton() {
  var onClick = () => {
    console.log("Saving pipeline...");
    savePipeline(usePipelineStore.getState().pipeline)
      .then(() => {
        console.log("Pipeline saved");
      })
      .catch((err) => {
        console.error("Error saving pipeline", err);
      });
  };

  return <Button onClick={onClick}><Save /> Save Pipeline</Button>;
}
