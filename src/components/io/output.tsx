import { Copy, Download } from "lucide-react";

export function OutputBox({ output }: { output: string }) {
  return (
    <div className="grow">
      <div className="flex w-full justify-between my-4">
        <span>Output</span>
        <span className="flex items-center justify-center">
          <Copy size={20} />
          <span className="w-2" />
          <Download size={20} />
        </span>
      </div>
      <div className="flex-row w-full ">
        <textarea
          name="input_box"
          id="inp_box"
          className="w-full border-1 rounded-lg h-50 resize-none"
          value={output}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
