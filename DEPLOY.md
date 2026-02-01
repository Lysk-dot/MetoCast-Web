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
5. **7b5cfad** - fix: corrigir múltiplos problemas de tela preta no login
6. **67147ee** - fix: resolver tela preta no login adicionando estado de loading
7. **8e5dd78** - fix: corrigir tela preta no login na segunda navegação
8. **e99d216** - fix: usar navigate() no useEffect ao invés de Navigate component

---

## 🔧 Correção de Bugs Recentes

### Problema 1: Tela Preta no Login (1 de Fev, 2026)

**Sintoma**: Ao acessar a página de login, a tela ficava completamente preta, sem nenhum conteúdo visível.

**Causa Raiz**: 
O componente `Login` tentava renderizar antes do `AuthContext` terminar a verificação inicial de autenticação, causando um estado de "limbo" onde:
- O `loading` do `AuthContext` estava `true`
- O componente `Login` não aguardava esse estado
- O CSS do Tailwind não tinha tempo de carregar/aplicar
- Não havia fallback visual durante o carregamento

**Soluções Implementadas**:

#### 1. Centralização do Loading no AuthProvider ([AuthContext.jsx](src/context/AuthContext.jsx))
```javascript
// Antes: children renderizava mesmo com loading=true
return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);

// Depois: loading renderiza tela própria com estilos inline
if (loading) {
  return (
    <AuthContext.Provider value={value}>
      <div className="min-h-screen flex items-center justify-center" 
           style={{ backgroundColor: '#0D0D0F' }}>
        <div className="text-center">
          <div className="spinner mx-auto mb-4" 
               style={{ borderColor: '#FFC107', borderTopColor: 'transparent' }}>
          </div>
          <p style={{ color: '#B0B0B8' }}>Carregando...</p>
        </div>
      </div>
    </AuthContext.Provider>
  );  
}
```

**Benefício**: Garante que sempre há algo visível na tela durante o carregamento inicial.

#### 2. Logs de Debug Detalhados
```javascript
console.log('[AuthProvider] Render - loading:', loading, 'isAuth:', isAuthenticated);
console.log('[AuthContext] Verificando autenticação...');
console.log('[AuthContext] Verificação concluída, setando loading=false');
```

**Benefício**: Facilita identificar onde o carregamento trava no futuro.

#### 3. Tratamento de Erros Robusto
```javascript
try {
  // verificação de autenticação
} catch (error) {
  console.error('[AuthContext] Erro ao verificar autenticação:', error);
} finally {
  setLoading(false); // SEMPRE seta loading=false, mesmo com erro
}
```

**Benefício**: Evita que erros na API travem a aplicação indefinidamente.

#### 4. Estilos Inline como Fallback ([Login.jsx](src/pages/Login.jsx))
```javascript
// Adicionado style inline além das classes Tailwind
<div className="min-h-screen bg-surface-dark ..." 
     style={{ backgroundColor: '#0D0D0F', minHeight: '100vh' }}>
```

**Benefício**: Garante background escuro mesmo se o Tailwind falhar ao carregar.

#### 5. Simplificação do ProtectedRoute ([App.jsx](src/App.jsx))
```javascript
// Antes: loading duplicado em App.jsx e AuthContext
if (loading) return <LoadingScreen />;
return isAuthenticated ? children : <Navigate />;

// Depois: loading apenas no AuthContext
return isAuthenticated ? children : <Navigate />;
```

**Benefício**: Remove lógica duplicada e conflitante.

**Arquivos Modificados**:
- `src/context/AuthContext.jsx` - Loading centralizado + logs + try-catch
- `src/pages/Login.jsx` - Removido loading duplicado + estilos inline
- `src/App.jsx` - Simplificado ProtectedRoute

**Como Testar**:
1. Abra o DevTools (F12) → Console
2. Acesse `http://localhost:5173/MetoCast-Web/login`
3. Verifique os logs:
   ```
   [AuthProvider] Render - loading: true, isAuth: false
   [AuthContext] Verificando autenticação...
   [AuthContext] Nenhum token encontrado
   [AuthContext] Verificação concluída, setando loading=false
   [AuthProvider] Render - loading: false, isAuth: false
   ```
4. A tela de login deve aparecer com background escuro

**Status**: ✅ Resolvido

---

### Problema 2: Tela Preta na Segunda Navegação para Login (1 de Fev, 2026)

**Sintoma**: Após fazer login com sucesso, ao voltar para a página principal e tentar acessar `/login` novamente, a tela ficava preta na segunda vez.

**Causa Raiz**:
O `AuthProvider` estava bloqueando **toda a aplicação** durante o estado de `loading`, incluindo páginas públicas como o Login. Isso causava:
- Na primeira visita: funcionava porque o loading era rápido
- Na segunda visita: o `AuthContext` executava `checkAuth()` novamente, colocando `loading=true`
- Durante esse loading, **nada** era renderizado, nem mesmo a tela de login
- Resultado: tela preta até o loading terminar

**Problema de Arquitetura**:
```javascript
// ❌ ERRADO - AuthProvider bloqueando tudo
if (loading) {
  return <LoadingScreen />; // Bloqueia Home, Login, tudo!
}
return <AuthContext.Provider>{children}</AuthContext.Provider>;
```

**Soluções Implementadas**:

#### 1. AuthProvider não bloqueia mais a aplicação ([AuthContext.jsx](src/context/AuthContext.jsx))
```javascript
// ✅ CORRETO - Não bloqueia, apenas fornece o estado
const value = { user, isAuthenticated, loading, login, logout };

return (
  <AuthContext.Provider value={value}>
    {children} {/* Sempre renderiza os children */}
  </AuthContext.Provider>
);
```

**Benefício**: Cada rota decide individualmente como lidar com o estado de loading.

#### 2. Login trata loading individualmente ([Login.jsx](src/pages/Login.jsx))
```javascript
const { login, isAuthenticated, loading: authLoading } = useAuth();

// Mostra loading apenas na página de login
if (authLoading) {
  return <LoadingScreen message="Verificando autenticação..." />;
}

// Redireciona se já estiver logado
useEffect(() => {
  if (!authLoading && isAuthenticated) {
    navigate('/admin', { replace: true });
  }
}, [authLoading, isAuthenticated, navigate]);
```

**Benefício**: Loading só aparece onde é necessário, não bloqueia navegação.

#### 3. ProtectedRoute trata loading ([App.jsx](src/App.jsx))
```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Verificando acesso..." />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
```

**Benefício**: Rotas protegidas aguardam verificação antes de decidir redirecionar.

**Arquivos Modificados**:
- `src/context/AuthContext.jsx` - Removido bloqueio global
- `src/pages/Login.jsx` - Adicionado tratamento individual de loading
- `src/App.jsx` - ProtectedRoute aguarda verificação

**Status**: ✅ Resolvido

---

### Problema 3: Warning do React Router (1 de Fev, 2026)

**Sintoma**: Console do navegador mostrando warning:
```
Warning: You should call navigate() in a React.useEffect(), not when your component is first rendered.
```

**Causa Raiz**:
Usar `<Navigate>` component durante a renderização inicial causa efeitos colaterais (side effects) no render, o que é contra as práticas do React.

```javascript
// ❌ ERRADO - Navegação durante renderização
const Login = () => {
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />; // Side effect no render!
  }
  return <LoginForm />;
};
```

**Solução Implementada**:

#### Mover navegação para useEffect ([Login.jsx](src/pages/Login.jsx))
```javascript
// ✅ CORRETO - Navegação em useEffect
const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);
  
  if (authLoading) return <LoadingScreen />;
  
  return <LoginForm />;
};
```

**Por que funciona**:
- `useEffect` é o lugar correto para side effects como navegação
- A navegação só acontece **após** o render estar completo
- Dependencies garantem que a navegação seja refeita quando necessário

**Arquivos Modificados**:
- `src/pages/Login.jsx` - Substituído `<Navigate>` por `navigate()` em `useEffect`

**Status**: ✅ Resolvido

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

**Última atualização**: 1 de Fevereiro de 2026
