import { Clipboard, File } from "lucide-react";

export function InputBox() {
    return (
        <div className="grow">
            <div className="flex w-full justify-between my-4">
                <span >Input</span>
                <span className="flex items-center justify-center">
                    <Clipboard size={20} />
                    <span className="w-2" />
                    <File size={20} />
                </span>
            </div>
            <div className="flex-row w-full ">
                <textarea name="input_box" id="inp_box" className="w-full border-1 rounded-lg h-50 resize-none">
                </textarea>
            </div>
        </div>
    )
}