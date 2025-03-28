export type PipelineStep = {
    name: string;
    config: Record<string, any>;
}

export type Pipeline = {
    name: string;
    steps: PipelineStep[];
}