import React, { useEffect } from "react";
import "../../wasm/wasm_exec.js";
import "../../wasm/wasm.d.ts";
import { list_converters } from "@/wasm/operations.ts";

async function initialize() {
    await initializeWasmModule();
    await initializeApplication();
}

async function initializeWasmModule() {
    const go = new window.Go();
    const result = await WebAssembly.instantiateStreaming(fetch("workhorse.wasm"), go.importObject);
    go.run(result.instance);
}

async function initializeApplication() {
    const conv_list = list_converters();
    console.log(conv_list.Result);
    localStorage.setItem("converter_list", JSON.stringify(conv_list.Result));
}

export const LoadWasm: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        initialize().then(() => {
            setIsLoading(false);
        })
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