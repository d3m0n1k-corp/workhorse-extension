export type PipelineStep = {
    id: string;
    name: string;
    config: Record<string, string | number | boolean | null>;
}

export type Pipeline = {
    name: string;
    steps: PipelineStep[];
}