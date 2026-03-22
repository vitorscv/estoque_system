import React, { useState } from 'react'
import api from '../services/api'
import '../styles/LoginFabrica.css'

export default function LoginFabrica({ mudarTela }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro]         = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await api.post('login/', { username, password })
      const token = res.data?.access
      if (token) {
        localStorage.setItem('tokenPantex', token)
        if (mudarTela) mudarTela('fabrica')
      } else {
        setErro('Usuário ou senha incorretos!')
      }
    } catch {
      setErro('Usuário ou senha incorretos!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Pantex — Acesso à Fábrica</h2>

        <form onSubmit={handleLogin}>
          <label className="login-label" htmlFor="login-username">Usuário</label>
          <input
            id="login-username"
            type="text"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            required
          />

          <label className="login-label" htmlFor="login-password">Senha</label>
          <input
            id="login-password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>

          {erro && (
            <div className="login-error" role="alert">
              {erro}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
