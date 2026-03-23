Sistema de Estoque Pantex
Aplicação full stack para controle de estoque de sacaria, com dois portais de uso:
Portal Vendedor: consulta de estoque em modo leitura.
Portal Fábrica: operação administrativa com cadastro, movimentação, categorias e usuários.
O projeto é dividido em:
Backend em Django + Django REST Framework + JWT
Frontend em React + Vite
---
Visão geral
O sistema foi estruturado para atender dois perfis com permissões diferentes:
1. Representantes / Vendedores
Podem:
fazer login
consultar estoque disponível
pesquisar itens
visualizar quantidades e categorias
Não podem:
cadastrar sacos
cadastrar categorias
movimentar estoque
excluir usuários
2. Fábrica
Pode:
consultar estoque
cadastrar itens de estoque
cadastrar categorias
registrar entrada e saída de estoque
visualizar movimentações
visualizar grupos
cadastrar e excluir usuários
acessar o admin padrão do Django
---
Stack do projeto
Backend
Python 3.12+
Django 6.0.3
Django REST Framework 3.17.0
SimpleJWT 5.5.1
django-cors-headers 4.9.0
psycopg2-binary 2.9.11
django-environ 0.10.0
Frontend
React 19
Vite 8
Axios
CSS puro
---
Estrutura real do repositório
```text
estoque_system/
├── api/
│   ├── apps/
│   │   └── products/
│   │       ├── admin.py
│   │       ├── apps.py
│   │       ├── models.py
│   │       ├── permissions.py
│   │       ├── serializers.py
│   │       ├── urls.py
│   │       └── views.py
│   ├── config/
│   │   ├── management/commands/diagnose_db_config.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── .env.example
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
├── web/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── Estoque.jsx
│   │   │   ├── LoginFabrica.jsx
│   │   │   ├── LoginVendedor.jsx
│   │   │   └── PainelFabrica.jsx
│   │   ├── services/api.js
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
└── README.md
```
---
Como a autenticação funciona
O backend usa JWT com os endpoints:
`POST /api/login/`
`POST /api/login/refresh/`
`GET /api/auth/me/`
Depois do login, o frontend consulta `auth/me` para descobrir se o usuário pertence ao grupo:
Fabrica
Representantes
Isso define qual portal o usuário pode acessar.
Regras de permissão implementadas
Fábrica: acesso completo aos endpoints administrativos.
Representantes: acesso somente de leitura ao estoque.
Superusuário: tratado como usuário com acesso de fábrica.
---
Modelos principais
CategoriaSacaria
Representa a categoria do item de estoque.
Campos principais:
`nome`
SacoReserva
Representa o item de estoque.
Campos principais:
`codigo_referencia`
`descricao`
`categoria`
`quantidade_atual`
`estoque_minimo`
`ativo`
`ultima_atualizacao`
`criado_em`
MovimentacaoEstoque
Representa entradas e saídas de estoque.
Campos principais:
`saco`
`tipo` (`entrada` ou `saida`)
`quantidade`
`data_movimentacao`
`responsavel`
`observacao`
Observação importante sobre movimentação
O saldo do item é atualizado no `save()` de `MovimentacaoEstoque` usando `F()` do Django.
Isso funciona para registrar entradas e saídas, mas como o saldo é alterado no momento de salvar a movimentação, qualquer futura mudança na regra de negócio deve ser tratada com cuidado para evitar inconsistência.
---
Endpoints disponíveis
Autenticação
`POST /api/login/`
`POST /api/login/refresh/`
`GET /api/auth/me/`
Estoque
`GET /api/estoque/`
`POST /api/estoque/`
`GET /api/estoque/<id>/`
`PUT /api/estoque/<id>/`
`PATCH /api/estoque/<id>/`
`DELETE /api/estoque/<id>/`
`POST /api/estoque/<id>/movimentar/`
Categorias
`GET /api/categorias/`
`POST /api/categorias/`
`GET /api/categorias/<id>/`
`PUT /api/categorias/<id>/`
`PATCH /api/categorias/<id>/`
`DELETE /api/categorias/<id>/`
Movimentações
`GET /api/movimentacoes/`
`GET /api/movimentacoes/<id>/`
Grupos
`GET /api/grupos/`
Usuários
`GET /api/usuarios/`
`POST /api/usuarios/`
`DELETE /api/usuarios/<id>/`
Admin Django
`GET /admin/`
---
Banco de dados
O projeto foi preparado com três estratégias de configuração, nesta ordem de prioridade:
`DATABASE_URL`
variáveis `DB_*`
fallback automático para SQLite
Isso significa que o sistema pode rodar em desenvolvimento mesmo sem Postgres, mas em ambiente real o ideal é usar Postgres.
Estratégia 1: `DATABASE_URL`
Exemplo:
```env
DATABASE_URL=postgres://postgres:senha@localhost:5432/estoque_system
```
Estratégia 2: variáveis `DB_*`
Exemplo:
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=estoque_system
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```
Estratégia 3: fallback local
Se nada for definido, o Django usa:
```text
api/db.sqlite3
```
---
Arquivo `.env`
Use `api/.env.example` como base e crie um arquivo `api/.env`.
Exemplo mínimo para desenvolvimento com Postgres:
```env
SECRET_KEY=changeme-development-secret
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
ENVIRONMENT=development

DB_ENGINE=django.db.backends.postgresql
DB_NAME=estoque_system
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```
Exemplo mínimo para desenvolvimento local com SQLite:
```env
SECRET_KEY=changeme-development-secret
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
ENVIRONMENT=development
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```
---
Diagnóstico de banco
O projeto já possui um comando útil para identificar qual estratégia de banco está ativa:
```bash
cd api
python manage.py diagnose_db_config
```
Ele mostra:
estratégia usada
engine
nome do banco
host
porta
usuário mascarado
Esse comando ajuda bastante quando o projeto para de conectar no Postgres e cai sem perceber para SQLite.
---
Como rodar o projeto
1. Backend
```bash
cd api
python -m venv venv
```
Windows
```bash
venv\Scripts\activate
```
Linux / macOS
```bash
source venv/bin/activate
```
Instale as dependências:
```bash
pip install -r requirements.txt
```
Configure o `.env` e rode:
```bash
python manage.py migrate
python manage.py runserver
```
Backend padrão:
```text
http://127.0.0.1:8000/
```
2. Frontend
Em outro terminal:
```bash
cd web
npm install
npm run dev
```
Frontend padrão:
```text
http://localhost:5173/
```
---
Fluxo de uso da aplicação
Portal vendedor
login do representante
consulta de estoque
pesquisa por descrição
visualização de quantidade atual e categoria
Portal fábrica
login com usuário de fábrica
painel com visual inspirado no Django Admin
abas para estoque, categorias, movimentações, grupos e usuários
cadastro de novos itens
cadastro de categorias
entrada e saída de estoque
exclusão de usuários
suporte a tema claro/escuro
---
Comportamento atual do frontend
O frontend mantém dois tokens separados no `localStorage`:
`tokenPantex` para fábrica
`tokenPantexVendedor` para vendedor
E usa `sessionStorage` para guardar o contexto atual da sessão:
`pantexContext = fabrica`
`pantexContext = vendedor`
Com isso, as requisições escolhem automaticamente qual token usar.
---
Pontos fortes do projeto
separação clara entre backend e frontend
autenticação JWT já pronta
permissão por grupos implementada
fluxo vendedor x fábrica bem definido
fallback de banco útil para desenvolvimento
comando de diagnóstico de banco incluído
painel administrativo customizado com boa experiência visual
---
Pontos de atenção encontrados na análise
Durante a análise do projeto, estes pontos merecem ajuste:
1. Ambiente virtual dentro do repositório
Foi encontrado `api/.venv/` dentro do projeto.
Isso não deve ser versionado.
2. Banco SQLite dentro do repositório
Existe `api/db.sqlite3` no projeto.
Em produção ou em fluxo com Postgres, isso pode gerar confusão, porque o sistema pode parecer “funcionar”, mas estar apontando para SQLite em vez de Postgres.
3. Arquivos de cache do Python
Pastas `__pycache__` e arquivos `.pyc` devem ser ignorados no Git.
4. README antigo estava desatualizado
O README anterior citava alguns arquivos e estruturas que não batem exatamente com o estado atual do repositório.
---
`.gitignore` recomendado
Sugestão mínima para este projeto:
```gitignore
__pycache__/
*.pyc
.venv/
venv/
api/.venv/
.env
.env.*
api/.env
node_modules/
web/node_modules/
api/db.sqlite3
```
Se algum desses arquivos já entrou no Git, será necessário removê-los do índice com `git rm --cached`.
---
Melhorias recomendadas
Curto prazo
adicionar e aplicar um `.gitignore` correto
remover `api/.venv` do versionamento
decidir se o ambiente oficial será Postgres ou SQLite para desenvolvimento
documentar usuários iniciais e grupos padrão
Médio prazo
criar seeds ou fixtures para categorias e usuários iniciais
adicionar testes para permissões e movimentação de estoque
paginar listagens grandes
validar melhor atualização de estoque e concorrência
Longo prazo
auditoria mais completa de movimentações
relatórios por período, categoria e usuário
alertas visuais de estoque mínimo
deploy automatizado
---
Exemplo de criação de grupos
No Django Admin ou shell, crie os grupos:
`Fabrica`
`Representantes`
Esses nomes precisam bater exatamente com o código em `permissions.py`.
---
Exemplo de usuário via API
Criar usuário de fábrica
```json
{
  "username": "operador1",
  "email": "operador1@empresa.com",
  "password": "123456",
  "eh_representante": false
}
```
Criar usuário representante
```json
{
  "username": "vendedor1",
  "email": "vendedor1@empresa.com",
  "password": "123456",
  "eh_representante": true
}
```
---
Status atual do projeto
O projeto está funcional como base para operação interna de estoque, com autenticação, permissões por grupo e interface separada para fábrica e representantes.
A principal atenção hoje não está na regra central do sistema, mas na organização do repositório e da configuração de ambiente, especialmente para evitar confusão entre:
Postgres
SQLite
`.env`
arquivos temporários/versionados indevidamente
---
Licença
Uso interno.