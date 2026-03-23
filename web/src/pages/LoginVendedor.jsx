import React, { useState } from 'react'
import api from '../services/api'
import LogoPantexSophisticated from '../assets/logo-pantex-sophisticated.svg'
import '../styles/LoginFabrica.css'
import '../styles/LoginVendedor.css'

export default function LoginVendedor({ setVendedorLogado }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

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
      localStorage.setItem('tokenPantexVendedor', token)
      const me = await api.get('auth/me/')
      const { fabrica, representante } = me.data || {}
      if (fabrica || representante) {
        setVendedorLogado(true)
      } else {
        localStorage.removeItem('tokenPantexVendedor')
        setErro(
          'Esta conta não tem permissão para consultar o estoque. Peça ao administrador para vincular o grupo Representantes ou Fábrica.'
        )
      }
    } catch {
      localStorage.removeItem('tokenPantexVendedor')
      setErro('Usuário ou senha incorretos!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card login-card--vendedor">
        <img src={LogoPantexSophisticated} alt="Pantex Logo" className="logo-login" />
        <h2 className="login-title">Pantex — Portal do Vendedor</h2>
        <p className="login-vendedor-hint">Acesso exclusivo à área de consulta do estoque de reserva.</p>

        <form onSubmit={handleLogin}>
          <label className="login-label" htmlFor="login-vendedor-username">Usuário</label>
          <input
            id="login-vendedor-username"
            type="text"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            required
          />

          <label className="login-label" htmlFor="login-vendedor-password">Senha</label>
          <input
            id="login-vendedor-password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="login-btn login-btn-vendedor"
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar no portal de vendas'}
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
