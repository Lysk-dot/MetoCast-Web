# 🚀 Documentação de Deploy - MetoCast

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Backend - Railway](#backend---railway)
4. [Frontend - GitHub Pages](#frontend---github-pages)
5. [URLs e Acessos](#urls-e-acessos)
6. [Manutenção](#manutenção)

---

## 🎯 Visão Geral

O MetoCast está hospedado em uma arquitetura serverless gratuita:

- **Frontend**: GitHub Pages
- **Backend**: Railway
- **Banco de Dados**: PostgreSQL no Railway

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────┐
│  GitHub Pages (Frontend React)              │
│  https://lysk-dot.github.io/MetoCast-Web/   │
└────────────────┬────────────────────────────┘
                 │
                 │ HTTPS Requests
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Railway (Backend FastAPI)                  │
│  https://metocast-production.up.railway.app │
└────────────────┬────────────────────────────┘
                 │
                 │ SQL Queries
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  PostgreSQL Database (Railway)              │
│  postgres.railway.internal:5432             │
└─────────────────────────────────────────────┘
```

---

## 🔧 Backend - Railway

### Configuração Inicial

1. **Projeto criado**: `creative-light` (production)
2. **Repositório**: GitHub → `MetoCast` (backend Python/FastAPI)
3. **Banco de dados**: PostgreSQL adicionado ao projeto

### Variáveis de Ambiente

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `DATABASE_URL` | `postgresql://postgres:***@postgres.railway.internal:5432/railway` | Conexão com PostgreSQL |
| `SECRET_KEY` | `metocast-super-secret-key-2026` | Chave de criptografia JWT |
| `ALGORITHM` | `HS256` | Algoritmo de hash para JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Tempo de expiração do token |
| `DEBUG` | `False` | Modo de produção |
| `ALLOWED_ORIGINS` | `https://lysk-dot.github.io` | CORS - domínios permitidos |

### Custom Start Command

```bash
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**O que faz:**
1. `alembic upgrade head` - Cria/atualiza as tabelas do banco automaticamente
2. `uvicorn app.main:app` - Inicia o servidor FastAPI

### Deploy

- **Tipo**: Automático via GitHub
- **Branch**: `main`
- **Trigger**: A cada push no repositório

---

## 💻 Frontend - GitHub Pages

### Configuração Inicial

1. **Repositório**: `Lysk-dot/MetoCast-Web`
2. **Deploy**: GitHub Actions (workflow automático)
3. **Source**: GitHub Actions (configurado em Settings → Pages)

### Alterações no Código

#### 1. API Base URL (`src/services/api.js`)

```javascript
// Usa Railway em produção, localhost em desenvolvimento
const API_BASE = import.meta.env.PROD 
  ? 'https://metocast-production.up.railway.app/api'
  : 'http://localhost:8000/api';
```

#### 2. Vite Config (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/MetoCast-Web/', // Subpath do GitHub Pages
})
```

### GitHub Actions Workflow

**Arquivo**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - Checkout do código
      - Setup Node.js 20
      - npm ci (instalar dependências)
      - npm run build (gerar build de produção)
      - Upload artifact

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - Deploy para GitHub Pages
```

### Deploy

- **Tipo**: Automático via GitHub Actions
- **Branch**: `main`
- **Trigger**: A cada push no repositório
- **Tempo**: ~1-2 minutos

---

## 🌐 URLs e Acessos

### Produção

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | [https://lysk-dot.github.io/MetoCast-Web/](https://lysk-dot.github.io/MetoCast-Web/) | Site público |
| **Backend API** | [https://metocast-production.up.railway.app/api](https://metocast-production.up.railway.app/api) | API REST |
| **API Docs** | [https://metocast-production.up.railway.app/docs](https://metocast-production.up.railway.app/docs) | Swagger UI |
| **Redoc** | [https://metocast-production.up.railway.app/redoc](https://metocast-production.up.railway.app/redoc) | Documentação alternativa |

### Desenvolvimento

| Serviço | URL | Comando |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | `npm run dev` |
| **Backend** | http://localhost:8000 | `uvicorn app.main:app --reload` |

### Railway Dashboard

- **URL do Projeto**: [https://railway.app/project/6b5d0bf0-4bfc-49df-a1cb-9daf1de305a5](https://railway.app/project/6b5d0bf0-4bfc-49df-a1cb-9daf1de305a5)
- **Nome do Projeto**: creative-light
- **Ambiente**: production
- **Serviços**:
  - **MetoCast** (Backend API) - [https://metocast-production.up.railway.app](https://metocast-production.up.railway.app)
  - **Postgres** (Database) - postgres.railway.internal:5432

### GitHub

- **Frontend Repo**: [https://github.com/Lysk-dot/MetoCast-Web](https://github.com/Lysk-dot/MetoCast-Web)
- **Backend Repo**: [https://github.com/Lysk-dot/MetoCast](https://github.com/Lysk-dot/MetoCast)
- **Actions (Deploy)**: [https://github.com/Lysk-dot/MetoCast-Web/actions](https://github.com/Lysk-dot/MetoCast-Web/actions)
- **Pages Settings**: [https://github.com/Lysk-dot/MetoCast-Web/settings/pages](https://github.com/Lysk-dot/MetoCast-Web/settings/pages)

---

## 🔄 Manutenção

### Como fazer deploy de alterações

#### Frontend
1. Faça as alterações no código
2. Commit e push para `main`:
   ```bash
   git add .
   git commit -m "feat: sua alteração"
   git push
   ```
3. O GitHub Actions faz deploy automaticamente

#### Backend
1. Faça as alterações no código do backend
2. Commit e push para `main` no repositório MetoCast
3. O Railway faz deploy automaticamente

### Como adicionar novas variáveis de ambiente

1. Acesse Railway → MetoCast → Variables
2. Clique em "New Variable"
3. Adicione nome e valor
4. O Railway faz redeploy automaticamente

### Como rodar migrations

As migrations rodam automaticamente no start command.

Para rodar manualmente no Railway:
1. MetoCast → Settings → Redeploy

### Como ver logs

**Railway:**
1. Clique no serviço MetoCast
2. Aba "Deployments"
3. Clique no deployment ativo
4. Veja os logs em tempo real

**GitHub Actions:**
1. Vá em Actions
2. Clique no workflow
3. Expanda os steps para ver logs

### Como configurar domínio customizado

#### No GitHub Pages:
1. Acesse: [Settings → Pages → Custom domain](https://github.com/Lysk-dot/MetoCast-Web/settings/pages)
2. Adicione seu domínio (ex: `metocast.org`)
3. Configure DNS no seu provedor:
   ```
   Type: CNAME
   Name: www (ou @)
   Value: lysk-dot.github.io
   ```
4. **Importante**: Após configurar o domínio customizado, atualize o `base` no `vite.config.js`:
   ```javascript
   base: '/', // Mude de '/MetoCast-Web/' para '/'
   ```

#### No Railway:
1. Acesse: [MetoCast → Settings → Networking](https://railway.app/project/6b5d0bf0-4bfc-49df-a1cb-9daf1de305a5)
2. Custom Domain → Add domain
3. Configure DNS conforme instruções do Railway

#### Atualizar CORS:
No Railway, adicione o novo domínio em `ALLOWED_ORIGINS`:
```bash
ALLOWED_ORIGINS=https://lysk-dot.github.io,https://metocast.org,https://www.metocast.org
```

---

## 📊 Custos

### Tier Gratuito

| Serviço | Plano | Limites |
|---------|-------|---------|
| GitHub Pages | Free | 100GB bandwidth/mês |
| Railway | Trial | $5/mês em créditos gratuitos |
| PostgreSQL (Railway) | Incluído | Compartilha os créditos |

**Observação**: O Railway oferece 30 dias de trial com $5 de crédito. Após isso, você pode:
- Adicionar cartão para continuar no plano Hobby ($5/mês)
- Migrar para outra plataforma (Render, Fly.io, etc.)

---

## 🐛 Troubleshooting

### Frontend não carrega
- Verifique se o GitHub Actions rodou com sucesso
- Confirme que GitHub Pages está ativado
- Verifique o `base` no vite.config.js

### API não responde
- Verifique se o deploy do Railway foi bem-sucedido
- Confira os logs no Railway
- Teste: https://metocast-production.up.railway.app/docs

### Erro de CORS
- Adicione o domínio em `ALLOWED_ORIGINS` no Railway
- Faça redeploy após alterar

### Banco de dados vazio
- Verifique se o start command está correto
- Rode as migrations: `alembic upgrade head`
- Verifique logs do Railway

---

## 📝 Commits Importantes

1. **876377c** - feat: configurar deploy GitHub Pages + API Railway
2. **91786fc** - fix: ajustar base path para GitHub Pages
3. **8dd531e** - docs: adicionar documentação completa de deploy
4. **5e1c21b** - fix: corrigir caminhos das imagens para GitHub Pages

---

## ⚙️ Configurações Técnicas

### Vite Base Path
- **Desenvolvimento**: `/` (localhost)
- **Produção (subpath)**: `/MetoCast-Web/`
- **Produção (domínio próprio)**: `/`

### Variáveis de Ambiente (Railway)

```env
DATABASE_URL=postgresql://postgres:***@postgres.railway.internal:5432/railway
SECRET_KEY=metocast-super-secret-key-2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
ALLOWED_ORIGINS=https://lysk-dot.github.io
```

### Portas
- **Frontend Local**: 5173
- **Backend Local**: 8000
- **Backend Railway**: Porta dinâmica ($PORT)
- **PostgreSQL**: 5432

---

## 👥 Contatos e Suporte

- **Organização**: creative-light (Railway)
- **GitHub**: Lysk-dot
- **Repositórios**:
  - Frontend: MetoCast-Web
  - Backend: MetoCast

---

**Última atualização**: 31 de Janeiro de 2026
