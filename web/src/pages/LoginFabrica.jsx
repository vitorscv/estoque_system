import React, { useState } from 'react'
import api from '../services/api'

export default function LoginFabrica({ mudarTela }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    try {
      const res = await api.post('login/', { username, password })
      // espera { access: 'token', ... }
      const token = res.data?.access
      if (token) {
        localStorage.setItem('tokenPantex', token)
        // usar prop para mudar a tela para fabrica
        if (mudarTela) mudarTela('fabrica')
      } else {
        setErro('Usuário ou senha incorretos!')
      }
    } catch (err) {
      setErro('Usuário ou senha incorretos!')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a'
    }}>
      <div style={{
        width: 420,
        maxWidth: '95%',
        background: '#2b2b2b',
        borderRadius: 8,
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        padding: 28,
        color: '#fff'
      }}>
        <h2 style={{ textAlign: 'center', margin: 0, marginBottom: 18, fontWeight: 400 }}>Pantex - Acesso à Fábrica</h2>

        <form onSubmit={handleLogin}>
          <label style={{ display: 'block', color: '#e6eef3', marginBottom: 6, fontSize: 13 }}>Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#181818',
              border: '1px solid #333',
              borderRadius: 4,
              color: '#fff',
              marginBottom: 12
            }}
            autoFocus
          />

          <label style={{ display: 'block', color: '#e6eef3', marginBottom: 6, fontSize: 13 }}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#181818',
              border: '1px solid #333',
              borderRadius: 4,
              color: '#fff',
              marginBottom: 16
            }}
          />

          <button type="submit" style={{
            width: '100%',
            padding: '12px 14px',
            background: '#0056b3',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            ENTRAR
          </button>

          {erro && (
            <div style={{ marginTop: 12, color: '#ff6b6b', textAlign: 'center' }}>
              {erro}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

