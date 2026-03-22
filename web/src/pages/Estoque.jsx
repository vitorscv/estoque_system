import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/Estoque.css'

function Estoque() {
  const [sacos, setSacos]   = useState([])
  const [busca, setBusca]   = useState('')

  useEffect(() => {
    api.get('estoque/')
      .then(r => setSacos(r.data))
      .catch(err => console.error('Erro ao carregar estoque:', err))
  }, [])

  const sacosFiltrados = sacos.filter(saco =>
    saco.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    (saco.categoria_nome || '').toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="estoque-wrapper">
      <h2 className="estoque-titulo">Estoque Disponível — Pantex</h2>

      <input
        type="text"
        className="estoque-search"
        placeholder="Pesquisar por tamanho (ex: 65x95) ou categoria…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="table-container">
        <table className="data-table estoque-table">
          <thead>
            <tr>
              <th>Descrição do Saco</th>
              <th>Categoria</th>
              <th>Quantidade Atual</th>
            </tr>
          </thead>
          <tbody>
            {sacosFiltrados.length > 0 ? (
              sacosFiltrados.map(saco => (
                <tr key={saco.id}>
                  <td><strong>{saco.descricao}</strong></td>
                  <td>{saco.categoria_nome || '—'}</td>
                  <td>{saco.quantidade_atual} un.</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="estoque-empty">
                  Nenhum saco encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Estoque
