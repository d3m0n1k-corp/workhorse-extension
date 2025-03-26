import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App.tsx';
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { LoadWasm } from "@/components/wasm/load-wasm.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <LoadWasm>
                <App />
            </LoadWasm>
        </ThemeProvider>
    </StrictMode >
)
