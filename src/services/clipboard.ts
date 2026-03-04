export async function readFromClipboard(): Promise<string> {
    try {
        if (!navigator.clipboard || !navigator.clipboard.readText) {
            throw new Error("Clipboard API not available");
        }
        const text = await navigator.clipboard.readText();
        // Normalize line endings to LF for consistency
        return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    } catch (error) {
        throw new Error("Failed to read from clipboard. Permission denied or clipboard API unavailable.");
    }
}

export function copyToClipboard(text: string): boolean {
    try {
        // Normalize line endings to LF for consistency
        const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Create temporary textarea for reliable copying
        const textarea = document.createElement('textarea');
        textarea.value = normalizedText;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 99999);

        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
    } catch (error) {
        console.error("Error copying to clipboard:", error);
        return false;
    }
}