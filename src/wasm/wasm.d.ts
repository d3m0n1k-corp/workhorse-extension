/// <reference types="vite/client" />
export { };
declare global {
    export interface Window {
        Go: any;
        list_converters: () => string;
        execute_converter: (conv_name: string, input: string, config: string) => string;
    }

    export type ConfigItem = {
        name: string;
        type: string;
        default: string | null;
    }

    export type Converter = {
        name: string;
        demo_input: string;
        description: string;
        input_type: string;
        output_type: string;
        config: ConfigItem[] | null;
    }

    export type ConverterDiscoveryResponse = {
        Result: Converter[]
        Error: string | null;
    }

    export type ConverterExecutionResponse = {
        Result: string;
        Error: string | null;
    }
}

