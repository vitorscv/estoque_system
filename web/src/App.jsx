import React, { useState } from 'react'
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

  return (
    <div>
      {telaAtual !== 'login' && (
        <>
          <h1>Sistema Pantex</h1>
          <hr />
          <div style={{ marginBottom: 12 }}>
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
        </>
      )}

      {telaAtual === 'vendedor' && <Estoque />}
      {telaAtual === 'fabrica' && <PainelFabrica />}
      {telaAtual === 'login' && <LoginFabrica mudarTela={setTelaAtual} />}
    </div>
  )
}

export default App