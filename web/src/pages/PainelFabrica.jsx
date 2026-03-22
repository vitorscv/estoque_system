import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/PainelFabrica.css'
import '../styles/LayoutFabrica.css'

/* ─── SVGs de status reutilizáveis ─────────────────────────────── */
const IconSim = () => (
  <img
    src="data:image/svg+xml,%3Csvg width='13' height='13' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%2370bf2b' d='M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z'/%3E%3C/svg%3E"
    alt="Sim"
  />
)
const IconNao = () => (
  <img
    src="data:image/svg+xml,%3Csvg width='13' height='13' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23dd4646' d='M1277 1122q0-26-19-45l-181-181 181-181q19-19 19-45 0-27-19-46l-90-90q-19-19-46-19-26 0-45 19l-181 181-181-181q-19-19-45-19-27 0-46 19l-90 90q-19 19-19 46 0 26 19 45l181 181-181 181q-19 19-19 45 0 27 19 46l90 90q19 19 46 19 26 0 45-19l181-181 181 181q19 19 45 19 27 0 46-19l90-90q19-19 19-46zm387-226q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/%3E%3C/svg%3E"
    alt="Não"
  />
)

const SearchIcon = () => (
  <svg className="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
    <path d="M10.5 0C13.5 0 16 2.5 16 5.5S13.5 11 10.5 11c-1.3 0-2.5-.5-3.5-1.3l-5.5 5.5c-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1.1l5.5-5.5C5.5 8 5 6.8 5 5.5 5 2.5 7.5 0 10.5 0zm0 2C8.6 2 7 3.6 7 5.5S8.6 9 10.5 9 14 7.4 14 5.5 12.4 2 10.5 2z" />
  </svg>
)

/* ─── Componente de Tabela Reutilizável (Change List) ───────────── */
function ChangeList({ searchPlaceholder, busca, setBusca, acaoLabel, colunas, linhas, paginator }) {
  return (
    <div className="module" id="changelist">
      <form id="changelist-search" method="get" onSubmit={(e) => e.preventDefault()}>
        <div className="changelist-toolbar">
          <label htmlFor="searchbar"><SearchIcon /></label>
          <input
            className="search-input"
            type="text"
            size="40"
            name="q"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            id="searchbar"
            placeholder={searchPlaceholder}
          />
          <input type="submit" value="Pesquisar" />
        </div>
      </form>

      <form id="changelist-form" method="post" onSubmit={(e) => e.preventDefault()}>
        <div className="actions">
          <label>
            Ação:
            <select name="action">
              <option value="">---------</option>
              <option value="delete_selected">Excluir {acaoLabel} selecionados</option>
            </select>
          </label>
          <button type="submit" className="button" name="index" value="0">Ir</button>
        </div>

        <div className="results">
          <div className="table-responsive">
            <table id="result_list">
            <thead>
              <tr>
                <th scope="col" className="action-checkbox-column">
                  <div className="text"><span><input type="checkbox" /></span></div>
                </th>
                {colunas.map((col) => (
                  <th key={col.key} scope="col" className={`sortable column-${col.key}`}>
                    <div className="text">
                      <a href="#" onClick={(e) => e.preventDefault()}>{col.label}</a>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.length > 0 ? linhas.map((linha, idx) => (
                <tr key={linha.id} className={idx % 2 === 0 ? 'row1' : 'row2'}>
                  <td className="action-checkbox">
                    <input type="checkbox" name="_selected_action" value={linha.id} />
                  </td>
                  {colunas.map((col) => (
                    col.primeiro
                      ? <th key={col.key} className={`field-${col.key}`}>
                          <a href="#" onClick={(e) => e.preventDefault()}>{linha[col.key]}</a>
                        </th>
                      : <td key={col.key} className={`field-${col.key}`}>{linha[col.key]}</td>
                  ))}
                </tr>
              )) : (
                <tr>
                  <td colSpan={colunas.length + 1} className="no-results">
                    Nenhum resultado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>

        <p className="paginator">{paginator}</p>
      </form>
    </div>
  )
}

/* ─── Componente de Modal Reutilizável ──────────────────────────── */
function Modal({ titulo, onFechar, onSubmit, children }) {
  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button className="modal-close" onClick={onFechar} aria-label="Fechar">×</button>
        </div>
        <form onSubmit={onSubmit}>
          <fieldset className="module aligned">
            {children}
          </fieldset>
          <div className="submit-row">
            <button type="button" className="button cancel-link" onClick={onFechar}>Cancelar</button>
            <input type="submit" value="Salvar" className="default" name="_save" />
          </div>
        </form>
      </div>
    </div>
  )
}

function FormRow({ id, label, children, help }) {
  return (
    <div className={`form-row field-${id}`}>
      <div>
        <label htmlFor={`id_${id}`} className="required">{label}:</label>
        {children}
        {help && <div className="help">{help}</div>}
      </div>
    </div>
  )
}

/* ─── Componente Principal ──────────────────────────────────────── */
function PainelFabrica() {

  /* ── Navegação ──────────────────────────────────────────────── */
  const [abaAtiva, setAbaAtiva] = useState('saco_reservas')
  const [sidebarAberta, setSidebarAberta] = useState(true)

  /* ── Dados de cada aba ──────────────────────────────────────── */
  const [sacos, setSacos]               = useState([])
  const [categorias, setCategorias]     = useState([])
  const [movimentacoes, setMovimentacoes] = useState([])
  const [grupos, setGrupos]             = useState([])
  const [usuarios, setUsuarios]         = useState([])

  /* ── Buscas locais ──────────────────────────────────────────── */
  const [buscaSacos, setBuscaSacos]               = useState('')
  const [buscaCategorias, setBuscaCategorias]     = useState('')
  const [buscaMovimentacoes, setBuscaMovimentacoes] = useState('')
  const [buscaGrupos, setBuscaGrupos]             = useState('')
  const [buscaUsuarios, setBuscaUsuarios]         = useState('')

  /* ── Modal: Movimentação (aba Sacos) ────────────────────────── */
  const [modalMovAberto, setModalMovAberto]   = useState(false)
  const [sacoSelecionado, setSacoSelecionado] = useState('')
  const [tipoMovimentacao, setTipoMovimentacao] = useState('entrada')
  const [quantidade, setQuantidade]           = useState('')
  const [responsavel, setResponsavel]         = useState('')
  const [observacao, setObservacao]           = useState('')

  /* ── Modal: Categoria ───────────────────────────────────────── */
  const [modalCatAberto, setModalCatAberto] = useState(false)
  const [nomeCategoria, setNomeCategoria]   = useState('')
  /* ── Modal: Saco Reserva (Add Form) ─────────────────────────── */
  const [modalSacoAberto, setModalSacoAberto] = useState(false)
  const [codigoReferencia, setCodigoReferencia] = useState('')
  const [descricaoSaco, setDescricaoSaco] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [estoqueMinimo, setEstoqueMinimo] = useState(100)
  const [ativoSaco, setAtivoSaco] = useState(true)
  const [confirmarExclusao, setConfirmarExclusao] = useState({ aberto: false, tipo: null, id: null })

  /* ── Carregamento de dados ──────────────────────────────────── */
  const carregarSacos = () =>
    api.get('estoque/').then(r => setSacos(r.data)).catch(console.error)

  const carregarCategorias = () =>
    api.get('categorias/').then(r => setCategorias(r.data)).catch(console.error)

  const carregarMovimentacoes = () =>
    api.get('movimentacoes/').then(r => setMovimentacoes(r.data)).catch(console.error)

  const carregarGrupos = () =>
    api.get('grupos/').then(r => setGrupos(r.data)).catch(console.error)

  const carregarUsuarios = () =>
    api.get('usuarios/').then(r => setUsuarios(r.data)).catch(console.error)

  /* Carrega sacos ao montar (aba padrão) */
  useEffect(() => { carregarSacos() }, [])

  /* Carrega os dados de uma aba quando ela é selecionada pela 1ª vez */
  useEffect(() => {
    if (abaAtiva === 'categorias'   && categorias.length === 0)   carregarCategorias()
    if (abaAtiva === 'movimentacoes' && movimentacoes.length === 0) carregarMovimentacoes()
    if (abaAtiva === 'grupos'       && grupos.length === 0)        carregarGrupos()
    if (abaAtiva === 'usuarios'     && usuarios.length === 0)      carregarUsuarios()
  }, [abaAtiva])

  /* ── Filtros derivados ──────────────────────────────────────── */
  const sacosFiltrados = sacos.filter(s =>
    s.descricao.toLowerCase().includes(buscaSacos.toLowerCase()) ||
    (s.categoria_nome || '').toLowerCase().includes(buscaSacos.toLowerCase())
  )

  const categoriasFiltradas = categorias.filter(c =>
    c.nome.toLowerCase().includes(buscaCategorias.toLowerCase())
  )

  const movimentacoesFiltradas = movimentacoes.filter(m =>
    (m.saco_descricao || '').toLowerCase().includes(buscaMovimentacoes.toLowerCase()) ||
    (m.responsavel || '').toLowerCase().includes(buscaMovimentacoes.toLowerCase())
  )

  const gruposFiltrados = grupos.filter(g =>
    g.name.toLowerCase().includes(buscaGrupos.toLowerCase())
  )

  const usuariosFiltrados = usuarios.filter(u =>
    u.username.toLowerCase().includes(buscaUsuarios.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(buscaUsuarios.toLowerCase())
  )

  /* ── Helpers de data ─────────────────────────────────────────── */
  const formatarData = (iso) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  }

  /* ── Submit: Movimentação ────────────────────────────────────── */
  const handleSubmitMov = (e) => {
    e.preventDefault()
    if (!sacoSelecionado || !quantidade || parseInt(quantidade) <= 0) {
      alert('Por favor, preencha todos os campos corretamente.')
      return
    }
    api.post(`estoque/${sacoSelecionado}/movimentar/`, {
      quantidade: parseInt(quantidade),
      tipo: tipoMovimentacao,
      responsavel: responsavel || 'Fábrica',
      observacao,
    })
    .then(res => {
      alert(res.data.status)
      carregarSacos()
      /* Recarrega movimentações se a aba estiver visível */
      if (abaAtiva === 'movimentacoes') carregarMovimentacoes()
      setModalMovAberto(false)
    })
    .catch(err => alert(err.response?.data?.erro || 'Erro ao movimentar o estoque.'))
  }

  /* ── Submit: Categoria ───────────────────────────────────────── */
  const handleSubmitCat = (e) => {
    e.preventDefault()
    if (!nomeCategoria.trim()) {
      alert('Informe o nome da categoria.')
      return
    }
    api.post('categorias/', { nome: nomeCategoria.trim() })
    .then(() => {
      alert('Categoria criada com sucesso!')
      setNomeCategoria('')
      setModalCatAberto(false)
      carregarCategorias()
    })
    .catch(err => {
      const msg = err.response?.data?.nome?.[0] || 'Erro ao criar categoria.'
      alert(msg)
    })
  }

  /* ── Submit: Saco Reserva (Create) ───────────────────────────── */ 
  const handleSubmitSaco = (e) => {
    e.preventDefault()
    if (!descricaoSaco.trim()) {
      alert('Descrição é obrigatória.')
      return
    }
    const payload = {
      codigo_referencia: codigoReferencia || null,
      descricao: descricaoSaco,
      categoria: categoriaId || null,
      quantidade_atual: 0,
      estoque_minimo: estoqueMinimo || 0,
      ativo: ativoSaco,
    }
    // TODO: backend deve expor POST /api/estoque/ para criação; se não existir, retorna 405.
    api.post('estoque/', payload)
      .then(() => {
        alert('Saco reserva criado com sucesso!')
        setModalSacoAberto(false)
        carregarSacos()
      })
      .catch(err => {
        alert(err.response?.data || 'Erro ao criar saco reserva.')
      })
  }

  /* ── Deleção: Saco / Categoria / Movimentacao ────────────────── */ 
  const handleDeleteSaco = (id) => {
    setConfirmarExclusao({ aberto: true, tipo: 'saco', id })
  }

  const handleDeleteCategoria = (id) => {
    setConfirmarExclusao({ aberto: true, tipo: 'categoria', id })
  }

  const handleDeleteMovimentacao = (id) => {
    setConfirmarExclusao({ aberto: true, tipo: 'movimentacao', id })
  }

  const executarExclusao = () => {
    const { tipo, id } = confirmarExclusao
    if (!tipo || !id) {
      setConfirmarExclusao({ aberto: false, tipo: null, id: null })
      return
    }

    let endpoint = ''
    if (tipo === 'saco') endpoint = `estoque/${id}/`
    if (tipo === 'categoria') endpoint = `categorias/${id}/`
    if (tipo === 'movimentacao') endpoint = `movimentacoes/${id}/`

    api.delete(endpoint)
      .then(res => {
        // remove from UI regardless of exact status code
        if (tipo === 'saco') setSacos(prev => prev.filter(s => s.id !== id))
        if (tipo === 'categoria') setCategorias(prev => prev.filter(c => c.id !== id))
        if (tipo === 'movimentacao') setMovimentacoes(prev => prev.filter(m => m.id !== id))
        setConfirmarExclusao({ aberto: false, tipo: null, id: null })
      })
      .catch(err => {
        alert(err.response?.data || 'Erro ao excluir item.')
        setConfirmarExclusao({ aberto: false, tipo: null, id: null })
      })
  }

  /* ── Modal: Novo Usuário (aba Usuários) ─────────────────────── */ 
  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false)
  const [novoUsuario, setNovoUsuario] = useState({ username: '', password: '' })
  const [confirmSenha, setConfirmSenha] = useState('')

  const handleSalvarUsuario = (e) => {
    e.preventDefault()
    if (!novoUsuario.username.trim() || !novoUsuario.password) {
      alert('Preencha usuário e senha.')
      return
    }
    if (novoUsuario.password !== confirmSenha) {
      alert('As senhas não conferem.')
      return
    }
    api.post('usuarios/', novoUsuario)
      .then(res => {
        // espera 201 com objeto do usuário
        setUsuarios(prev => [res.data, ...prev])
        setModalUsuarioAberto(false)
        setNovoUsuario({ username: '', password: '' })
        setConfirmSenha('')
      })
      .catch(err => {
        alert(err.response?.data || 'Erro ao criar usuário.')
      })
  }

  /* ── Helpers de navegação ────────────────────────────────────── */
  const irPara = (aba) => setAbaAtiva(aba)

  const titulos = {
    saco_reservas: 'Selecione saco reserva para alterar',
    movimentacoes: 'Selecione movimentação de estoque para alterar',
    categorias:    'Selecione categoria sacaria para alterar',
    grupos:        'Selecione grupo para alterar',
    usuarios:      'Selecione usuário para alterar',
  }

  const breadcrumbs = {
    saco_reservas: { secao: 'Products',                       item: 'Saco reservas' },
    movimentacoes: { secao: 'Products',                       item: 'Movimentacao estoques' },
    categorias:    { secao: 'Products',                       item: 'Categoria sacarias' },
    grupos:        { secao: 'Authentication and Authorization', item: 'Grupos' },
    usuarios:      { secao: 'Authentication and Authorization', item: 'Usuários' },
  }

  const bc = breadcrumbs[abaAtiva]

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div className="django-admin">
      <a href="#content-start" className="skip-to-content">Pular para o conteúdo principal</a>

      <div id="container">

        {/* cabeçalho removido (adaptado para Pantex) */}

        {/* breadcrumbs removido conforme solicitado */}

        <div className="main" id="main">

          {/* ── Toggle Sidebar ───────────────────────────────────── */}
          <button
            className="toggle-nav-sidebar"
            onClick={() => setSidebarAberta(!sidebarAberta)}
            aria-label="Alternar navegação"
          >
            ☰
          </button>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <nav
            id="nav-sidebar"
            className={sidebarAberta ? 'sidebar-open' : 'sidebar-closed'}
            aria-label="Sidebar"
          >
            <input
              type="search"
              id="nav-filter"
              placeholder="Comece a digitar para filtrar…"
              aria-label="Filtrar itens de navegação"
            />

            <div className="app-products module">
              <a href="#" className="section" onClick={(e) => e.preventDefault()}>
                <span>Products</span>
              </a>
              <ul>
                {[
                  { key: 'categorias',    label: 'Categoria sacarias' },
                  { key: 'movimentacoes', label: 'Movimentacao estoques' },
                  { key: 'saco_reservas', label: 'Saco reservas' },
                ].map(({ key, label }) => (
                  <li key={key} className={abaAtiva === key ? 'current' : ''}>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); irPara(key) }}
                      aria-current={abaAtiva === key ? 'page' : undefined}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="app-auth module">
              <a href="#" className="section" onClick={(e) => e.preventDefault()}>
                <span>Authentication and Authorization</span>
              </a>
              <ul>
                {[
                  { key: 'grupos',   label: 'Grupos' },
                  { key: 'usuarios', label: 'Usuários' },
                ].map(({ key, label }) => (
                  <li key={key} className={abaAtiva === key ? 'current' : ''}>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); irPara(key) }}
                      aria-current={abaAtiva === key ? 'page' : undefined}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* ── Conteúdo Principal ───────────────────────────────── */}
          <main id="content-start" className="content" tabIndex="-1">
            <div id="content" className="colM">
              <h1>{titulos[abaAtiva]}</h1>

              <div id="content-main">

                {/* ════════════════════════════════════════════════
                    ABA: SACO RESERVAS
                ════════════════════════════════════════════════ */}
                {abaAtiva === 'saco_reservas' && (
                  <div>
                    <div className="toolbar-header">
                      <ul className="object-tools" style={{ marginTop: 8 }}>
                        <li>
                          <a
                            href="#"
                            className="addlink"
                            onClick={(e) => {
                              e.preventDefault()
                              // open Saco add modal
                              setCodigoReferencia('')
                              setDescricaoSaco('')
                              setCategoriaId('')
                              setEstoqueMinimo(100)
                              setAtivoSaco(true)
                              carregarCategorias()
                              setModalSacoAberto(true)
                            }}
                          >
                            ADICIONAR SACO RESERVA
                          </a>
                        </li>
                      </ul>

                      <ChangeList
                      searchPlaceholder="Pesquisar saco reserva"
                      busca={buscaSacos}
                      setBusca={setBuscaSacos}
                      acaoLabel="sacos reservas"
                      colunas={[
                        { key: 'descricao',       label: 'Descrição',       primeiro: true },
                        { key: 'categoria_nome',  label: 'Categoria' },
                        { key: 'quantidade_atual',label: 'Quantidade atual' },
                        { key: 'ativo_icone',     label: 'Ativo' },
                        { key: 'acoes',           label: 'Ações' },
                      ]}
                      linhas={sacosFiltrados.map(s => ({
                        id:              s.id,
                        descricao:       s.descricao,
                        categoria_nome:  s.categoria_nome || '-',
                        quantidade_atual: s.quantidade_atual,
                        ativo_icone:     s.ativo ? <IconSim /> : <IconNao />,
                        acoes: (
                          <button
                            className="action-icon"
                            onClick={() => setConfirmarExclusao({ aberto: true, tipo: 'saco', id: s.id })}
                            title="Excluir saco reserva"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        ),
                      }))}
                      paginator={`${sacosFiltrados.length} saco${sacosFiltrados.length !== 1 ? 's' : ''} reserva${sacosFiltrados.length !== 1 ? 's' : ''}`}
                      />
                    </div>
                  </div>
                )}

                {/* ════════════════════════════════════════════════
                    ABA: MOVIMENTAÇÕES
                ════════════════════════════════════════════════ */}
                {abaAtiva === 'movimentacoes' && (
                  <div>
                    <div className="toolbar-header">
                      <ul className="object-tools">
                        <li>
                          <a
                            href="#"
                            className="addlink"
                            onClick={(e) => {
                              e.preventDefault()
                              setSacoSelecionado('')
                              setTipoMovimentacao('entrada')
                              setQuantidade('')
                              setResponsavel('')
                              setObservacao('')
                              setModalMovAberto(true)
                            }}
                          >
                            Adicionar movimentação estoque
                          </a>
                        </li>
                      </ul>

                      <ChangeList
                      searchPlaceholder="Pesquisar por saco ou responsável"
                      busca={buscaMovimentacoes}
                      setBusca={setBuscaMovimentacoes}
                      acaoLabel="movimentações"
                      colunas={[
                        { key: 'saco_descricao',    label: 'Saco',        primeiro: true },
                        { key: 'tipo_display',       label: 'Tipo' },
                        { key: 'quantidade',         label: 'Quantidade' },
                        { key: 'responsavel',        label: 'Responsável' },
                        { key: 'data_fmt',           label: 'Data' },
                      { key: 'acoes',             label: 'Ações' },
                      ]}
                      linhas={movimentacoesFiltradas.map(m => ({
                        id:             m.id,
                        saco_descricao: m.saco_descricao || '-',
                        tipo_display:   m.tipo_display,
                        quantidade:     m.quantidade,
                        responsavel:    m.responsavel || '-',
                        data_fmt:       formatarData(m.data_movimentacao),
                      acoes: (
                        <button
                          className="action-icon"
                          onClick={() => setConfirmarExclusao({ aberto: true, tipo: 'movimentacao', id: m.id })}
                          title="Excluir movimentação"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      ),
                      }))}
                      paginator={`${movimentacoesFiltradas.length} movimentação${movimentacoesFiltradas.length !== 1 ? 'ões' : ''}`}
                      />
                    </div>
                  </div>
                )}

                {/* ════════════════════════════════════════════════
                    ABA: CATEGORIAS
                ════════════════════════════════════════════════ */}
                {abaAtiva === 'categorias' && (
                  <div>
                    <div className="toolbar-header">
                      <ul className="object-tools">
                        <li>
                          <a
                            href="#"
                            className="addlink"
                            onClick={(e) => {
                              e.preventDefault()
                              setNomeCategoria('')
                              setModalCatAberto(true)
                            }}
                          >
                            Adicionar categoria sacaria
                          </a>
                        </li>
                      </ul>

                      <ChangeList
                      searchPlaceholder="Pesquisar categoria"
                      busca={buscaCategorias}
                      setBusca={setBuscaCategorias}
                      acaoLabel="categorias"
                      colunas={[
                        { key: 'nome',        label: 'Nome',          primeiro: true },
                        { key: 'total_sacos', label: 'Total de sacos' },
                        { key: 'acoes',       label: 'Ações' },
                      ]}
                      linhas={categoriasFiltradas.map(c => ({
                        id:          c.id,
                        nome:        c.nome,
                        total_sacos: c.total_sacos ?? '-',
                        acoes: (
                          <button
                            className="action-icon"
                            onClick={() => setConfirmarExclusao({ aberto: true, tipo: 'categoria', id: c.id })}
                            title="Excluir categoria"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        ),
                      }))}
                      paginator={`${categoriasFiltradas.length} categoria${categoriasFiltradas.length !== 1 ? 's' : ''}`}
                      />
                    </div>
                  </div>
                )}

                {/* ════════════════════════════════════════════════
                    ABA: GRUPOS
                ════════════════════════════════════════════════ */}
                {abaAtiva === 'grupos' && (
                  <ChangeList
                    searchPlaceholder="Pesquisar grupo"
                    busca={buscaGrupos}
                    setBusca={setBuscaGrupos}
                    acaoLabel="grupos"
                    colunas={[
                      { key: 'name', label: 'Nome', primeiro: true },
                    ]}
                    linhas={gruposFiltrados.map(g => ({
                      id:   g.id,
                      name: g.name,
                    }))}
                    paginator={`${gruposFiltrados.length} grupo${gruposFiltrados.length !== 1 ? 's' : ''}`}
                  />
                )}

                {/* ════════════════════════════════════════════════
                    ABA: USUÁRIOS
                ════════════════════════════════════════════════ */}
                {abaAtiva === 'usuarios' && (
                  <>
                    <ul className="object-tools">
                      <li>
                        <a
                          href="#"
                          className="addlink"
                          onClick={(e) => {
                            e.preventDefault()
                            setModalUsuarioAberto(true)
                            setNovoUsuario({ username: '', password: '' })
                          }}
                        >
                          ADICIONAR USUÁRIO
                        </a>
                      </li>
                    </ul>

                    <ChangeList
                      searchPlaceholder="Pesquisar usuário ou e-mail"
                      busca={buscaUsuarios}
                      setBusca={setBuscaUsuarios}
                      acaoLabel="usuários"
                      colunas={[
                        { key: 'username',   label: 'Usuário',  primeiro: true },
                        { key: 'email',      label: 'E-mail' },
                        { key: 'nome_completo', label: 'Nome completo' },
                        { key: 'staff',      label: 'Equipe' },
                        { key: 'ativo',      label: 'Ativo' },
                        { key: 'data_fmt',   label: 'Membro desde' },
                        { key: 'acoes',      label: 'Ações' },
                      ]}
                      linhas={usuariosFiltrados.map(u => ({
                        id:            u.id,
                        username:      u.username,
                        email:         u.email || '-',
                        nome_completo: [u.first_name, u.last_name].filter(Boolean).join(' ') || '-',
                        staff:         u.is_staff  ? <IconSim /> : <IconNao />,
                        ativo:         u.is_active ? <IconSim /> : <IconNao />,
                        data_fmt:      formatarData(u.date_joined),
                        acoes: (
                          <button
                            className="action-icon"
                            onClick={() => setConfirmarExclusao({ aberto: true, tipo: 'usuario', id: u.id })}
                            title="Excluir usuário"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        ),
                      }))}
                      paginator={`${usuariosFiltrados.length} usuário${usuariosFiltrados.length !== 1 ? 's' : ''}`}
                    />
                  </>
                )}

              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          MODAL: MOVIMENTAÇÃO DE ESTOQUE
      ════════════════════════════════════════════════════════════ */}
      {modalMovAberto && (
        <Modal
          titulo="Adicionar movimentação estoque"
          onFechar={() => setModalMovAberto(false)}
          onSubmit={handleSubmitMov}
        >
          <FormRow id="saco" label="Saco">
            <select
              id="id_saco"
              value={sacoSelecionado}
              onChange={(e) => setSacoSelecionado(e.target.value)}
              required
            >
              <option value="">---------</option>
              {sacos.map(s => (
                <option key={s.id} value={s.id}>
                  {s.descricao} (Estoque: {s.quantidade_atual})
                </option>
              ))}
            </select>
          </FormRow>

          <FormRow id="tipo" label="Tipo">
            <select
              id="id_tipo"
              value={tipoMovimentacao}
              onChange={(e) => setTipoMovimentacao(e.target.value)}
              required
            >
              <option value="entrada">Entrada (+)</option>
              <option value="saida">Saída (-)</option>
            </select>
          </FormRow>

          <FormRow id="quantidade" label="Quantidade" help="Informe a quantidade a ser movimentada.">
            <input
              type="number"
              id="id_quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="1"
              required
            />
          </FormRow>

          <FormRow id="responsavel" label="Responsável" help="Quem da produção/estoque está registrando?">
            <input
              type="text"
              id="id_responsavel"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Ex: João da Produção"
            />
          </FormRow>

          <FormRow id="observacao" label="Observação">
            <input
              type="text"
              id="id_observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Opcional"
            />
          </FormRow>
        </Modal>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL: NOVA CATEGORIA
      ════════════════════════════════════════════════════════════ */}
      {modalCatAberto && (
        <Modal
          titulo="Adicionar categoria sacaria"
          onFechar={() => setModalCatAberto(false)}
          onSubmit={handleSubmitCat}
        >
          <FormRow id="nome" label="Nome" help="Ex: Convencional Impresso, Kraft, Laminado Valvulado">
            <input
              type="text"
              id="id_nome"
              value={nomeCategoria}
              onChange={(e) => setNomeCategoria(e.target.value)}
              placeholder="Nome da categoria"
              required
              autoFocus
            />
          </FormRow>
        </Modal>
      )}

      {/* MODAL: ADICIONAR SACO RESERVA - FORM ADD */}
      {modalSacoAberto && (
        <div className="modal-overlay" onClick={() => setModalSacoAberto(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar saco reserva</h2>
              <button className="modal-close" onClick={() => setModalSacoAberto(false)} aria-label="Fechar">×</button>
            </div>
            <form onSubmit={handleSubmitSaco}>
              <fieldset className="module aligned" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 16 }}>
                  <label style={{ width: 220, color: 'var(--body-fg)', fontWeight: 600 }}>Código referencia:</label>
                  <div style={{ flex: 1 }}>
                    <input type="text" id="id_codigo_referencia" value={codigoReferencia} onChange={(e) => setCodigoReferencia(e.target.value)} />
                    <div style={{ fontSize: 12, color: '#9aa6ad', marginTop: 6 }}>Código interno, se houver</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <label style={{ width: 220, color: 'var(--body-fg)', fontWeight: 600 }}>Descrição:</label>
                  <div style={{ flex: 1 }}>
                    <input type="text" id="id_descricao" value={descricaoSaco} onChange={(e) => setDescricaoSaco(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <label style={{ width: 220, color: 'var(--body-fg)', fontWeight: 600 }}>Categoria:</label>
                  <div style={{ flex: 1 }}>
                    <select id="id_categoria" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                      <option value="">---------</option>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <label style={{ width: 220, color: 'var(--body-fg)', fontWeight: 600 }}>Estoque mínimo:</label>
                  <div style={{ flex: 1 }}>
                    <input type="number" id="id_estoque_minimo" value={estoqueMinimo} onChange={(e) => setEstoqueMinimo(parseInt(e.target.value || 0))} />
                    <div style={{ fontSize: 12, color: '#9aa6ad', marginTop: 6 }}>Limite para alertar o vendedor no sistema</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <label style={{ width: 220, color: 'var(--body-fg)', fontWeight: 600 }}>Ativo:</label>
                  <div style={{ flex: 1 }}>
                    <input type="checkbox" id="id_ativo" checked={ativoSaco} onChange={(e) => setAtivoSaco(e.target.checked)} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <label style={{ width: 220, color: 'var(--body-fg)', fontWeight: 600 }}>Quantidade atual:</label>
                  <div style={{ flex: 1, color: 'var(--body-quiet-color)' }}>0</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 4 }}>
                  <label style={{ width: 220, color: 'var(--body-fg)', fontWeight: 600 }}>Última atualização:</label>
                  <div style={{ flex: 1, color: 'var(--body-quiet-color)' }}>-</div>
                </div>

              </fieldset>

              <div className="submit-row" style={{ background: '#2b2b2b' }}>
                <button type="button" className="button cancel-link" onClick={() => setModalSacoAberto(false)}>Cancelar</button>
                <button type="submit" style={{ background: '#0056b3', color: '#fff', padding: '10px 18px', border: 'none', borderRadius: 4, marginLeft: 8 }}>SALVAR</button>
                <button type="button" onClick={(e) => {
                  e.preventDefault()
                  const payload = {
                    codigo_referencia: codigoReferencia || null,
                    descricao: descricaoSaco,
                    categoria: categoriaId || null,
                    quantidade_atual: 0,
                    estoque_minimo: estoqueMinimo,
                    ativo: ativoSaco,
                  }
                  api.post('estoque/', payload)
                    .then(() => {
                      alert('Saco criado com sucesso!')
                      setCodigoReferencia('')
                      setDescricaoSaco('')
                      setCategoriaId('')
                      setEstoqueMinimo(100)
                      setAtivoSaco(true)
                      carregarSacos()
                    })
                    .catch(err => alert(err.response?.data || 'Erro ao criar.'))
                }} style={{ background: '#79aec8', color: '#fff', padding: '10px 14px', border: 'none', borderRadius: 4, marginLeft: 8 }}>Salvar e adicionar outro(a)</button>
                <button type="button" onClick={(e) => {
                  e.preventDefault()
                  const payload = {
                    codigo_referencia: codigoReferencia || null,
                    descricao: descricaoSaco,
                    categoria: categoriaId || null,
                    quantidade_atual: 0,
                    estoque_minimo: estoqueMinimo,
                    ativo: ativoSaco,
                  }
                  api.post('estoque/', payload)
                    .then(() => {
                      alert('Salvo com sucesso!')
                      carregarSacos()
                    })
                    .catch(err => alert(err.response?.data || 'Erro ao salvar.'))
                }} style={{ background: '#79aec8', color: '#fff', padding: '10px 14px', border: 'none', borderRadius: 4, marginLeft: 8 }}>Salvar e continuar editando</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* MODAL: CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmarExclusao.aberto && (
        <div className="confirm-overlay" onClick={() => setConfirmarExclusao({ aberto:false, tipo:null, id:null })}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">Confirmar Exclusão</div>
            <div className="confirm-body">Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.</div>
            <div className="confirm-footer">
              <button className="confirm-btn confirm-cancel" onClick={() => setConfirmarExclusao({ aberto:false, tipo:null, id:null })}>Cancelar</button>
              <button className="confirm-btn confirm-delete" onClick={executarExclusao}>Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}
      
      {/* MODAL: NOVO USUÁRIO */}
      {modalUsuarioAberto && (
        <Modal
          titulo="Adicionar usuário"
          onFechar={() => setModalUsuarioAberto(false)}
          onSubmit={handleSalvarUsuario}
        >
          <FormRow id="username" label="Nome de Usuário">
            <input
              type="text"
              id="id_novo_username"
              value={novoUsuario.username}
              onChange={(e) => setNovoUsuario(prev => ({ ...prev, username: e.target.value }))}
              required
            />
          </FormRow>

          <FormRow id="password" label="Senha">
            <input
              type="password"
              id="id_novo_password"
              value={novoUsuario.password}
              onChange={(e) => setNovoUsuario(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </FormRow>
          
          <FormRow id="confirm_password" label="Confirmar senha">
            <input
              type="password"
              id="id_confirm_password"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              required
            />
          </FormRow>
        </Modal>
      )}

    </div>
  )
}

export default PainelFabrica
