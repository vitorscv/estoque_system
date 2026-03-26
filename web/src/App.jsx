import React, { useState, useEffect } from 'react'
import Estoque from './pages/Estoque'
import PainelFabrica from './pages/PainelFabrica'
import LoginFabrica from './pages/LoginFabrica'
import LoginVendedor from './pages/LoginVendedor'
import LogoPantexSophisticated from './assets/logo-pantex-sophisticated.svg'

function App() {
  // 1. O Estado inicial do Vendedor:
  const [vendedorLogado, setVendedorLogado] = useState(() => {
    return !!localStorage.getItem('tokenPantexVendedor');
  });

  // 2. O Estado inicial da Fábrica:
  const [fabricaLogada, setFabricaLogada] = useState(() => {
    return !!localStorage.getItem('tokenPantex');
  });

  // 3. A lógica inicial de qual tela mostrar (NUNCA mostra o estoque direto se não tiver token)
  const [telaAtual, setTelaAtual] = useState(() => {
    if (localStorage.getItem('tokenPantexVendedor')) return 'vendedor';
    if (localStorage.getItem('tokenPantex')) return 'fabrica';
    return 'vendedor'; 
  });

  // 4. Funções de Navegação e Logout
  const irParaFabrica = () => {

    // Pegamos especificamente o token de administrador/fábrica
    const tokenFabrica = localStorage.getItem('tokenPantex');
    
    if (tokenFabrica) {
      setFabricaLogada(true);
      setTelaAtual('fabrica');
    } else {
      
      setFabricaLogada(false);
      setTelaAtual('login'); 
    }
  };

  const handleSairFabrica = () => {
    localStorage.removeItem('tokenPantex');
    setFabricaLogada(false);
    setTelaAtual('login'); 
  };

  const handleSairVendedor = () => {
    localStorage.removeItem('tokenPantexVendedor');
    setVendedorLogado(false);
    setTelaAtual('vendedor'); // Mantém na aba vendedor, mas vai mostrar o LoginVendedor
  };

  // Dark Mode e Controle de Sessão
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

  useEffect(() => {
    if (telaAtual === 'fabrica') sessionStorage.setItem('pantexContext', 'fabrica')
    else if (telaAtual === 'vendedor') sessionStorage.setItem('pantexContext', 'vendedor')
    else if (telaAtual === 'login') sessionStorage.setItem('pantexContext', 'fabrica')
  }, [telaAtual])

  // Controle de exibição do Header
  const loginFabricaTelaCheia = telaAtual === 'login'
  const loginVendedorTelaCheia = telaAtual === 'vendedor' && !vendedorLogado
  const mostrarHeader = !loginFabricaTelaCheia && !loginVendedorTelaCheia

  const mostrarSair = telaAtual === 'fabrica' || (telaAtual === 'vendedor' && vendedorLogado)

  return (
    <div>
      {mostrarHeader && (
        <header className="app-header">
          <div className="app-header__inner">
            <div className="app-header__title">
              <img src={LogoPantexSophisticated} alt="Pantex Logo" className="logo-header" />
            </div>

            <nav className="app-header__nav">
              <button
                type="button"
                className="dark-toggle"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Alternar modo de exibição"
                title={darkMode ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
              >
                {darkMode ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className={`app-nav-btn${telaAtual === 'vendedor' ? ' active' : ''}`}
                onClick={() => {
                  setTelaAtual('vendedor');
                }}
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

              {mostrarSair && (
                <button
                  type="button"
                  className="app-nav-btn danger"
                  onClick={telaAtual === 'fabrica' ? handleSairFabrica : handleSairVendedor}
                >
                  Sair
                </button>
              )}
            </nav>
          </div>
        </header>
      )}

      {/* RENDERIZAÇÃO CONDICIONAL BLINDADA */}
      
      {/* VENDEDOR */}
      {telaAtual === 'vendedor' && vendedorLogado && <Estoque />}
      {telaAtual === 'vendedor' && !vendedorLogado && (
        <LoginVendedor 
          setVendedorLogado={setVendedorLogado} 
          mudarTela={setTelaAtual} 
        />
      )}
      
      {/* FÁBRICA */}
      {telaAtual === 'fabrica' && fabricaLogada && <PainelFabrica />}
      
      {/* LOGIN GERAL DA FÁBRICA */}
      {telaAtual === 'login' && (
        <LoginFabrica
          mudarTela={setTelaAtual}
          setFabricaLogada={setFabricaLogada}
          onLoginComoRepresentante={() => { 
            setVendedorLogado(true); 
            setTelaAtual('vendedor'); 
          }}
        />
      )}
    </div>
  )
}

export default App