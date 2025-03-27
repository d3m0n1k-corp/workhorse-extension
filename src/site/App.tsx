import { IOView } from '@/components/io/io-view'
import './App.css'
import { PipelineView } from '@/components/pipelines/pipeline-view'

function App() {

  return (
    <div className='min-w-full min-h-full'>
      <IOView />
      <PipelineView />
    </div>
  )
}

export default App
