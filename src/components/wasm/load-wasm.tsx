import React, { useEffect } from "react";
import "../../wasm/wasm_exec.js";
import "../../wasm/wasm.d.ts";
import { chain_execute, list_converters } from "@/wasm/operations.ts";
import { DatabaseManager } from "@/lib/db/manager.ts";

async function initialize() {
  await initializeWasmModule();
  await initializeApplication();
  await test();
}

async function initializeWasmModule() {
  const go = new window.Go();
  console.log("Type of go: ", typeof go);
  const result = await WebAssembly.instantiateStreaming(
    fetch("workhorse.wasm"),
    go.importObject,
  );
  go.run(result.instance);
}

async function initializeApplication() {
  const conv_list = list_converters();
  console.log(conv_list.Result);
  // localStorage.setItem("converter_list", JSON.stringify(conv_list.Result));
  DatabaseManager.converter.overwriteConverterDefinition(conv_list.Result);
}

async function test() {
  const chain: ChainRequest[] = [
    {
      name: "json_to_yaml",
      config_json: "{}",
    },
    {
      name: "yaml_to_json",
      config_json: JSON.stringify({
        indent_size: 1,
        indent_type: "tab",
      }),
    },
    {
      name: "json_prettifier",
      config_json: JSON.stringify({
        indent_size: 1,
        indent_type: "tab",
      }),
    },
  ];

  const input = `{
        "test" : "test1",
        "idk" : "idk",
        "idk2" : {
            "idk21" : "resp",
            "idk22" : "resp"
        }
    }`;

  const result = await chain_execute(chain, input);
  console.log(result);
}

export const LoadWasm: React.FC<React.PropsWithChildren<object>> = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    initialize().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="wasm-loader-background h-screen">
        <div className="center-of-screen">
          <div className="wasm-loader"></div>
          <div className="text-center text-white">Initializing WASM</div>
        </div>
      </div>
    );
  } else {
    return <React.Fragment>{props.children}</React.Fragment>;
  }
};
