import axios from 'axios'

export const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '')
const api = axios.create({ timeout: 12000 })
api.interceptors.response.use(response => {
  if (response.config.url?.includes('/api/') && !response.headers['content-type']?.includes('application/json')) {
    throw new Error('A API retornou uma resposta inválida. Verifique VITE_API_URL.')
  }
  return response
})
export default api
