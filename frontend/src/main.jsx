import React from 'react'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ClerkProvider } from '@clerk/react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider  publishableKey={PUBLISHABLE_KEY}>
      <App />
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);

