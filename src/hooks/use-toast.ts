import { useState } from "react";

export type ToastType = "success" | "error" | null;

export interface Toast {
    type: ToastType;
    message: string;
}

export function useToast() {
    const [toast, setToast] = useState<Toast>({ type: null, message: "" });

    const showToast = (type: ToastType, message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast({ type: null, message: "" }), 3000);
    };

    const hideToast = () => {
        setToast({ type: null, message: "" });
    };

    return { toast, showToast, hideToast };
}