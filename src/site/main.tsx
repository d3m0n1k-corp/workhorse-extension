import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import Layout from './layout.tsx'
import { LoadWasm } from '@/components/wasm/load-wasm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LoadWasm>
        <Layout>
          < div className='flex grow justify-evenly min-h-full min-w-full max-w-full px-10 py-5' >
            <App />
          </div>
        </Layout>
      </LoadWasm>
    </ThemeProvider>
  </StrictMode>
)
