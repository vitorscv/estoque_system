 #  Sistema de Estoque Pantex
 
 Sistema completo de gerenciamento de estoque de sacarias, com duas interfaces integradas: uma para vendedores, focada em visualização, e outra para a fábrica, voltada ao controle operacional.
 
 ![Version](https://img.shields.io/badge/version-2.0.0-blue)
 ![Django](https://img.shields.io/badge/Django-6.0.3-green)
 ![React](https://img.shields.io/badge/React-19.2.4-blue)
 ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
 
 ---
 
 ##  Características
 
 ###  Modo Vendedor
 -  Visualização simples do estoque
 -  Busca em tempo real
 -  Interface limpa e intuitiva
 -  Apenas leitura
 
 ###  Modo Fábrica (Painel Admin)
 - ✅ **Clone fiel do Django Admin** em modo escuro
 - ✅ Sidebar colapsável com navegação
 - ✅ Busca e filtros em tempo real
 - ✅ Adicionar movimentações (entrada/saída)
 - ✅ Tabela responsiva com linhas alternadas
 - ✅ Modal de formulário estilo Django
 - ✅ Breadcrumbs funcionais
 - ✅ Ícones SVG de status
 - ✅ Totalmente responsivo (mobile-first)
 
 ---
 
 ##  Início Rápido
 
 ### Pré-requisitos
 
 - Python 3.12+
 - Node.js 18+
 - PostgreSQL 16+
 
 ### Instalação
 
 #### 1. Clone o repositório
 ```bash
 git clone https://github.com/vitorscv/estoque_system.git
 cd estoque_system
 ```
 
 #### 2. Configure o Backend (Django)
 
 ```bash
 # Navegue para a pasta api
 cd api
 
 # Crie um ambiente virtual
 python -m venv venv
 
 # Ative o ambiente virtual
 # Windows:
 venv\Scripts\activate
 # Linux/Mac:
 source venv/bin/activate
 
 # Instale as dependências
 pip install django djangorestframework django-cors-headers psycopg2
 
 # Configure o banco de dados no config/settings.py
 # Crie o banco 'estoque_system' no PostgreSQL
 
 # Execute as migrações
 python manage.py makemigrations
 python manage.py migrate
 
 # Crie um superusuário (opcional)
 python manage.py createsuperuser
 
 # Inicie o servidor
 python manage.py runserver
 ```
 
 ✅ **Backend rodando em:** http://127.0.0.1:8000/
 
 #### 3. Configure o Frontend (React)
 
 ```bash
 # Em outro terminal, navegue para a pasta web
 cd web
 
 # Instale as dependências
 npm install
 
 # Inicie o servidor de desenvolvimento
 npm run dev
 ```
 
 ✅ **Frontend rodando em:** http://localhost:5173/
 
 ---
 
 ## 📁 Estrutura do Projeto
 
 ```
 estoque_system/
 ├── api/                          # Backend Django
 │   ├── apps/
 │   │   └── products/             # App de produtos
 │   │       ├── models.py         # Modelos (SacoReserva, etc)
 │   │       ├── serializers.py    # Serializers DRF
 │   │       ├── views.py          # Views da API
 │   │       ├── urls.py           # Rotas da API
 │   │       └── admin.py          # Admin do Django
 │   ├── config/                   # Configurações do Django
 │   │   ├── settings.py           # Settings
 │   │   ├── urls.py               # URLs principais
 │   │   └── wsgi.py
 │   ├── venv/                     # Ambiente virtual
 │   └── manage.py                 # CLI do Django
 │
 ├── web/                          # Frontend React
 │   ├── src/
 │   │   ├── pages/
 │   │   │   ├── Estoque.jsx       # Tela do vendedor
 │   │   │   └── PainelFabrica.jsx # Tela da fábrica (Django Admin clone)
 │   │   ├── styles/
 │   │   │   ├── Estoque.css       # Estilos do vendedor
 │   │   │   ├── PainelFabrica.css # Estilos da fábrica (700+ linhas)
 │   │   │   └── index.css         # Estilos globais
 │   │   ├── services/
 │   │   │   └── api.js            # Configuração Axios
 │   │   ├── App.jsx               # Componente principal
 │   │   └── main.jsx              # Entry point
 │   ├── public/                   # Assets estáticos
 │   ├── package.json              # Dependências Node
 │   └── vite.config.js            # Configuração Vite
 │
 ├── CHANGELOG.md                  # Histórico de mudanças
 ├── PAINEL_FABRICA_DOCS.md        # Documentação técnica
 ├── COMPARACAO_VISUAL.md          # Antes vs Depois
 ├── GUIA_RAPIDO.md                # Guia de uso rápido
 └── README.md                     # Este arquivo
 ```
 
 ---
 
 ##  Endpoints da API
 
 ### Listar Sacos
 ```http
 GET /api/estoque/
 ```
 
 **Response:**
 ```json
 [
   {
     "id": 1,
     "descricao": "Saco 50kg Convencional Impresso",
     "categoria_nome": "Convencional Impresso",
     "quantidade_atual": 100,
     "ativo": true
   }
 ]
 ```
 
 ### Movimentar Estoque
 ```http
 POST /api/estoque/{id}/movimentar/
 ```
 
 **Request Body:**
 ```json
 {
   "quantidade": 10,
   "tipo": "entrada"  // ou "saida"
 }
 ```
 
 **Response:**
 ```json
 {
   "status": "Movimentação registrada com sucesso!"
 }
 ```
 
 ---
 
 ##  Tecnologias Utilizadas
 
 ### Backend
 - **Django 6.0.3** - Framework web
 - **Django REST Framework** - API REST
 - **PostgreSQL** - Banco de dados
 - **django-cors-headers** - CORS
 - **psycopg2** - Driver PostgreSQL
 
 ### Frontend
 - **React 19.2.4** - Biblioteca UI
 - **Vite 8.0.1** - Build tool
 - **Axios 1.13.6** - Cliente HTTP
 - **CSS3** - Estilização (700+ linhas)
 
 ---
 
 ##  Screenshots
 
 ### Tela do Vendedor
 ```
 ┌─────────────────────────────────────┐
 │ Estoque Disponível - Pantex         │
 ├─────────────────────────────────────┤
 │ [Pesquisar por tamanho...]          │
 ├─────────────────────────────────────┤
 │ Descrição    │ Categoria │ Qtd      │
 │ Saco 50kg    │ Conv Imp  │ 100 un.  │
 │ Saco 25kg    │ Kraft     │ 50 un.   │
 └─────────────────────────────────────┘
 ```
 
 ### Painel Fábrica (Django Admin Clone)
 ```
 ┌─────────────────────────────────────────────┐
 │ ☰ Administração do Django  Bem-vindo, Vitor│
 ├─────────────────────────────────────────────┤
 │ Início › Saco reservas                      │
 ├───────┬─────────────────────────────────────┤
 │       │ Selecione saco reserva para alterar│
 │ Prods │ [+ Adicionar movimentação estoque]  │
 │ ├Categ├─────────────────────────────────────┤
 │ ├Movim│ [Pesquisar saco reserva...]         │
 │ └Sacos├─────────────────────────────────────┤
 │       │ Ação: [--------] [Ir]               │
 │ Auth  ├─────────────────────────────────────┤
 │ ├Grupo│ ☑ Descrição │ Categoria │ Qtd │ ✓   │
 │ └Users│ ☐ Saco 50kg │ Conv Imp  │ 100 │ ✓   │
 │       │ ☐ Saco 25kg │ Kraft     │ 50  │ ✓   │
 │       ├─────────────────────────────────────┤
 │       │ 2 sacos reservas                    │
 └───────┴─────────────────────────────────────┘
 ```
 
 ---
 
  
 
 
 ## 🔧 Configuração
 
 ### Banco de Dados
 
 Edite `api/config/settings.py`:
 
 ```python
 DATABASES = {
     'default': {
         'ENGINE': 'django.db.backends.postgresql',
         'NAME': 'estoque_system',
         'USER': 'postgres',
         'PASSWORD': 'sua_senha',
         'HOST': 'localhost',
         'PORT': '5432',
     }
 }
 ```
 
 ### CORS
 
 Já configurado em `api/config/settings.py`:
 
 ```python
 CORS_ALLOW_ALL_ORIGINS = True  # Apenas para desenvolvimento!
 ```
 
 ** Produção:** Configure origins específicas:
 ```python
 CORS_ALLOWED_ORIGINS = [
     "https://seu-dominio.com",
 ]
 ```
 
 ---
 
 ##  Testes
 
 ### Backend (Django)
 
 ```bash
 cd api
 python manage.py test
 ```
 
 ### Frontend (React)
 
 ```bash
 cd web
 npm test
 ```
 
 ---
 
 ##  Build para Produção
 
 ### Backend
 
 ```bash
 cd api
 pip install gunicorn
 gunicorn config.wsgi:application
 ```
 
 ### Frontend
 
 ```bash
 cd web
 npm run build
 # Arquivos em: dist/
 ```

 
 
 ---
 
 ##  Status do Projeto
 
 - ✅ **Backend**: Completo e funcional
 - ✅ **Frontend Vendedor**: Completo
 - ✅ **Frontend Fábrica**: Completo (Clone Django Admin)
 - ✅ **API REST**: Funcionando
 - ✅ **Responsividade**: Implementada
 - ⏳ **Autenticação**: Planejado
 - ⏳ **Testes**: Planejado
 - ⏳ **Deploy**: Planejado
 
 ---
 
 
