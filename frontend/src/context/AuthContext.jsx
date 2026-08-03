import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token'))
  const [email, setEmail] = useState(localStorage.getItem('admin_email'))

  function login(token, email) {
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_email', email)
    setToken(token)
    setEmail(email)
  }

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_email')
    setToken(null)
    setEmail(null)
  }

  return (
    <AuthContext.Provider value={{ token, email, login, logout, autenticado: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}