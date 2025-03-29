import { create } from 'zustand'
import { Pipeline, PipelineStep } from './objects'

type PipelineStore = {
    pipeline: Pipeline;
    replacePipeline: (pipeline: Pipeline) => void;
    addStep: (step: PipelineStep) => void;
    removeStep: (id: string) => void;
    updateStep: (stepId: string, step: PipelineStep) => void;
}

export const usePipelineStore = create<PipelineStore>()(
    (set) => ({
        pipeline: {
            name: '',
            steps: [],
        },

        replacePipeline: (pipeline: Pipeline) => set(() => ({ pipeline })),
        addStep: (step: PipelineStep) => set((state) => {
            const steps = [...state.pipeline.steps, step]
            return { pipeline: { ...state.pipeline, steps } }
        }),
        removeStep: (id: string) => set((state) => {
            const steps = state.pipeline.steps.filter((step) => step.id !== id)
            return { pipeline: { ...state.pipeline, steps } }
        }),
        updateStep: (stepId: string, step: PipelineStep) => set((state) => {
            const steps = state.pipeline.steps.map((s) => (s.id === stepId ? step : s))
            return { pipeline: { ...state.pipeline, steps } }
        }),
    }),
)