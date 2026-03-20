import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/Estoque.css' 

function PainelFabrica() {
  const [sacos, setSacos] = useState([])

  const carregarEstoque = () => {
    api.get('estoque/')
      .then(res => setSacos(res.data))
  }

  useEffect(() => {
    carregarEstoque()
  }, [])

  // Função baixa ou entrada
  const movimentarEstoque = (id, tipo) => {
    const qtd = prompt(`Quantas unidades deseja ${tipo === 'entrada' ? 'ADICIONAR' : 'REMOVER'}?`)
    
    if (qtd && !isNaN(qtd)) {
      // React envia o comando para o Django (POST)
      api.post(`estoque/${id}/movimentar/`, {
        quantidade: parseInt(qtd),
        tipo: tipo
      })
      .then(() => {
        alert("Estoque atualizado com sucesso!")
        carregarEstoque() 
      })
      .catch(err => alert("Erro ao movimentar estoque. Verifique o saldo."))
    }
  }

  return (
    <div className="container">
      <h2 className="titulo"> Painel de Controle da Fábrica</h2>
      <table className="tabela-estoque">
        <thead>
          <tr>
            <th>Saco</th>
            <th>Saldo Atual</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sacos.map(saco => (
            <tr key={saco.id}>
              <td>{saco.descricao}</td>
              <td><strong>{saco.quantidade_atual} un.</strong></td>
              <td>
                <button onClick={() => movimentarEstoque(saco.id, 'entrada')} style={{backgroundColor: '#28a745', color: 'white', marginRight: '5px', cursor: 'pointer'}}> + Entrou </button>
                <button onClick={() => movimentarEstoque(saco.id, 'saida')} style={{backgroundColor: '#dc3545', color: 'white', cursor: 'pointer'}}> - Saiu </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PainelFabrica