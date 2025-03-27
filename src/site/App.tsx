import { IOView } from '@/components/io/io-view'
import './App.css'
import { PipelineView } from '@/components/pipelines/pipeline-view'
import { StepView } from '@/components/steps/step-view'

function App() {

  return (
    <div className='flex-col flex min-w-full min-h-full'>
      <StepView />
      <IOView />
      <PipelineView />
    </div>
  )
}

export default App
