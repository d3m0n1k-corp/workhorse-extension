import { InputBox } from "./input";
import { OutputBox } from "./output";

export function IOView({ className = "" }: { className?: string }) {
    return (
        <div className={`${className}`}>
            <div className="flex flex-col items-start justify-center min-w-full">
                <div className="flex flex-row items-center justify-center my-2 min-w-full">
                    <InputBox />
                    <span className="w-8" />
                    <OutputBox />
                </div>
            </div>
        </div >
    )
}