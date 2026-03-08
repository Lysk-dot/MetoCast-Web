# Documentação de Deploy — MetôCast v2

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Pré-requisitos](#pré-requisitos)
4. [Deploy com Docker](#deploy-com-docker)
5. [Cloudflare Tunnel](#cloudflare-tunnel)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Manutenção](#manutenção)
8. [Desenvolvimento Local](#desenvolvimento-local)
9. [Troubleshooting](#troubleshooting)

---

## Visão Geral

O MetôCast roda em um servidor Linux com a seguinte stack:

- **Next.js** — Frontend + API (tudo em um)
- **PostgreSQL** — Banco de dados (comentários e sugestões)
- **Nginx** — Reverse proxy com rate limiting e compressão
- **Cloudflare Tunnel** — Exposição segura ao domínio público
- **Docker Compose** — Orquestração dos containers

Episódios são automaticamente buscados do RSS do YouTube. Vídeos são entregues via embed do YouTube (zero carga no servidor).

---

## Arquitetura

```
Internet
   │
   ▼
Cloudflare (CDN + DNS)
   │
   ▼ (Tunnel)
┌─────────────────────────────────────────────┐
│  Servidor Linux                              │
│                                              │
│  ┌─────────────┐     ┌──────────────────┐   │
│  │  cloudflared │────▶│     Nginx :80    │   │
│  │  (tunnel)    │     │  reverse proxy   │   │
│  └─────────────┘     └───────┬──────────┘   │
│                              │               │
│                              ▼               │
│                     ┌──────────────────┐     │
│                     │  Next.js :3000   │     │
│                     │  (app + API)     │     │
│                     └───────┬──────────┘     │
│                             │                │
│                             ▼                │
│                     ┌──────────────────┐     │
│                     │  PostgreSQL :5432│     │
│                     │  (comments, etc) │     │
│                     └──────────────────┘     │
│                                              │
│  Nenhuma porta exposta à internet            │
└─────────────────────────────────────────────┘
```

---

## Pré-requisitos

No servidor Linux:

1. **Docker** e **Docker Compose** instalados
2. **Git** para clonar o repositório
3. Conta no **Cloudflare** com o domínio configurado

---

## Deploy com Docker

### 1. Clonar o repositório

```bash
git clone https://github.com/ByteLair/MetoCast-Web.git
cd MetoCast-Web
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.docker.example .env
nano .env
```

Preencha:

```env
DB_PASSWORD=uma_senha_forte_aqui
SITE_URL=https://seu-dominio.com
CLOUDFLARE_TUNNEL_TOKEN=seu_token_aqui
```

### 3. Subir todos os containers

```bash
docker compose up -d --build
```

Isso inicia:
- **db** — PostgreSQL
- **app** — Next.js (build automático)
- **nginx** — Reverse proxy
- **tunnel** — Cloudflare Tunnel

### 4. Criar as tabelas do banco

Na primeira vez (ou após mudanças no schema):

```bash
docker compose exec app npx prisma db push
```

### 5. Verificar se está tudo rodando

```bash
docker compose ps
docker compose logs -f app
```

---

## Cloudflare Tunnel

### Criar o Tunnel

1. Acesse [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)
2. Vá em **Network → Tunnels**
3. Clique em **Create a tunnel**
4. Escolha **Cloudflared** como conector
5. Dê um nome (ex: `metocast`)
6. Copie o **token** e coloque em `.env`

### Configurar a rota pública

No painel do tunnel, adicione:

| Campo | Valor |
|-------|-------|
| **Public hostname** | `seu-dominio.com` |
| **Service type** | HTTP |
| **URL** | `nginx:80` |

> O tunnel se conecta diretamente ao container Nginx via rede interna Docker. Nenhuma porta é exposta ao servidor.

### DNS

O Cloudflare cria automaticamente um registro CNAME para o domínio apontando para o tunnel. Verifique que o proxy (nuvem laranja) está ativado.

---

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DB_PASSWORD` | Senha do PostgreSQL | `senha_forte_123` |
| `SITE_URL` | URL pública do site | `https://metocast.com.br` |
| `CLOUDFLARE_TUNNEL_TOKEN` | Token do tunnel | `eyJ...` |

---

## Manutenção

### Atualizar o site

```bash
cd MetoCast-Web
git pull origin Stable
docker compose up -d --build
```

### Ver logs

```bash
# Todos os serviços
docker compose logs -f

# Apenas a aplicação
docker compose logs -f app

# Apenas erros do Nginx
docker compose logs -f nginx
```

### Backup do banco de dados

```bash
docker compose exec db pg_dump -U metocast metocast > backup_$(date +%Y%m%d).sql
```

### Restaurar backup

```bash
cat backup_20260308.sql | docker compose exec -T db psql -U metocast metocast
```

### Atualizar schema do banco

Após alterar `prisma/schema.prisma`:

```bash
docker compose exec app npx prisma db push
```

### Reiniciar serviço específico

```bash
docker compose restart app
docker compose restart nginx
```

---

## Desenvolvimento Local

### Sem Docker

```bash
# 1. Instalar dependências
npm install

# 2. Subir um PostgreSQL local (ou usar Docker só para o banco)
docker run -d --name metocast-db \
  -e POSTGRES_USER=metocast \
  -e POSTGRES_PASSWORD=metocast_password \
  -e POSTGRES_DB=metocast \
  -p 5432:5432 \
  postgres:16-alpine

# 3. Configurar variáveis
cp .env.example .env.local

# 4. Criar tabelas
npx prisma db push

# 5. Rodar em desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Com Docker (completo)

```bash
docker compose up -d --build
```

Acesse: [http://localhost:8080](http://localhost:8080)

---

## Troubleshooting

### Site não carrega

1. Verifique os containers: `docker compose ps`
2. Veja os logs: `docker compose logs -f app`
3. Confirme que o tunnel está conectado: `docker compose logs tunnel`

### Erro de banco de dados

1. Verifique se o PostgreSQL está rodando: `docker compose ps db`
2. Teste a conexão: `docker compose exec db psql -U metocast -d metocast -c "SELECT 1"`
3. Se as tabelas não existem: `docker compose exec app npx prisma db push`

### Episódios não aparecem

1. O feed RSS do YouTube pode estar temporariamente indisponível
2. Os episódios são cacheados por 10 minutos — aguarde e recarregue
3. Verifique nos logs: `docker compose logs app | grep RSS`

### Tunnel desconectado

1. Veja os logs: `docker compose logs tunnel`
2. Verifique o token em `.env`
3. Reinicie: `docker compose restart tunnel`

### Como adicionar mais episódios

Não é necessário fazer nada. Basta publicar no YouTube e o site atualiza automaticamente em até 10 minutos.

---

## Estrutura do Projeto

```
MetoCast-Web/
├── prisma/
│   └── schema.prisma          # Schema do banco (Prisma)
├── public/
│   └── images/                # Assets estáticos (logo, etc)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout raiz (navbar + footer)
│   │   ├── page.tsx           # / (landing page)
│   │   ├── not-found.tsx      # 404
│   │   ├── globals.css        # Estilos globais
│   │   ├── episodios/
│   │   │   └── page.tsx       # /episodios (lista paginada)
│   │   ├── episodio/
│   │   │   └── [videoId]/
│   │   │       └── page.tsx   # /episodio/[videoId] (detalhe)
│   │   ├── assistir/
│   │   │   └── page.tsx       # /assistir (players)
│   │   ├── sobre/
│   │   │   └── page.tsx       # /sobre
│   │   ├── comunidade/
│   │   │   └── page.tsx       # /comunidade
│   │   └── api/
│   │       ├── comments/
│   │       │   └── route.ts   # GET/POST comentários
│   │       └── suggestions/
│   │           ├── route.ts   # GET/POST sugestões
│   │           └── [id]/
│   │               └── vote/
│   │                   └── route.ts  # POST voto
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Logo.tsx
│   │   ├── EpisodeCard.tsx
│   │   ├── YouTubePlayer.tsx
│   │   ├── Pagination.tsx
│   │   ├── CommentSection.tsx
│   │   ├── SuggestionForm.tsx
│   │   └── SuggestionList.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Singleton do Prisma Client
│   │   └── youtube.ts         # Parser do RSS feed
│   └── types/
│       └── index.ts           # Tipagens TypeScript
├── nginx/
│   └── nginx.conf             # Configuração Nginx
├── docker-compose.yml
├── Dockerfile
├── .env.docker.example
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

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
2. Acesse `http://localhost:5173/MetôCast-Web/login`
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
- **Produção (subpath)**: `/MetôCast-Web/`
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
  - Frontend: MetôCast-Web
  - Backend: MetôCast

---

**Última atualização**: 1 de Fevereiro de 2026
