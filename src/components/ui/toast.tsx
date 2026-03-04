import { AlertCircle, CheckCircle } from "lucide-react";
import { Toast } from "@/hooks/use-toast";

interface ToastNotificationProps {
    toast: Toast;
}

export function ToastNotification({ toast }: ToastNotificationProps) {
    if (!toast.type) return null;

    return (
        <div className={`fixed top-2 left-2 right-2 z-50 p-2 rounded-md flex items-center gap-2 text-sm ${toast.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}>
            {toast.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
            ) : (
                <AlertCircle className="h-4 w-4" />
            )}
            {toast.message}
        </div>
    );
}