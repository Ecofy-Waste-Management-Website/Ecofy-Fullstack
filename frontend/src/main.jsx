import React, { StrictMode } from 'react'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // Add this back
import { ClerkProvider } from '@clerk/clerk-react' // Cleaned up unused imports
import { BrowserRouter } from 'react-router-dom'; // Add this back
import { ClerkProvider } from '@clerk/clerk-react' // Cleaned up unused imports
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/redirect"
      signUpFallbackRedirectUrl="/redirect"
    >
      <BrowserRouter> 
        <App/>
      <BrowserRouter> 
        <App/>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
)




















































