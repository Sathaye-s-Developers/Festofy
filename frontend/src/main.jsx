import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import EventContext from './Context/EventContext.jsx'
import { BrowserRouter } from "react-router-dom"
import AnimationContext from './Context/AnimationContext.jsx'
import { CookiesProvider } from "react-cookie";


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <EventContext>
          <AnimationContext>
            <App />
          </AnimationContext>
        </EventContext>
      </BrowserRouter>
    </CookiesProvider>
  // </StrictMode>, 
)