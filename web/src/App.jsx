import React, { useState, useEffect } from 'react'
import Estoque from './pages/Estoque'
import PainelFabrica from './pages/PainelFabrica'
import LoginFabrica from './pages/LoginFabrica'

function App() {
  const [telaAtual, setTelaAtual] = useState('vendedor')

  const irParaFabrica = () => {
    const token = localStorage.getItem('tokenPantex')
    if (token) {
      setTelaAtual('fabrica')
    } else {
      setTelaAtual('login')
    }
  }

  const handleSair = () => {
    localStorage.removeItem('tokenPantex')
    setTelaAtual('login')
  }
 
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('pantex_dark') === '1'
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('pantex_dark', '1')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.removeItem('pantex_dark')
    }
  }, [darkMode])

  return (
    <div>
      {telaAtual !== 'login' && (
        <div style={{ backgroundColor: 'var(--primary, #0056b3)', color: '#fff', padding: '12px 20px', borderRadius: 6, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <h1 style={{ margin: 0 }}>Sistema Pantex</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Alternar modo de exibição"
                title={darkMode ? 'Alternar para claro' : 'Alternar para escuro'}
                style={{
                  padding: 8,
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8,
                }}
                className="dark-toggle"
              >
                {darkMode ? (
                  // Sun icon (light mode)
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="M4.93 4.93l1.41 1.41"></path>
                    <path d="M17.66 17.66l1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="M4.93 19.07l1.41-1.41"></path>
                    <path d="M17.66 6.34l1.41-1.41"></path>
                  </svg>
                ) : (
                  // Moon icon (dark mode)
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => setTelaAtual('vendedor')}
                style={{
                  marginRight: 8,
                  padding: '6px 12px',
                  backgroundColor: telaAtual === 'vendedor' ? '#0d6efd' : '#e9ecef',
                  color: telaAtual === 'vendedor' ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Vendedor
              </button>

              <button
                type="button"
                onClick={irParaFabrica}
                style={{
                  padding: '6px 12px',
                  backgroundColor: telaAtual === 'fabrica' ? '#0d6efd' : '#e9ecef',
                  color: telaAtual === 'fabrica' ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Fábrica
              </button>

              {telaAtual === 'fabrica' && (
                <button
                  type="button"
                  onClick={handleSair}
                  style={{
                    marginLeft: 12,
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Sair
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {telaAtual === 'vendedor' && <Estoque />}
      {telaAtual === 'fabrica' && <PainelFabrica />}
      {telaAtual === 'login' && <LoginFabrica mudarTela={setTelaAtual} />}
    </div>
  )
}

export default App