import { FileDown, FileUp, MoveDown, Plus, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Step } from './step';
import { Pipeline, PipelineStepConfig } from '@/lib/objects';
import { usePipelineStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseManager } from '@/lib/db/manager';
import { savePipeline } from '@/services/saved-pipelines';

function importFile() {
  console.log('Importing file...');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
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

function exportFile() {
  console.log('Exporting file...');
  const pipeline = usePipelineStore.getState().pipeline;
  if (pipeline.name === undefined || pipeline.name === '') {
    pipeline.name = 'pipeline';
  }
  const blob = new Blob([JSON.stringify(pipeline)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pipeline.json';
  a.click();
  URL.revokeObjectURL(url);
}

async function appendStep() {
  const config = await DatabaseManager.converter.getFirstConverterDefinition();
  const newStep = {
    id: uuidv4(),
    name: config.name,
    config:
      config.config?.map((item) => {
        return {
          name: item.name,
          type: item.type,
          default: item.default,
          value: item.default,
        } as PipelineStepConfig;
      }) ?? [],
  };
  usePipelineStore.getState().addStep(newStep);
}

export function StepView({ pipelineInput }: { pipelineInput: Pipeline }) {
  const populateSteps = () => {
    return (
      <>
        {...pipelineInput.steps.map((step, index) => {
          return (
            <>
              <Step step={step} key={index} />
              {index < pipelineInput.steps.length - 1 ? (
                <MoveDown className="my-2" size={16} />
              ) : (
                <></>
              )}
            </>
          );
        })}
      </>
    );
  };

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
              <Button
                onClick={() => {
                  console.log('Saving pipeline...');
                  savePipeline(usePipelineStore.getState().pipeline)
                    .then(() => {
                      console.log('Pipeline saved');
                    })
                    .catch((err) => {
                      console.error('Error saving pipeline', err);
                    });
                }}
              >
                <Save />
                Save Pipeline
              </Button>
            </div>
          </div>
          <div className="flex flex-row ">
            <div className="flex flex-col items-start justify-center py-0">
              <Button onClick={() => importFile()}>
                <FileDown />
                Import
              </Button>
            </div>
            <div className="flex flex-col items-start justify-center py-0">
              <Button onClick={() => exportFile()}>
                <FileUp />
                Export
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-2 min-w-full overflow-y-scroll max-h-50 no-scrollbar">
          {populateSteps()}
        </div>
        <div className="grow flex flex-col items-center justify-center min-w-full">
          <Button className="w-20" onClick={() => appendStep()}>
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  );
}
