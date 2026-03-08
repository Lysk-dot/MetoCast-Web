# Documentação de Deploy — MetôCast v2

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Servidor de Produção](#servidor-de-produção)
4. [CI/CD — GitHub Actions](#cicd--github-actions)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Docker Compose](#docker-compose)
7. [Cloudflare Tunnel](#cloudflare-tunnel)
8. [Manutenção](#manutenção)
9. [Desenvolvimento Local](#desenvolvimento-local)
10. [Troubleshooting](#troubleshooting)

---

## Visão Geral

O MetôCast roda em um servidor Linux auto-hospedado com a seguinte stack:

- **Next.js 14** — Frontend + API (App Router, standalone mode)
- **PostgreSQL 16** — Banco de dados (comentários e sugestões)
- **Nginx** — Reverse proxy com rate limiting e compressão gzip
- **Cloudflare Tunnel** — Exposição segura ao domínio público (systemd)
- **Docker Compose** — Orquestração dos containers (db, app, nginx)
- **GitHub Actions** — CI/CD automático (self-hosted runner)

Episódios são automaticamente buscados do RSS do YouTube (canal `UCnFAxzMvp4ot-uElK_z1qSQ`). Cache de 10 minutos. Zero carga no servidor para vídeos.

---

## Arquitetura

```
Internet
   │
   ▼
Cloudflare (CDN + DNS + SSL)
   │
   ▼ (Tunnel via systemd)
┌──────────────────────────────────────────────┐
│  Servidor: T110ii (Debian 12 Bookworm)       │
│  Usuário: felipe                             │
│                                              │
│  ┌──────────────┐    ┌──────────────────┐    │
│  │  cloudflared  │───▶│   Nginx :80      │    │
│  │  (systemd)    │    │  (Docker)        │    │
│  └──────────────┘    └───────┬──────────┘    │
│                              │               │
│                              ▼               │
│                     ┌──────────────────┐     │
│                     │  Next.js :3000   │     │
│                     │  (Docker)        │     │
│                     └───────┬──────────┘     │
│                             │                │
│                             ▼                │
│                     ┌──────────────────┐     │
│                     │ PostgreSQL :5432  │     │
│                     │  (Docker)        │     │
│                     └──────────────────┘     │
│                                              │
│  GitHub Actions Runner (systemd)             │
│  ~/actions-runner/_work/MetoCast-Web/        │
└──────────────────────────────────────────────┘
```

**Portas expostas:** Apenas porta 80 (Nginx). O Cloudflare Tunnel se conecta a `localhost:80`.

---

## Servidor de Produção

### Informações do Servidor

| Item | Valor |
|------|-------|
| **Hostname** | T110ii |
| **SO** | Debian 12 (Bookworm) |
| **Usuário** | felipe |
| **Docker** | Instalado, felipe no grupo docker |
| **Runner path** | `/home/felipe/actions-runner/` |
| **Workspace** | `/home/felipe/actions-runner/_work/MetoCast-Web/MetoCast-Web/` |
| **Env file** | `/home/felipe/.env.metocast` |
| **Backups** | `/home/felipe/backup_metocast_db_*.sql` |

### Serviços systemd (fora do Docker)

| Serviço | Comando |
|---------|---------|
| **GitHub Runner** | `sudo systemctl status actions.runner.ByteLair.T110ii.service` |
| **Cloudflare Tunnel** | `sudo systemctl status cloudflared` |

### Containers Docker

| Container | Imagem | Porta |
|-----------|--------|-------|
| `metocast-web-db-1` | postgres:16-alpine | 5432 (interna) |
| `metocast-web-app-1` | metocast-web-app (build local) | 3000 (interna) |
| `metocast-web-nginx-1` | nginx:alpine | 80 (exposta) |

---

## CI/CD — GitHub Actions

### Fluxo Automático

1. Push na branch `Stable` → dispara workflow
2. Checkout do código
3. Copia `.env` de `/home/felipe/.env.metocast`
4. `docker compose down --remove-orphans`
5. `docker compose build --no-cache app`
6. `docker compose up -d`
7. Aguarda 15s para serviços estabilizarem
8. `prisma db push` (sincroniza schema do banco)
9. Health check em `localhost:80`

### Arquivo do Workflow

`.github/workflows/deploy.yml` — Trigger: push em `Stable` ou `workflow_dispatch` (manual).

### Runner Self-Hosted

- **Instalado em:** `/home/felipe/actions-runner/`
- **Serviço:** `actions.runner.ByteLair.T110ii.service`
- **Roda como:** usuário `felipe`
- **Auto-start:** Sim (systemd enabled)

Para verificar status:
```bash
sudo systemctl status actions.runner.ByteLair.T110ii.service
```

Para reiniciar:
```bash
sudo systemctl restart actions.runner.ByteLair.T110ii.service
```

---

## Variáveis de Ambiente

### Arquivo: `/home/felipe/.env.metocast`

```env
DB_PASSWORD=metocast_2026
SITE_URL=https://metocast.com
DATABASE_URL=postgresql://metocast:metocast_2026@db:5432/metocast_db
```

> **Nota:** Este arquivo é copiado para `.env` no diretório do projeto pelo workflow de deploy. O docker-compose.yml usa interpolação `${DB_PASSWORD}` e `${SITE_URL}`.

### Como as variáveis são usadas

| Variável | Usado por | Descrição |
|----------|-----------|-----------|
| `DB_PASSWORD` | docker-compose.yml → `POSTGRES_PASSWORD` e `DATABASE_URL` | Senha do PostgreSQL |
| `SITE_URL` | docker-compose.yml → `NEXT_PUBLIC_SITE_URL` | URL pública do site |
| `DATABASE_URL` | Prisma CLI (db push no workflow) | Connection string completa |

### Variáveis injetadas nos containers (via docker-compose.yml)

**Container `db`:**
- `POSTGRES_USER=metocast`
- `POSTGRES_PASSWORD=${DB_PASSWORD}`
- `POSTGRES_DB=metocast_db`

**Container `app`:**
- `DATABASE_URL=postgresql://metocast:${DB_PASSWORD}@db:5432/metocast_db`
- `YOUTUBE_CHANNEL_ID=UCnFAxzMvp4ot-uElK_z1qSQ`
- `NEXT_PUBLIC_SITE_URL=${SITE_URL}`

---

## Docker Compose

### Serviços

**`db`** — PostgreSQL 16 Alpine
- Volume persistente: `pgdata`
- Healthcheck: `pg_isready -U metocast`

**`app`** — Next.js (Dockerfile multi-stage)
- Stage 1 (deps): `npm ci` + Prisma generate
- Stage 2 (builder): `npm run build` (standalone output)
- Stage 3 (runner): Node 20 Alpine + OpenSSL + sharp
- Roda como usuário `nextjs` (não-root)
- Depende de `db` healthy

**`nginx`** — Nginx Alpine
- Config em `nginx/nginx.conf`
- Rate limiting: 10 req/s na API
- Gzip habilitado
- Cache de 1 ano para assets estáticos (`/_next/static/`)
- Porta 80 exposta

### Comandos úteis

```bash
# Ir ao diretório do projeto
cd /home/felipe/actions-runner/_work/MetoCast-Web/MetoCast-Web

# Ver status dos containers
docker compose ps

# Ver logs
docker compose logs app --tail 50
docker compose logs nginx --tail 50
docker compose logs db --tail 50

# Reiniciar um serviço
docker compose restart app

# Rebuild e redeploy manual
docker compose down --remove-orphans
docker compose build --no-cache app
docker compose up -d
```

---

## Cloudflare Tunnel

O tunnel roda como **serviço systemd** (NÃO está no Docker Compose).

### Configuração

| Item | Valor |
|------|-------|
| **Tipo** | Token-based |
| **Serviço** | `cloudflared.service` (systemd) |
| **Destino** | `localhost:80` |
| **Domínio** | `metocast.com` / `www.metocast.com` |

### Comandos

```bash
# Status
sudo systemctl status cloudflared

# Reiniciar
sudo systemctl restart cloudflared

# Logs
sudo journalctl -u cloudflared -f
```

### Rota no Cloudflare Dashboard

| Campo | Valor |
|-------|-------|
| Public hostname | `metocast.com` |
| Service type | HTTP |
| URL | `localhost:80` |

---

## Manutenção

### Deploy (automático)

Basta fazer push na branch `Stable`. O GitHub Actions cuida de tudo.

```bash
git push origin Stable
```

### Backup do banco

```bash
cd /home/felipe/actions-runner/_work/MetoCast-Web/MetoCast-Web
docker compose exec -T db pg_dump -U metocast metocast_db > ~/backup_metocast_db_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar backup

```bash
cd /home/felipe/actions-runner/_work/MetoCast-Web/MetoCast-Web
docker compose exec -T db psql -U metocast metocast_db < ~/backup_metocast_db_XXXXXXXX.sql
```

### Sincronizar schema do banco (manualmente)

```bash
cd /home/felipe/actions-runner/_work/MetoCast-Web/MetoCast-Web
docker compose exec -T app node ./node_modules/prisma/build/index.js db push
```

### Ver uso de disco dos volumes

```bash
docker system df
docker volume ls
```

### Limpar imagens antigas

```bash
docker image prune -f
```

### Atualizar imagens base (postgres, nginx)

```bash
cd /home/felipe/actions-runner/_work/MetoCast-Web/MetoCast-Web
docker compose pull db nginx
docker compose up -d
```

---

## Desenvolvimento Local

### Sem Docker

```bash
# 1. Instalar dependências
npm install

# 2. Subir PostgreSQL local
docker run -d --name metocast-db \
  -e POSTGRES_USER=metocast \
  -e POSTGRES_PASSWORD=metocast_password \
  -e POSTGRES_DB=metocast_db \
  -p 5432:5432 \
  postgres:16-alpine

# 3. Criar .env.local
echo 'DATABASE_URL="postgresql://metocast:metocast_password@localhost:5432/metocast_db"' > .env.local

# 4. Criar tabelas
npx prisma db push

# 5. Rodar em dev
npm run dev
```

Acesse: http://localhost:3000

### Com Docker (stack completa)

```bash
echo 'DB_PASSWORD=metocast_password' > .env
echo 'SITE_URL=http://localhost' >> .env
echo 'DATABASE_URL=postgresql://metocast:metocast_password@db:5432/metocast_db' >> .env
docker compose up -d --build
```

Acesse: http://localhost:80

---

## Troubleshooting

### Site fora do ar (502 Bad Gateway)

1. Verificar containers: `docker compose ps`
2. Se app não está rodando: `docker compose logs app --tail 50`
3. Se nginx não está rodando: `docker compose logs nginx --tail 20`
4. Reiniciar tudo: `docker compose down && docker compose up -d`

### Erro de conexão ao banco (Prisma P1000)

1. Verificar se db está healthy: `docker compose ps`
2. Testar conexão: `docker compose exec db psql -U metocast -d metocast_db -c "SELECT 1"`
3. Se senha errada, resetar volume: `docker compose down && docker volume rm metocast-web_pgdata && docker compose up -d`

### Imagens não otimizadas (erro sharp)

O pacote `sharp` deve estar em `dependencies` no `package.json`. Verificar logs: `docker compose logs app | grep sharp`

### Episódios não aparecem

1. Feed RSS do YouTube pode estar temporariamente indisponível
2. Cache de 10 minutos — aguardar e recarregar
3. Verificar `YOUTUBE_CHANNEL_ID` no docker-compose.yml

### Runner offline

```bash
sudo systemctl status actions.runner.ByteLair.T110ii.service
sudo systemctl restart actions.runner.ByteLair.T110ii.service
```

### Tunnel desconectado

```bash
sudo systemctl status cloudflared
sudo systemctl restart cloudflared
```

---

## Estrutura do Projeto

```
MetoCast-Web/
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD workflow
├── prisma/
│   └── schema.prisma              # Schema do banco (Prisma)
├── public/
│   └── images/                    # Assets estáticos (logo, etc)
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Layout raiz (navbar + footer)
│   │   ├── page.tsx               # / (landing page com episódios)
│   │   ├── not-found.tsx          # 404
│   │   ├── globals.css            # Estilos globais (Tailwind)
│   │   ├── episodios/page.tsx     # /episodios (lista paginada)
│   │   ├── episodio/[videoId]/page.tsx  # /episodio/:id (player + comentários)
│   │   ├── assistir/page.tsx      # /assistir
│   │   ├── sobre/page.tsx         # /sobre
│   │   ├── comunidade/page.tsx    # /comunidade (sugestões + votação)
│   │   └── api/                   # API Routes
│   │       ├── comments/route.ts
│   │       └── suggestions/route.ts
│   ├── components/                # Componentes React (.tsx)
│   ├── lib/
│   │   ├── prisma.ts              # Singleton do Prisma Client
│   │   └── youtube.ts             # Parser do RSS feed do YouTube
│   └── types/index.ts             # Tipagens TypeScript
├── nginx/
│   └── nginx.conf                 # Config do Nginx (rate limit, gzip, proxy)
├── docker-compose.yml             # Orquestração (db + app + nginx)
├── Dockerfile                     # Multi-stage build do Next.js
├── next.config.js                 # Config Next.js (standalone, pageExtensions)
├── tailwind.config.js
├── tsconfig.json
└── package.json
```
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
