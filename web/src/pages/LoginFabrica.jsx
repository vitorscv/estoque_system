import React, { useState } from 'react'
import api from '../services/api'
import LogoPantexSophisticated from '../assets/logo-pantex-sophisticated.svg'
import '../styles/LoginFabrica.css'

export default function LoginFabrica({ mudarTela, setFabricaLogada, onLoginComoRepresentante }) {
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
      if (!token) {
        setErro('Usuário ou senha incorretos!')
        return
      }
      localStorage.setItem('tokenPantex', token)
      const me = await api.get('auth/me/')
      const { fabrica, representante } = me.data || {}
      if (fabrica) {
        if (setFabricaLogada) setFabricaLogada(true)
        if (mudarTela) mudarTela('fabrica')
      } else if (representante) {
        localStorage.removeItem('tokenPantex')
        localStorage.setItem('tokenPantexVendedor', token)
        sessionStorage.setItem('pantexContext', 'vendedor')
        if (onLoginComoRepresentante) onLoginComoRepresentante()
        if (mudarTela) mudarTela('vendedor')
      } else {
        localStorage.removeItem('tokenPantex')
        setErro(
          'Esta conta não tem permissão. Peça ao administrador para vincular o grupo Fábrica ou Representantes.'
        )
      }
    } catch {
      localStorage.removeItem('tokenPantex')
      setErro('Usuário ou senha incorretos!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={LogoPantexSophisticated} alt="Pantex Logo" className="logo-login" />
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

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', opacity: 0.7 }}>
          É representante/vendedor?{' '}
          <button
            type="button"
            onClick={() => mudarTela && mudarTela('vendedor')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit', fontSize: 'inherit', padding: 0 }}
          >
            Acesse o portal do vendedor
          </button>
        </p>
      </div>
    </div>
  )
}
