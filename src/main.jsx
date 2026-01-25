import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider} from './components/themeProvider'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
       <App />
    </ThemeProvider></BrowserRouter>
  </StrictMode>,
)
