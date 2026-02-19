import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { initKeycloak } from 'use-mcp/auth/keycloak'

const ENABLE_STRICT_MODE = true

// Initialize Keycloak before rendering the app
initKeycloak()
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      ENABLE_STRICT_MODE ? (
        <StrictMode>
          <App />
        </StrictMode>
      ) : (
        <App />
      )
    )
  })
  .catch((err) => {
    console.error('Failed to initialize Keycloak', err)
    // Optionally render an error state or a specific login button here
    createRoot(document.getElementById('root')!).render(
      <div className="p-4 text-red-600">
        Error initializing authentication. Please check console for details.
        <br />
        Ensure VITE_KEYCLOAK_URL, VITE_KEYCLOAK_REALM, and VITE_KEYCLOAK_CLIENT_ID are set in .env
      </div>
    )
  })
