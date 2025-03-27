import { Textarea } from '@/components/ui/textarea'
import './App.css'
import { execute_converter } from '@/wasm/operations'
import { Button } from '@/components/ui/button'

async function submit() {
  const inp = document.getElementById('inp') as HTMLTextAreaElement
  const out = document.getElementById('out') as HTMLTextAreaElement
  out.value = inp.value

  await (async () => {
    var config = {}
    var response = execute_converter("json_to_yaml", inp.value, JSON.stringify(config))
    out.value = response.Result;
  })();

}

function App() {

  return (
    <div className='min-w-full min-h-full'>
      < Textarea id='inp' />
      <Textarea id='out' />
      <Button onClick={submit}>Test</Button>
    </div>
  )
}

export default App
