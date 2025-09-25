import { Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { PipelineStep } from "@/lib/objects";
import { usePipelineStore } from "@/lib/store";
import { StepSelectionPopover } from "./step/step-selection-popover";
import { ConfigPopover } from "./step/config-selection-popover";

export function Step({ step }: { step: PipelineStep }) {
  const [converterSelectionPopoverOpen, setConverterSelectionPopoverOpen] = useState(false);
  const [converterSelectionPopoverWidth, setConverterSelectionPopoverWidth] = useState(0);
  const converterSelectorTriggerRef = useRef<HTMLDivElement>(null);

  const [configPopoverOpen, setConfigPopoverOpen] = useState(false);

  useEffect(() => {
    if (converterSelectionPopoverOpen && converterSelectorTriggerRef.current) {
      setConverterSelectionPopoverWidth(converterSelectorTriggerRef.current.offsetWidth);
    }
  }, [converterSelectionPopoverOpen]);
  return (
    <div className="flex flex-row w-full">
      <div className="flex border-1 rounded-md w-full h-15">
        <StepSelectionPopover converterSelectionPopoverOpen={converterSelectionPopoverOpen} setConverterSelectionPopoverOpen={setConverterSelectionPopoverOpen} converterSelectorTriggerRef={converterSelectorTriggerRef} step={step} converterSelectionPopoverWidth={converterSelectionPopoverWidth} />
        <div className="flex flex-row w-fit">
          <div className="flex flex-row mx-5">
            <ConfigPopover configPopoverOpen={configPopoverOpen} setConfigPopoverOpen={setConfigPopoverOpen} step={step} />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center mx-5">
        <Trash2
          size={18}
          onClick={() => {
            usePipelineStore.getState().removeStep(step.id);
          }}
        />
      </div>
    </div>
  );
}






