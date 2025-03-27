import { Pencil, Play, Trash2 } from "lucide-react"

export function SavedPipeline({
    id,
    name,
    step_count,
}: {
    id: string
    name: string
    step_count: number
}) {
    console.log(id)
    return (
        <div className="flex flex-col items-center justify-between p-4 rounded-lg shadow-md border-gray-400 border-1 min-w-3xs">
            <div className="min-w-full font-semibold">
                {name}
            </div>
            <div className="min-w-full text-xs my-1">
                {step_count} steps
            </div>
            <div className="flex flex-row min-w-full text-xs font-extralight justify-between">
                <div><Play size={15} /></div>
                <div>
                    <div className="flex flex-row justify-between">
                        <Pencil size={15} />

                        <span className="w-1" />
                        <Trash2 size={15} />
                    </div>
                </div>
            </div>
        </div >
    )
}