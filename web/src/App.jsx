import React, { useState, useEffect } from 'react'
import Estoque from './pages/Estoque'
import PainelFabrica from './pages/PainelFabrica'
import LoginFabrica from './pages/LoginFabrica'
import LogoPantexSophisticated from './assets/logo-pantex-sophisticated.svg'

function App() {
  const [telaAtual, setTelaAtual] = useState('vendedor')

  const irParaFabrica = () => {
    const token = localStorage.getItem('tokenPantex')
    setTelaAtual(token ? 'fabrica' : 'login')
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
        <header className="app-header">
          <div className="app-header__inner">
            <div className="app-header__title">
              <img src={LogoPantexSophisticated} alt="Pantex Logo" className="logo-header" />
            </div>

            <nav className="app-header__nav">
              {/* Dark mode toggle */}
              <button
                type="button"
                className="dark-toggle"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Alternar modo de exibição"
                title={darkMode ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
              >
                {darkMode ? (
                  /* Ícone sol (claro) */
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  /* Ícone lua (escuro) */
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* Navegação entre painéis */}
              <button
                type="button"
                className={`app-nav-btn${telaAtual === 'vendedor' ? ' active' : ''}`}
                onClick={() => setTelaAtual('vendedor')}
              >
                Vendedor
              </button>

              <button
                type="button"
                className={`app-nav-btn${telaAtual === 'fabrica' ? ' active' : ''}`}
                onClick={irParaFabrica}
              >
                Fábrica
              </button>

              {telaAtual === 'fabrica' && (
                <button
                  type="button"
                  className="app-nav-btn danger"
                  onClick={handleSair}
                >
                  Sair
                </button>
              )}
            </nav>
          </div>
        </header>
      )}

      {telaAtual === 'vendedor' && <Estoque />}
      {telaAtual === 'fabrica' && <PainelFabrica />}
      {telaAtual === 'login'   && <LoginFabrica mudarTela={setTelaAtual} />}
    </div>
  )
}

export default App
