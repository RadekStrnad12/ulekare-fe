// Centralized API configuration. Base URL can be overridden via Vite env var VITE_API_BASE_URL.
// Default targets local backend on 127.0.0.1:8000 to avoid hitting the FE dev server origin.
export const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

export const endpoints = {
  notes: `${API_BASE_URL}/api/v1/notes`,
  priorities: `${API_BASE_URL}/api/v1/priorities`,
  colors: `${API_BASE_URL}/api/v1/colors`,
}
