import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/PainelFabrica.css'

function PainelFabrica() {
  const [sacos, setSacos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [sacoSelecionado, setSacoSelecionado] = useState('')
  const [tipoMovimentacao, setTipoMovimentacao] = useState('entrada')
  const [quantidade, setQuantidade] = useState('')

  const carregarEstoque = () => {
    api.get('estoque/')
      .then(res => setSacos(res.data))
      .catch(err => console.error("Erro ao carregar:", err))
  }

  useEffect(() => {
    carregarEstoque()
  }, [])

  const abrirModal = () => {
    setModalAberto(true)
    setSacoSelecionado('')
    setTipoMovimentacao('entrada')
    setQuantidade('')
  }

  const fecharModal = () => {
    setModalAberto(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!sacoSelecionado || !quantidade || parseInt(quantidade) <= 0) {
      alert('Por favor, preencha todos os campos corretamente.')
      return
    }

    // Fazendo o POST para a rota que você criou no urls.py
    api.post(`estoque/${sacoSelecionado}/movimentar/`, {
      quantidade: parseInt(quantidade),
      tipo: tipoMovimentacao
    })
    .then(response => {
      alert(response.data.status)
      carregarEstoque()
      fecharModal()
    })
    .catch(error => {
      alert(error.response?.data?.erro || "Erro ao movimentar o estoque.")
    })
  }

  return (
    <div className="painel-fabrica">
      {/* Header Superior - Dark Mode */}
      <header className="painel-fabrica__header">
        <h1 className="painel-fabrica__header-title">Administração do Django</h1>
        <div className="painel-fabrica__header-user">
          BEM-VINDO(A), VITOR.
          <a href="#" className="painel-fabrica__header-link">VER O SITE</a>
          <span> / </span>
          <a href="#" className="painel-fabrica__header-link">ALTERAR SENHA</a>
          <span> / </span>
          <a href="#" className="painel-fabrica__header-link">ENCERRAR SESSÃO</a>
          <span className="painel-fabrica__dark-mode-icon">🌙</span>
        </div>
      </header>

      {/* Layout com Sidebar */}
      <div className="painel-fabrica__layout">
        {/* Sidebar Esquerda */}
        <aside className="painel-fabrica__sidebar">
          <div className="painel-fabrica__sidebar-section">
            <h3 className="painel-fabrica__sidebar-title">Authentication and Authorization</h3>
            <a href="#" className="painel-fabrica__sidebar-link">Grupos</a>
            <a href="#" className="painel-fabrica__sidebar-link">Usuários</a>
          </div>
          <div className="painel-fabrica__sidebar-section">
            <h3 className="painel-fabrica__sidebar-title">Products</h3>
            <a href="#" className="painel-fabrica__sidebar-link">Categoria sacarias</a>
            <a href="#" className="painel-fabrica__sidebar-link">Movimentacao estoques</a>
            <a href="#" className="painel-fabrica__sidebar-link painel-fabrica__sidebar-link--active">Saco reservas</a>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="painel-fabrica__content">
          {/* Breadcrumb */}
          <div className="painel-fabrica__breadcrumb">
            <a href="#">Início</a>
            <span className="painel-fabrica__breadcrumb-separator">›</span>
            <a href="#">Products</a>
            <span className="painel-fabrica__breadcrumb-separator">›</span>
            <span>Saco reservas</span>
          </div>

          {/* Área Principal */}
          <div className="painel-fabrica__main">
            {/* Header com Título e Botão Adicionar */}
            <div className="painel-fabrica__header-section">
              <h2 className="painel-fabrica__title">Selecione saco reserva para modificar</h2>
              <button 
                className="painel-fabrica__add-button"
                onClick={abrirModal}
              >
                <span>+</span>
                Adicionar Movimentação Estoque
              </button>
            </div>

            {/* Barra de Busca */}
            <div className="painel-fabrica__toolbar">
              <input 
                type="text" 
                placeholder="Pesquisar" 
                className="painel-fabrica__search-input"
              />
              <button className="painel-fabrica__search-button">Executar</button>
            </div>

            {/* Tabela Administrativa Dark Mode */}
            <div className="painel-fabrica__table-container">
              <table className="painel-fabrica__table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" className="painel-fabrica__table-checkbox" />
                    </th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Quantidade Atual</th>
                    <th>Ativo</th>
                  </tr>
                </thead>
                <tbody>
                  {sacos.map(saco => (
                    <tr key={saco.id}>
                      <td>
                        <input type="checkbox" className="painel-fabrica__table-checkbox" />
                      </td>
                      <td>
                        <a href="#" className="painel-fabrica__table-link">{saco.descricao}</a>
                      </td>
                      <td>{saco.categoria_nome}</td>
                      <td className="painel-fabrica__table-quantidade">{saco.quantidade_atual} un.</td>
                      <td className="painel-fabrica__table-status">{saco.ativo ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rodapé */}
            <div className="painel-fabrica__footer">
              {sacos.length} saco{sacos.length !== 1 ? 's' : ''} reserva{sacos.length !== 1 ? 's' : ''}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Formulário (Clone Django Add) */}
      {modalAberto && (
        <div className="painel-fabrica__modal-overlay" onClick={fecharModal}>
          <div className="painel-fabrica__modal" onClick={(e) => e.stopPropagation()}>
            <div className="painel-fabrica__modal-header">
              <h3 className="painel-fabrica__modal-title">Adicionar movimentação estoque</h3>
              <button 
                className="painel-fabrica__modal-close"
                onClick={fecharModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="painel-fabrica__modal-body">
                {/* Campo Saco */}
                <div className="painel-fabrica__form-group">
                  <label className="painel-fabrica__form-label">Saco:</label>
                  <select 
                    className="painel-fabrica__form-select"
                    value={sacoSelecionado}
                    onChange={(e) => setSacoSelecionado(e.target.value)}
                    required
                  >
                    <option value="">---------</option>
                    {sacos.map(saco => (
                      <option key={saco.id} value={saco.id}>
                        {saco.descricao} (Estoque: {saco.quantidade_atual})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo Tipo */}
                <div className="painel-fabrica__form-group">
                  <label className="painel-fabrica__form-label">Tipo:</label>
                  <select 
                    className="painel-fabrica__form-select"
                    value={tipoMovimentacao}
                    onChange={(e) => setTipoMovimentacao(e.target.value)}
                    required
                  >
                    <option value="entrada">Entrada (+)</option>
                    <option value="saida">Saída (-)</option>
                  </select>
                </div>

                {/* Campo Quantidade */}
                <div className="painel-fabrica__form-group">
                  <label className="painel-fabrica__form-label">Quantidade:</label>
                  <input 
                    type="number"
                    className="painel-fabrica__form-input"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    min="1"
                    required
                  />
                  <p className="painel-fabrica__form-help">
                    Quem da produção/estoque registrou?
                  </p>
                </div>
              </div>

              <div className="painel-fabrica__modal-footer">
                <button 
                  type="button"
                  className="painel-fabrica__btn painel-fabrica__btn--secondary"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="painel-fabrica__btn painel-fabrica__btn--primary"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PainelFabrica