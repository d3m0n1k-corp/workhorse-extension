/// <reference types="vite/client" />
export {};
declare global {
  export interface Window {
    Go;
    list_converters: () => string;
    execute_converter: (
      conv_name: string,
      input: string,
      config: string,
    ) => string;
    chain_execute: (chain_links: string, input: string) => string;
  }

  export type ConfigItem = {
    name: string;
    type: string;
    default: string | null;
  };

  export type Converter = {
    name: string;
    demo_input: string;
    description: string;
    input_type: string;
    output_type: string;
    config: ConfigItem[] | null;
  };

  export type WasmResponse<T> = {
    Result: T;
    Error: string | null;
  };

  export type ChainRequest = {
    name: string;
    config_json: string;
  };

  export type ChainResult = {
    output: string;
    error: string | null;
  };
}
