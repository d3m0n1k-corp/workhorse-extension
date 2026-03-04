export function readFileAsText(): Promise<{ content: string; fileName: string }> {
    return new Promise((resolve, reject) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "text/*";

        fileInput.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) {
                reject(new Error("No file selected"));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                // Normalize line endings to LF for consistency
                const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                resolve({ content: normalizedContent, fileName: file.name });
            };
            reader.onerror = () => {
                reject(new Error("Failed to read file"));
            };
            reader.readAsText(file);
        };

        fileInput.click();
    });
}

export function downloadAsFile(content: string, fileName: string): void {
    try {
        // Normalize line endings to LF for consistency
        const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const blob = new Blob([normalizedContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error("Failed to download file");
    }
}