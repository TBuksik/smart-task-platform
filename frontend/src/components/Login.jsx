import { useState } from 'react'
import './Login.css'

function Login({ onLogin, isLoading, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit() {
    if (email && password) onLogin(email, password)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-grid"></div>
      </div>

      <div className="login-container">
        <div className="login-brand">
          <div className="login-logo">
            <span className="logo-icon">⬡</span>
          </div>
          <h1 className="login-title">Smart Task</h1>
          <p className="login-subtitle">Enterprise Task Automation Platform</p>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <span className="login-card-label">LOGOWANIE</span>
            <div className="login-card-line"></div>
          </div>

          <div className="login-fields">
            <div className="field-group">
              <label className="field-label">EMAIL</label>
              <input
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="twoj@email.com"
                autoComplete="email"
              />
            </div>

            <div className="field-group">
              <label className="field-label">HASŁO</label>
              <input
                className="field-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="login-error">
                <span className="error-icon">!</span>
                {error}
              </div>
            )}

            <button
              className={`login-btn ${isLoading ? 'login-btn-loading' : ''}`}
              onClick={handleSubmit}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <span className="btn-spinner"></span>
              ) : (
                <>
                  <span>ZALOGUJ SIĘ</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="login-footer">
          Smart Task Platform v1.0 · Powered by FastAPI
        </p>
      </div>
    </div>
  )
}

export default Login
