import { endpoints } from '@/config/api'
import { http } from '@/services/http'

export async function listNotes() {
  return http.get('/api/v1/notes')
}

export async function getNote(uid) {
  return http.get(`/api/v1/notes/${uid}`)
}

export async function createNote({ title, content, priority = null, color = null }) {
  const body = { title, content }
  if (priority) body.priority = priority
  if (color) body.color = color
  return http.post('/api/v1/notes', body)
}

export async function updateNote(uid, { title, content, priority = null, color = null }) {
  const body = {}
  if (title !== undefined) body.title = title
  if (content !== undefined) body.content = content
  if (priority !== undefined) body.priority = priority
  if (color !== undefined) body.color = color
  return http.patch(`/api/v1/notes/${uid}`, body)
}

export async function deleteNote(uid) {
  return http.delete(`/api/v1/notes/${uid}`)
}
