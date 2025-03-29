import { IOView } from '@/components/io/io-view'
import './App.css'
import { PipelineView } from '@/components/pipelines/pipeline-view'
import { StepView } from '@/components/steps/step-view'
import { usePipelineStore } from '@/lib/store'

function App() {

  const pipeline = usePipelineStore((state) => state.pipeline)
  return (
    <div className='flex-col flex min-w-full min-h-full'>
      <StepView pipelineInput={pipeline} />
      <IOView />
      <PipelineView />
    </div>
  )
}

export default App
