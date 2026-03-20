import React, { useState } from 'react'
import Estoque from './pages/Estoque'
import PainelFabrica from './pages/PainelFabrica'

function App() {
  const [telaAtual, setTelaAtual] = useState('vendedor')

  return (
    <div>
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
          onClick={() => setTelaAtual('fabrica')}
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
      </div>

      {telaAtual === 'vendedor' && <Estoque />}
      {telaAtual === 'fabrica' && <PainelFabrica />}
    </div>
  )
}

export default App