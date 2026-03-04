import { useState } from "react";
import { Pipeline } from "@/lib/objects";
import { chain_execute } from "@/wasm/operations";

export function usePipelineExecution() {
    const [isExecuting, setIsExecuting] = useState<boolean>(false);

    const executePipeline = async (pipeline: Pipeline, input: string): Promise<string> => {
        setIsExecuting(true);
        try {
            // Convert pipeline steps to chain requests
            const chainRequests = pipeline.steps.map(step => ({
                name: step.name,
                config_json: JSON.stringify(
                    step.config.reduce((acc, config) => {
                        acc[config.name] = config.value;
                        return acc;
                    }, {} as Record<string, any>)
                )
            }));

            const result = chain_execute(chainRequests, input);

            if (result.Error) {
                throw new Error(result.Error);
            }

            if (result.Result && result.Result.length > 0) {
                const lastResult = result.Result[result.Result.length - 1];
                if (lastResult.error) {
                    throw new Error(lastResult.error);
                }
                return lastResult.output;
            }

            throw new Error("No output from pipeline");
        } finally {
            setIsExecuting(false);
        }
    };

    return { executePipeline, isExecuting };
}