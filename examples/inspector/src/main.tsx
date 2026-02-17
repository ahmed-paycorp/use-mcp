import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { initKeycloak } from 'use-mcp/auth/keycloak'

// Initialize Keycloak before rendering the app
initKeycloak().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}).catch((err) => {
  console.error('Failed to initialize Keycloak', err)
  createRoot(document.getElementById('root')!).render(
    <div className="p-4 text-red-600">
      Error initializing authentication. Make sure environment variables are set.
    </div>
  )
})
