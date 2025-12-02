import { http } from '@/services/http'

export async function listPriorities() {
  return http.get('/api/v1/priorities')
}

export async function listColors() {
  return http.get('/api/v1/colors')
}
