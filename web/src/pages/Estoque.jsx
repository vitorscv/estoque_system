import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/Estoque.css'

function Estoque() {
  // 1. Nossas duas caixinhas de memória
  const [sacos, setSacos] = useState([])
  const [busca, setBusca] = useState('') 

  // 2. Busca no Django 
  useEffect(() => {
    api.get('estoque/')
      .then(response => {
        setSacos(response.data)
      })
      .catch(error => {
        console.error("Erro:", error)
      })
  }, [])

  // 3. A INTELIGÊNCIA DO FILTRO: 
  // lista original só aparece com categoria  
  const sacosFiltrados = sacos.filter(saco =>
    saco.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    saco.categoria_nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="container">
      <h2 className="titulo"> Estoque Disponível - Pantex</h2>

      {}
      <input
        type="text"
        className="input-busca"
        placeholder="Pesquisar por tamanho (ex: 65x95) ou categoria..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)} 
      />

      <table className="tabela-estoque">
        <thead>
          <tr>
            <th>Descrição do Saco</th>
            <th>Categoria</th>
            <th>Quantidade Atual</th>
          </tr>
        </thead>
        <tbody>
          {}
          {sacosFiltrados.map(saco => (
            <tr key={saco.id}>
              <td><strong>{saco.descricao}</strong></td>
              <td>{saco.categoria_nome}</td>
              <td>{saco.quantidade_atual} un.</td>
            </tr>
          ))}
          
          {}
          {sacosFiltrados.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Nenhum saco encontrado com esse nome.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Estoque