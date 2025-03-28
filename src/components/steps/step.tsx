import { ChevronDown, Settings, Trash2 } from "lucide-react"

export function Step({
    name,
    config,
}: {
    name: string
    config: any
}) {
    console.log("Step config", config)
    return (
        <div className="flex flex-row w-full">
            <div className="flex border-1 rounded-md w-full h-15 justify-between">
                <div className="flex flex-col justify-center mx-5 font-semibold">
                    {name}
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-row mx-5">
                        <div className="flex flex-col justify-center mx-2">
                            <ChevronDown size={18} />
                        </div>
                        <div className="flex flex-col justify-center">
                            <Settings size={18} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center mx-5">
                <Trash2 size={18} />
            </div>
        </div>
    )
}