import { Textarea } from '@/components/ui/textarea'
import './App.css'
import { Button } from '@/components/ui/button'
import { execute_converter } from '@/wasm/operations'

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
    < div className='flex flex-col justify-evenly min-h-full' >
      <Textarea id='inp' className='min-w-200 min-h-100' />
      <Textarea id='out' className='min-w-200 min-h-100' />
      <Button onClick={submit}>Test</Button>
    </div >
  )
}

export default App
