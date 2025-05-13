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

export type PipelineDbObject = {
    id: string;
    name: string;
};

export type PipelineStepDbObject = {
    id: string;
    name: string;
    pipeline_id: string;
    config: PipelineStepConfig[];
}

export type PipelineObject = {
    id: string;
    name: string;
    step_count: number;
}
