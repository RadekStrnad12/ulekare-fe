import { API_BASE_URL } from '@/config/api'

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`

  const opts = {
    method,
    headers: {
      'Accept': 'application/json',
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  }

  const res = await fetch(url, opts)
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch (e) {
    data = text
  }

  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}`)
    error.status = res.status
    error.data = data
    throw error
  }

  return data
}

export const http = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
