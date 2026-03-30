import React from 'react'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ClerkProvider } from '@clerk/react'
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/role-redirect"
      signUpFallbackRedirectUrl="/role-redirect"
    >
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);

