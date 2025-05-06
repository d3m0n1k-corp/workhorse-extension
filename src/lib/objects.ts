export type PipelineStepConfig = {
    type: string;
    name: string;
    default: string | number | boolean | null;
    value: string | number | boolean | null;
}
export type PipelineStep = {
    id: string;
    name: string;
    config: PipelineStepConfig[];
}

export type Pipeline = {
    name: string;
    steps: PipelineStep[];
}