/// <reference types="vite/client" />

declare global {
    const chrome: {
        runtime: {
            getURL: (path: string) => string;
        };
        tabs: {
            create: (options: { url: string }) => void;
        };
    };
}

export { };
