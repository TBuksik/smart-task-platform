import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [token, setToken] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  function login(email, password) {
    setIsLoading(true)
    setLoginError('')
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          setToken(data.access_token)
          setUserEmail(email)
        } else {
          setLoginError('Nieprawidłowy email lub hasło')
        }
      })
      .catch(() => setLoginError('Błąd połączenia z serwerem'))
      .finally(() => setIsLoading(false))
  }

  function logout() {
    setToken('')
    setUserEmail('')
  }

  return (
    <div className="app">
      {!token ? (
        <Login onLogin={login} isLoading={isLoading} error={loginError} />
      ) : (
        <Dashboard token={token} userEmail={userEmail} onLogout={logout} />
      )}
    </div>
  )
}

export default App
