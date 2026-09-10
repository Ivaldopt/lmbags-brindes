import { useCallback, useState } from 'react'
import { AuthContext } from './auth'



export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem('admin_token'))
  const [email, setEmail] = useState(sessionStorage.getItem('admin_email'))

  function login(token, email) {
    sessionStorage.setItem('admin_token', token)
    sessionStorage.setItem('admin_email', email)
    setToken(token)
    setEmail(email)
  }

  const logout = useCallback(() => {
    sessionStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_email')
    setToken(null)
    setEmail(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, email, login, logout, autenticado: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}
