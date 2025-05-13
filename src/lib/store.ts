import { create } from 'zustand';
import { Pipeline, PipelineObject, PipelineStep } from './objects';

type PipelineStore = {
  pipeline: Pipeline;
  replacePipeline: (pipeline: Pipeline) => void;
  addStep: (step: PipelineStep) => void;
  removeStep: (id: string) => void;
  updateStep: (stepId: string, step: PipelineStep) => void;
  renamePipeline: (name: string) => void;
};

export const usePipelineStore = create<PipelineStore>()((set) => ({
  pipeline: {
    name: '',
    steps: [],
  },

  replacePipeline: (pipeline: Pipeline) => set(() => ({ pipeline })),
  renamePipeline: (name: string) =>
    set((state) => {
      return { pipeline: { ...state.pipeline, name } };
    }),
  addStep: (step: PipelineStep) =>
    set((state) => {
      const steps = [...state.pipeline.steps, step];
      return { pipeline: { ...state.pipeline, steps } };
    }),
  removeStep: (id: string) =>
    set((state) => {
      const steps = state.pipeline.steps.filter((step) => step.id !== id);
      return { pipeline: { ...state.pipeline, steps } };
    }),
  updateStep: (stepId: string, step: PipelineStep) =>
    set((state) => {
      const steps = state.pipeline.steps.map((s) =>
        s.id === stepId ? step : s,
      );
      return { pipeline: { ...state.pipeline, steps } };
    }),
}));

type SavedPipelineStore = {
  savedPipelines: PipelineObject[];
  replaceSavedPipelines: (pipelines: PipelineObject[]) => void;
  addSavedPipeline: (pipeline: PipelineObject) => void;
  removeSavedPipeline: (id: string) => void;
};

export const useSavedPipelineStore = create<SavedPipelineStore>()((set) => ({
  savedPipelines: [],
  replaceSavedPipelines: (pipelines: PipelineObject[]) =>
    set(() => ({ savedPipelines: pipelines })),
  addSavedPipeline: (pipeline: PipelineObject) =>
    set((state) => {
      const savedPipelines = [...state.savedPipelines, pipeline];
      return { savedPipelines };
    }),
  removeSavedPipeline: (id: string) =>
    set((state) => {
      const savedPipelines = state.savedPipelines.filter(
        (pipeline) => pipeline.id !== id,
      );
      return { savedPipelines };
    }),
}));
