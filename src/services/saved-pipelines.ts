import { DatabaseManager } from "@/lib/db/manager";
import {
  Pipeline,
  PipelineDbObject,
  PipelineObject,
  PipelineStep,
  PipelineStepDbObject,
} from "@/lib/objects";
import { usePipelineStore, useSavedPipelineStore } from "@/lib/store";
import { v4 } from "uuid";

export async function getPipelineObjects(offset: number, size: number) {
  const pipelines = await DatabaseManager.pipeline.listPipelines(offset, size);
  const pipelineObjects: PipelineObject[] = await Promise.all(
    pipelines.map(async (pipeline) => ({
      id: pipeline.id,
      name: pipeline.name,
      step_count: await DatabaseManager.step.countSteps(pipeline.id),
    })),
  );
  useSavedPipelineStore.getState().replaceSavedPipelines(pipelineObjects);
}

export async function savePipeline(pipeline: Pipeline) {
  const pipelineDbObject = {
    name: pipeline.name,
    id: v4(),
  } as PipelineDbObject;

  const dbSteps = pipeline.steps.map((step) => {
    return {
      id: step.id,
      name: pipelineDbObject.name,
      pipeline_id: pipelineDbObject.id,
      config: step.config,
    } as PipelineStepDbObject;
  });

  console.log("Saving pipeline into the database", pipelineDbObject);
  console.log("Saving steps into the database", dbSteps);
  await DatabaseManager.pipeline.createPipeline(pipelineDbObject);
  await DatabaseManager.step.createSteps(dbSteps);
  useSavedPipelineStore.getState().addSavedPipeline({
    id: pipelineDbObject.id,
    name: pipelineDbObject.name,
    step_count: dbSteps.length,
  });
}

export async function loadPipeline(id: string) {
  const pipeline = await DatabaseManager.pipeline.getPipeline(id);
  if (!pipeline) {
    throw new Error("Pipeline not found");
  }
  const dbSteps = await DatabaseManager.step.getSteps(id);

  const steps = dbSteps.map(
    (dbStep) =>
      ({
        id: dbStep.id,
        name: dbStep.name,
        config: dbStep.config,
      }) as PipelineStep,
  );

  usePipelineStore.getState().replacePipeline({
    name: pipeline.name,
    steps: steps,
  });
}

export async function deletePipeline(id: string) {
  await DatabaseManager.pipeline.deletePipeline(id);
  await DatabaseManager.step.deleteSteps(id);
  useSavedPipelineStore.getState().removeSavedPipeline(id);
}
