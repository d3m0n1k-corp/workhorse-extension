import { useState } from "react";
import { InputBox } from "./input";
import { OutputBox } from "./output";
import { chain_execute } from "@/wasm/operations";
import { Pipeline, PipelineStep } from "@/lib/objects";

function executor(pipeline: Pipeline, input: string) {
  console.log("Executing chain with input: ", input);
  if (pipeline.steps.length === 0) {
    console.error("No steps in pipeline");
    return;
  }

  const chain_in: ChainRequest[] = pipeline.steps.map((step: PipelineStep) => {
    // Build config object from step configuration
    const config = step.config.reduce((acc, configItem) => {
      const value = configItem.value !== null ? configItem.value : configItem.default;
      acc[configItem.name] = value;
      return acc;
    }, {} as Record<string, string | number | boolean | null>);

    console.log(`Step ${step.name} config:`, config);

    return {
      name: step.name,
      config_json: JSON.stringify(config),
    };
  });

  console.log("Chain request:", chain_in);
  const response = chain_execute(chain_in, input || "{}");
  if (response.Error) {
    console.error(response.Error);
  }

  return response.Result[response.Result.length - 1].output;
}

export function IOView({ className = "" }: { className?: string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className={`${className}`}>
      <div className="flex flex-col items-start justify-center min-w-full">
        <div className="flex flex-row items-center justify-center my-2 min-w-full">
          <InputBox
            input={input}
            setInput={setInput}
            setOutput={setOutput}
            executor={executor}
          />
          <span className="w-8" />
          <OutputBox output={output} />
        </div>
      </div>
    </div>
  );
}
