/// <reference types="vite/client" />
import Keycloak from 'keycloak-js'

// Keycloak configuration
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'https://mcp-auth.syneca.io',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'syneca-mcp',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'syneca-mcp-client',
}

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig)

// Expose to window for legacy/global access if needed
if (typeof window !== 'undefined') {
  ;(window as any).keycloak = keycloak
}

let isInitialized = false

/**
 * Initialize Keycloak and handle authentication
 */
export const initKeycloak = async () => {
  if (isInitialized) return keycloak.token

  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required', // Force login if not authenticated
      checkLoginIframe: false,
      redirectUri: window.location.origin, // Explicitly match origin to avoid trailing slash mismatches
    })

    if (authenticated) {
      isInitialized = true
      return keycloak.token
    } else {
      console.warn('Keycloak authentication failed')
      return null
    }
  } catch (error) {
    console.error('Keycloak initialization error:', error)
    return null
  }
}

/**
 * Get the valid access token, refreshing if necessary
 */
export const getAccessToken = async () => {
  if (!isInitialized) {
    await initKeycloak()
  }

  try {
    // Update token if it expires in less than 70 seconds
    await keycloak.updateToken(70)
    return keycloak.token
  } catch (error) {
    console.error('Failed to refresh token:', error)
    // If refresh fails, we might need to re-login
    keycloak.login()
    return null
  }
}

/**
 * Logout
 */
export const logout = () => {
  keycloak.logout()
}

export default keycloak
