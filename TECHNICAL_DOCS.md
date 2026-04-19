# MetôCast Web — Documentação Técnica Completa

> Documento de referência técnica do projeto MetôCast Web. Contém tudo sobre a stack, arquitetura, banco de dados, build, deploy, API, componentes e como cada parte funciona. Use este documento para entender rapidamente o projeto inteiro.

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Estrutura de Arquivos](#3-estrutura-de-arquivos)
4. [Arquitetura da Aplicação](#4-arquitetura-da-aplicação)
5. [Configurações do Projeto](#5-configurações-do-projeto)
6. [Banco de Dados (Prisma + PostgreSQL)](#6-banco-de-dados-prisma--postgresql)
7. [Páginas e Rotas (App Router)](#7-páginas-e-rotas-app-router)
8. [Componentes](#8-componentes)
9. [API Routes](#9-api-routes)
10. [Bibliotecas Internas (lib/)](#10-bibliotecas-internas-lib)
11. [Sistema de Temas (Light/Dark)](#11-sistema-de-temas-lightdark)
12. [Integração YouTube](#12-integração-youtube)
13. [Sistema de Uploads](#13-sistema-de-uploads)
14. [Painel Administrativo](#14-painel-administrativo)
15. [Métricas e Analytics](#15-métricas-e-analytics)
16. [Build e Docker](#16-build-e-docker)
17. [Deploy (CI/CD)](#17-deploy-cicd)
18. [Infraestrutura de Rede (Nginx + Cloudflare)](#18-infraestrutura-de-rede-nginx--cloudflare)
19. [Variáveis de Ambiente](#19-variáveis-de-ambiente)
20. [Testes](#20-testes)
21. [Comandos Úteis](#21-comandos-úteis)
22. [Troubleshooting](#22-troubleshooting)

---

## 1. Visão Geral do Projeto

**MetôCast** é o site oficial do podcast MetôCast, criado por estudantes da Universidade Metodista de São Paulo. O site permite:

- Listar e assistir episódios do YouTube diretamente no site
- Comentar nos episódios
- Sugerir temas para novos episódios (com votação)
- Exibir participações de convidados com fotos e vídeos
- Painel administrativo para gerenciar todo o conteúdo
- Métricas de pageview e watch time
- Player estilo YouTube com playlist lateral (página "Assistir")
- Páginas informativas (Sobre, Comunidade)

**URL de produção:** Acessível via Cloudflare Tunnel (configurado externamente).

**Repo:** GitHub, branch principal de deploy é `Stable`.

---

## 2. Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 14.2.15 | Framework React (App Router, standalone output) |
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.6.3 | Tipagem estática |
| **Tailwind CSS** | 3.4.14 | Estilos utilitários (dark/light mode com CSS vars) |
| **PostgreSQL** | 16 | Banco de dados relacional |
| **Prisma** | 5.22.0 | ORM (schema-first, prisma db push) |
| **Nginx** | Alpine | Reverse proxy, rate limiting, gzip, cache |
| **Docker** | Multi-stage | Containerização (node:20-alpine) |
| **Docker Compose** | 3 serviços | Orquestração (db + app + nginx) |
| **Cloudflare Tunnel** | systemd | Expõe a porta 80 do servidor para a internet |
| **GitHub Actions** | Self-hosted | CI/CD automático no push para `Stable` |
| **lucide-react** | 0.460.0 | Biblioteca de ícones |
| **fast-xml-parser** | 4.5.0 | Parser de XML (RSS do YouTube) |
| **sharp** | 0.33.2 | Otimização de imagens do Next.js |
| **Vitest** | 2.1.0 | Framework de testes |

---

## 3. Estrutura de Arquivos

```
MetoCast-Web/
├── .github/workflows/
│   └── deploy.yml              # CI/CD: GitHub Actions self-hosted runner
├── nginx/
│   └── nginx.conf              # Configuração do Nginx reverse proxy
├── prisma/
│   └── schema.prisma           # Schema do banco (5 models)
├── public/
│   ├── images/
│   │   └── logo-metocast.png   # Logo do podcast
│   └── uploads/                # Uploads de participações (volume Docker)
│       └── participacoes/      # Fotos e vídeos
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Variáveis CSS de tema + estilos globais
│   │   ├── layout.tsx          # Layout raiz (Navbar + Footer + ThemeProvider + MetricsTracker)
│   │   ├── page.tsx            # Home (Hero + EpisodeGrid)
│   │   ├── not-found.tsx       # Página 404
│   │   ├── admin/page.tsx      # Painel administrativo (client component, ~600 linhas)
│   │   ├── assistir/page.tsx   # Player YouTube com playlist lateral
│   │   ├── comunidade/page.tsx # Sugestões de temas + votação
│   │   ├── episodio/[videoId]/page.tsx  # Página de episódio individual
│   │   ├── episodios/page.tsx  # Grid de episódios com paginação
│   │   ├── participacoes/page.tsx       # Lista de convidados do banco de dados
│   │   ├── sobre/page.tsx      # Informações sobre o podcast
│   │   └── api/                # API Routes (Next.js Route Handlers)
│   │       ├── comments/route.ts         # GET/POST comentários públicos
│   │       ├── metrics/route.ts          # POST métricas (pageview/videoview)
│   │       ├── participacoes/route.ts    # GET participações públicas
│   │       ├── suggestions/route.ts      # GET/POST sugestões públicas
│   │       ├── suggestions/[id]/vote/route.ts  # POST voto em sugestão
│   │       └── admin/
│   │           ├── auth/route.ts         # POST validar senha admin
│   │           ├── comments/route.ts     # GET/DELETE comentários (admin)
│   │           ├── metrics/route.ts      # GET métricas completas (admin)
│   │           ├── participacoes/route.ts # GET/POST/PUT/DELETE participações (admin)
│   │           ├── suggestions/route.ts  # GET/DELETE sugestões (admin)
│   │           └── upload/route.ts       # POST upload de arquivos (admin)
│   ├── components/
│   │   ├── AssistirClient.tsx    # Player + playlist sidebar interativa
│   │   ├── CommentSection.tsx    # Formulário + lista de comentários
│   │   ├── EpisodeCard.tsx       # Card de episódio com thumbnail
│   │   ├── Footer.tsx            # Footer com links e redes sociais
│   │   ├── Hero.tsx              # Seção hero da home
│   │   ├── Logo.tsx              # Componente de logo (next/image)
│   │   ├── MetricsTracker.tsx    # Tracker automático de pageviews
│   │   ├── Navbar.tsx            # Navegação responsiva com mobile menu
│   │   ├── Pagination.tsx        # Paginação numérica
│   │   ├── SuggestionForm.tsx    # Formulário de sugestão de tema
│   │   ├── SuggestionList.tsx    # Lista de sugestões com votação
│   │   ├── ThemeProvider.tsx     # Context de tema dark/light
│   │   ├── ThemeToggle.tsx       # Botão de alternar tema
│   │   └── YouTubePlayer.tsx     # Iframe YouTube com metrics tracking
│   ├── lib/
│   │   ├── prisma.ts             # Singleton PrismaClient
│   │   └── youtube.ts            # Fetch + parse do YouTube RSS
│   └── types/
│       └── index.ts              # Interfaces TypeScript (7 types)
├── Dockerfile                    # Build multi-stage (3 stages)
├── docker-compose.yml            # Orquestração de serviços
├── package.json                  # Dependências e scripts
├── next.config.js                # Configuração Next.js
├── tailwind.config.js            # Configuração Tailwind com tema custom
├── tsconfig.json                 # TypeScript config
├── postcss.config.js             # PostCSS (Tailwind + Autoprefixer)
└── DEPLOY.md                     # Documentação de deploy
```

---

## 4. Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────────────────┐
│                       INTERNET                              │
│                  Cloudflare Tunnel (systemd)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ tunneled → localhost:80
┌──────────────────────▼──────────────────────────────────────┐
│  NGINX (container)                                          │
│  - Reverse proxy para Next.js (upstream app:3000)           │
│  - Rate limiting: 10r/s em /api/ (burst 20)                 │
│  - Gzip compression                                         │
│  - Cache: /_next/static (1 ano), /images (30d), /uploads (30d) │
│  - client_max_body_size 100m                                │
│  - Security headers (X-Frame-Options, X-Content-Type-Options) │
└──────────────────────┬──────────────────────────────────────┘
                       │ proxy_pass http://app:3000
┌──────────────────────▼──────────────────────────────────────┐
│  NEXT.JS APP (container, standalone mode)                   │
│  - Server Components (RSC) para páginas                     │
│  - Client Components para interatividade                    │
│  - API Route Handlers para backend                          │
│  - Prisma ORM para acesso ao banco                          │
│  - YouTube RSS fetch + 10min cache                          │
│  - File uploads para public/uploads/ (volume Docker)        │
└──────────────────────┬──────────────────────────────────────┘
                       │ postgresql://db:5432
┌──────────────────────▼──────────────────────────────────────┐
│  POSTGRESQL 16 (container)                                  │
│  - 5 tabelas: comments, suggestions, page_views,           │
│    video_views, participacoes                               │
│  - Volume persistente: pgdata                               │
└─────────────────────────────────────────────────────────────┘
```

**Docker Network:** Todos os containers estão na rede bridge `internal`. O Nginx expõe a porta 80 para o host.

**Volumes Docker:**
- `pgdata` → `/var/lib/postgresql/data` (dados do PostgreSQL)
- `uploads` → `/app/public/uploads` (uploads de fotos/vídeos)

---

## 5. Configurações do Projeto

### next.config.js
```js
{
  output: "standalone",          // Build standalone para Docker
  pageExtensions: ['tsx', 'ts'], // Ignora .jsx — apenas TypeScript
  images: {
    remotePatterns: [             // Permite imagens do YouTube
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'i1.ytimg.com' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',    // Upload de vídeos até 100MB
    },
  },
}
```

### tsconfig.json
- Target: ES2015
- Module: ESNext (bundler resolution)
- Strict mode
- Path alias: `@/*` → `./src/*`
- Inclui: `next-env.d.ts`, todos `*.ts`/`*.tsx`, `.next/types/**/*.ts`

### tailwind.config.js
- `darkMode: 'class'` — Toggle de tema por classe CSS no `<html>`
- Cores customizadas usando CSS variables (ver seção de temas)
- Fontes: `Inter` (body/sans), `Poppins` (headings)
- Animações customizadas: `pulse-slow` (3s), `float` (3s, translateY)
- Cores de marca: `brand-spotify` (#1DB954), `brand-youtube` (#FF0000), `brand-instagram` (#E4405F)

### postcss.config.js
- Plugins: `tailwindcss`, `autoprefixer`

---

## 6. Banco de Dados (Prisma + PostgreSQL)

### Conexão
- **URL:** `postgresql://metocast:{DB_PASSWORD}@db:5432/metocast_db`
- **Singleton:** `src/lib/prisma.ts` — PrismaClient com cache no `globalThis` para dev hot-reload

### Schema (prisma/schema.prisma)

**5 modelos:**

#### Comment
| Campo | Tipo | Detalhes |
|---|---|---|
| id | Int | PK, autoincrement |
| videoId | String | YouTube video ID (indexed) |
| author | String | VarChar(100) |
| message | String | VarChar(2000) |
| createdAt | DateTime | default(now()) |

Tabela: `comments`

#### Suggestion
| Campo | Tipo | Detalhes |
|---|---|---|
| id | Int | PK, autoincrement |
| author | String | VarChar(100) |
| title | String | VarChar(200) |
| description | String | VarChar(2000) |
| votes | Int | default(0) |
| createdAt | DateTime | default(now()) |

Tabela: `suggestions`

#### PageView
| Campo | Tipo | Detalhes |
|---|---|---|
| id | Int | PK, autoincrement |
| path | String | VarChar(500), indexed |
| sessionId | String | VarChar(100) |
| createdAt | DateTime | default(now()), indexed |

Tabela: `page_views`

#### VideoView
| Campo | Tipo | Detalhes |
|---|---|---|
| id | Int | PK, autoincrement |
| videoId | String | VarChar(20), indexed |
| sessionId | String | VarChar(100) |
| watchSeconds | Int | default(0) |
| createdAt | DateTime | default(now()), indexed |

Tabela: `video_views`

#### Participacao
| Campo | Tipo | Detalhes |
|---|---|---|
| id | Int | PK, autoincrement |
| nome | String | VarChar(200) |
| cargo | String | VarChar(300) |
| episodio | String | VarChar(300) |
| videoId | String? | VarChar(20), opcional — ID do YouTube |
| data | String | VarChar(10) — formato "YYYY-MM-DD" |
| fotoUrl | String? | VarChar(1000), opcional |
| videoUrl | String? | VarChar(1000), opcional |
| createdAt | DateTime | default(now()), indexed |

Tabela: `participacoes`

### Migração
O projeto usa `prisma db push` (não migrations). O deploy executa automaticamente:
```bash
docker compose exec -T app node ./node_modules/prisma/build/index.js db push
```

---

## 7. Páginas e Rotas (App Router)

Todas as páginas usam o App Router do Next.js 14. Server Components são o padrão; Client Components usam `"use client"`.

### Layout Raiz — `src/app/layout.tsx`
- Metadados: título "MetôCast", descrição do podcast
- Google Fonts: Inter + Poppins
- Envolve com `ThemeProvider` (context de dark/light)
- Renderiza: `Navbar` (topo fixo) + `main` (padding-top 64px) + `Footer`
- Inclui `MetricsTracker` (componente invisível que rastreia pageviews)

### Home — `src/app/page.tsx` (/)
- **Server Component** com `revalidate = 600` (10 min ISR)
- Renderiza `Hero` + grid dos 6 episódios mais recentes via `getEpisodes()`
- Cada episódio renderizado como `EpisodeCard`
- Link "Ver todos os episódios" para `/episodios`

### Episódios — `src/app/episodios/page.tsx` (/episodios)
- **Server Component** com `revalidate = 600`
- Paginação: 6 episódios por página via `getEpisodesPaginated(page, 6)`
- URL: `/episodios?page=2`
- Renderiza grid de `EpisodeCard` + componente `Pagination`

### Episódio Individual — `src/app/episodio/[videoId]/page.tsx` (/episodio/[videoId])
- **Server Component** com `revalidate = 600`
- Busca episódio por `getEpisodeById(videoId)`
- Renderiza `YouTubePlayer` + info do episódio + `CommentSection` (client)
- Gera metadados dinâmicos (título + description + og:image)
- `notFound()` se o episódio não existir

### Assistir — `src/app/assistir/page.tsx` (/assistir)
- **Server Component** que busca todos os episódios via `getEpisodes()`
- Delega para `AssistirClient` (client component interativo)
- Layout estilo YouTube: player grande à esquerda + playlist sidebar à direita
- Troca de episódio via `useState(selectedIndex)` sem reload de página

### Participações — `src/app/participacoes/page.tsx` (/participacoes)
- **Server Component** que busca do banco via `prisma.participacao.findMany()`
- Exibe cards de estatísticas (total de convidados, episódios únicos, UMesp)
- Lista de participações com: foto/avatar, nome, cargo, data, episódio
- Se tem `videoId`, exibe embed do YouTube
- Link para `/episodio/{videoId}` se disponível

### Sobre — `src/app/sobre/page.tsx` (/sobre)
- Página estática com informações sobre o podcast, missão, valores
- Seção de equipe com cards dos membros (dados hardcoded)
- Disponível em plataformas: Spotify, YouTube, Apple Podcasts

### Comunidade — `src/app/comunidade/page.tsx` (/comunidade)
- Renderiza `SuggestionList` (client component)
- Formulário para sugerir temas + lista de sugestões com votação
- Links para redes sociais

### Admin — `src/app/admin/page.tsx` (/admin)
- **Client Component** (~600 linhas)
- Autenticação por senha (ver seção do painel admin)
- 4 abas: Comentários, Sugestões, Participações, Métricas

### 404 — `src/app/not-found.tsx`
- Página customizada com link para voltar à home

---

## 8. Componentes

### Navbar (`src/components/Navbar.tsx`) — Client
- Fixa no topo (`fixed top-0`, z-50, backdrop-blur)
- Logo + nome "MetôCast" à esquerda
- Links: Início, Episódios, Assistir, Participações, Sobre, Comunidade
- `ThemeToggle` à direita
- Menu mobile (hamburger) com estado `menuOpen`

### Footer (`src/components/Footer.tsx`) — Server
- 3 colunas: Brand + descrição, Navegação (links do site), Redes Sociais (Instagram, Spotify, YouTube)
- Link oculto para `/admin` (ícone Settings com opacidade 30%)
- Copyright dinâmico com ano atual

### Hero (`src/components/Hero.tsx`) — Server
- Gradiente de fundo responsive ao tema
- Logo flutuante com animação `float`
- Botões CTA: Spotify, YouTube, Instagram, Ver Episódios
- Wave SVG na parte inferior

### Logo (`src/components/Logo.tsx`) — Server
- Wrapper de `next/image` para `/images/logo-metocast.png`
- Props: `size` (default 40), `className`
- Background azul (#1B4B8A) com `rounded-xl`

### EpisodeCard (`src/components/EpisodeCard.tsx`) — Server
- Thumbnail com hover play overlay
- Data formatada em pt-BR
- Descrição truncada (120 chars)
- Link para `/episodio/{videoId}`

### YouTubePlayer (`src/components/YouTubePlayer.tsx`) — Client
- Iframe do YouTube com `allow` para autoplay, gyroscope, picture-in-picture
- **Tracking de watch time:** IntersectionObserver verifica visibilidade do iframe; acumula segundos assistidos e envia para `/api/metrics` ao sair da page (cleanup do useEffect)
- `loading="lazy"`
- `encodeURIComponent(videoId)` para segurança

### AssistirClient (`src/components/AssistirClient.tsx`) — Client
- Estado: `selectedIndex` (episódio ativo na playlist)
- Layout flex: player (flex-1) + sidebar (380px no lg)
- Sidebar: header com ícone + contagem de eps + lista scrollável
- Cada item da playlist: thumbnail (112px) + título + data
- Item ativo: `bg-primary-yellow/10`, `border-l-2 border-l-primary-yellow`
- Click troca o episódio sem reload

### CommentSection (`src/components/CommentSection.tsx`) — Client
- Props: `videoId`
- Fetch GET `/api/comments?videoId={videoId}` ao montar
- Formulário: nome (max 100) + mensagem (max 2000)
- POST `/api/comments` → atualiza lista
- Lista de comentários com avatar genérico, nome, data, mensagem

### SuggestionForm (`src/components/SuggestionForm.tsx`) — Client
- Formulário: nome (max 100) + título (max 200) + descrição (max 2000)
- POST `/api/suggestions`
- Callback `onSubmitted()` para atualizar lista no parent

### SuggestionList (`src/components/SuggestionList.tsx`) — Client
- Fetch GET `/api/suggestions` ao montar
- Renderiza `SuggestionForm` + lista de sugestões
- Votação: POST `/api/suggestions/{id}/vote`
- `votedIds` persistido no localStorage (impede voto duplicado no browser)

### Pagination (`src/components/Pagination.tsx`) — Server
- Props: `currentPage`, `totalPages`, `basePath`
- Gera links para cada página numérica
- Anterior/Próxima com ícones ChevronLeft/Right
- Página ativa: `bg-primary-yellow text-gray-900`

### ThemeProvider (`src/components/ThemeProvider.tsx`) — Client
- React Context com `theme` ("light" | "dark") e `toggle()`
- Detecta preferência do sistema via `prefers-color-scheme`
- Persiste em `localStorage("metocast-theme")`
- Toggle: adiciona/remove classe `dark` no `<html>`

### ThemeToggle (`src/components/ThemeToggle.tsx`) — Client
- Botão Sun/Moon que chama `toggle()` do ThemeProvider context

### MetricsTracker (`src/components/MetricsTracker.tsx`) — Client
- Componente invisível (retorna `null`)
- Usa `usePathname()` para detectar navegação
- Gera `sessionId` via `crypto.randomUUID()` (sessionStorage)
- POST `/api/metrics` com `{ type: "pageview", path, sessionId }`
- `useRef` previne tracking duplicado da mesma rota
- Exporta `trackVideoView(videoId, watchSeconds)` — usado pelo YouTubePlayer

---

## 9. API Routes

### Autenticação Admin
Todas as rotas `/api/admin/*` usam autenticação por header:
```
x-admin-password: <valor de ADMIN_PASSWORD>
```
Função `checkAuth()` compara o header com `process.env.ADMIN_PASSWORD`. Retorna 401 se inválido.

### Rotas Públicas

#### GET `/api/comments?videoId={id}`
- Retorna últimos 100 comentários do vídeo, ordenados por `createdAt desc`
- Validação: `videoId` deve ter formato `[a-zA-Z0-9_-]{11}`

#### POST `/api/comments`
- Body: `{ videoId, author, message }`
- Validações: videoId (11 chars regex), author (1-100 chars), message (1-2000 chars)
- Retorna 201 com o comentário criado

#### GET `/api/suggestions`
- Retorna top 50 sugestões ordenadas por `votes desc`

#### POST `/api/suggestions`
- Body: `{ author, title, description }`
- Validações: author (1-100), title (1-200), description (1-2000)
- Retorna 201

#### POST `/api/suggestions/[id]/vote`
- Incrementa `votes` em 1 para a sugestão com o `id`
- Retorna a sugestão atualizada
- 404 se não encontrada

#### POST `/api/metrics`
- Body type `"pageview"`: `{ type, path, sessionId }` → cria PageView
- Body type `"videoview"`: `{ type, videoId, sessionId, watchSeconds }` → cria VideoView
- `watchSeconds` é limitado a 0–86400 (24h max)

#### GET `/api/participacoes`
- Retorna últimas 100 participações, `createdAt desc`

### Rotas Admin (requerem `x-admin-password` header)

#### POST `/api/admin/auth`
- Body: `{ password }` — valida contra `ADMIN_PASSWORD` env
- Retorna `{ ok: true }` ou 401

#### GET `/api/admin/comments`
- Lista últimos 200 comentários

#### DELETE `/api/admin/comments?id={id}`
- Exclui comentário por ID

#### GET `/api/admin/suggestions`
- Lista últimas 200 sugestões

#### DELETE `/api/admin/suggestions?id={id}`
- Exclui sugestão por ID

#### GET `/api/admin/participacoes`
- Lista últimas 200 participações

#### POST `/api/admin/participacoes`
- Body: `{ nome, cargo, episodio, videoId?, data, fotoUrl?, videoUrl? }`
- Validações: nome (max 200), cargo (max 300), episodio (max 300), data (YYYY-MM-DD regex), videoId (11 chars regex se presente), fotoUrl/videoUrl (max 1000)
- Retorna 201

#### PUT `/api/admin/participacoes`
- Body: `{ id, nome, cargo, episodio, videoId?, data, fotoUrl?, videoUrl? }`
- Mesmas validações do POST + id obrigatório

#### DELETE `/api/admin/participacoes?id={id}`
- Exclui participação por ID

#### POST `/api/admin/upload`
- **Multipart FormData** com campo `file`
- Tipos permitidos: JPEG, PNG, WebP, GIF (imagem, max 10MB) + MP4, WebM (vídeo, max 100MB)
- Nome do arquivo: `crypto.randomBytes(16).toString("hex")` + extensão sanitizada
- Salva em: `public/uploads/participacoes/{random_name}.{ext}`
- Retorna: `{ url: "/uploads/participacoes/{filename}", type: "image"|"video" }`

#### GET `/api/admin/metrics`
- Retorna resumo completo:
  - `totalPageViews` (count)
  - `uniqueSessions` (groupBy sessionId)
  - `topPages` (top 10 paths com name resolution)
  - `totalVideoViews` (count)
  - `totalWatchMinutes` (sum watchSeconds / 60)
  - `topVideos` (top 10 por views, com título resolvido via YouTube RSS)

---

## 10. Bibliotecas Internas (lib/)

### prisma.ts
```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```
Padrão singleton para evitar múltiplas instâncias durante dev hot-reload.

### youtube.ts
- **Channel ID:** `UCnFAxzMvp4ot-uElK_z1qSQ` (ou env `YOUTUBE_CHANNEL_ID`)
- **RSS URL:** `https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}`
- **Cache:** Memória com TTL de 10 minutos
- **Parser:** `fast-xml-parser` com `ignoreAttributes: false`
- **Funções exportadas:**
  - `getEpisodes(): Promise<Episode[]>` — todos os episódios do feed
  - `getEpisodeById(videoId): Promise<Episode | null>` — busca por ID
  - `getEpisodesPaginated(page, perPage=6): Promise<{episodes, totalPages, currentPage}>` — paginado
- **Episode interface:** `{ videoId, title, description, publishedAt, thumbnail }`
- **Thumbnail:** `https://i.ytimg.com/vi/{videoId}/hqdefault.jpg`
- **Fallback:** Se o fetch falhar e houver cache expirado, retorna os dados do cache

---

## 11. Sistema de Temas (Light/Dark)

### Funcionamento
1. `ThemeProvider` detecta preferência do sistema ou valor salvo em `localStorage("metocast-theme")`
2. Aplica/remove classe `dark` no `<html>`
3. Tailwind `darkMode: 'class'` ativa estilos condicionais
4. Cores são mapeadas via CSS variables em `globals.css`

### Variáveis CSS (globals.css)

**Light mode (:root):**
| Variável | Valor RGB | Descrição |
|---|---|---|
| --surface-darkest | 245 241 235 | Fundo principal (cream) |
| --surface | 237 232 224 | Fundo secundário |
| --surface-card | 255 255 255 | Cards (branco) |
| --surface-hover | 228 222 212 | Hover de superfície |
| --surface-border | 212 205 194 | Bordas |
| --foreground | 28 25 23 | Texto principal (quase preto) |
| --foreground-secondary | 58 54 50 | Texto secundário |
| --foreground-muted | 105 98 92 | Texto apagado |
| --foreground-faint | 150 143 136 | Texto muito leve |

**Dark mode (.dark):**
| Variável | Valor RGB | Descrição |
|---|---|---|
| --surface-darkest | 13 13 15 | Fundo principal (quase preto) |
| --surface | 26 26 31 | Fundo secundário |
| --surface-card | 30 30 36 | Cards |
| --surface-hover | 42 42 50 | Hover |
| --surface-border | 42 42 50 | Bordas |
| --foreground | 245 245 245 | Texto principal (quase branco) |
| --foreground-secondary | 209 213 219 | Texto secundário |
| --foreground-muted | 156 163 175 | Texto apagado |
| --foreground-faint | 107 114 128 | Texto muito leve |

### Uso nos componentes
```tsx
className="bg-surface-card text-foreground border-surface-border"
className="text-foreground-muted hover:text-primary-yellow"
```

### Cores fixas (não variam com tema)
- `primary-yellow`: #FFC107 (cor principal do podcast)
- `primary-blue`: #1E88E5 (cor secundária)
- `accent-purple`: #6C5CE7, `accent-teal`: #00CEC9

Light mode tem box-shadow sutil em cards; dark mode não.

---

## 12. Integração YouTube

### Fluxo de dados
1. **Server Components** chamam `getEpisodes()` / `getEpisodeById()` / `getEpisodesPaginated()`
2. A função faz fetch do RSS feed do YouTube: `https://www.youtube.com/feeds/videos.xml?channel_id=UCnFAxzMvp4ot-uElK_z1qSQ`
3. XML é parseado com `fast-xml-parser`, extraindo: videoId, title, description (`media:description`), publishedAt
4. Thumbnails são construídos: `https://i.ytimg.com/vi/{videoId}/hqdefault.jpg`
5. Resultado é cacheado em memória por 10 minutos
6. Imagens remotas do YouTube são permitidas no `next.config.js` (`i.ytimg.com`, `i1.ytimg.com`)

### Player YouTube
O `YouTubePlayer` renderiza um iframe com:
```
src="https://www.youtube.com/embed/{videoId}"
```
- O `videoId` é sanitizado com `encodeURIComponent()`
- IntersectionObserver estima tempo de visualização (assume que se o iframe está visível, o vídeo está sendo assistido)
- Ao sair da página, envia `trackVideoView(videoId, totalSeconds)` para `/api/metrics`

### Limitações
- O RSS feed do YouTube retorna apenas os ~15 vídeos mais recentes do canal
- Não há API Key do YouTube — apenas RSS público
- O cache é em memória (perde ao reiniciar o container)

---

## 13. Sistema de Uploads

### Fluxo
1. Admin abre a aba "Participações" no painel
2. Formulário com campos de file input (foto ou vídeo)
3. `handleUpload()` cria `FormData`, envia POST para `/api/admin/upload` com header `x-admin-password`
4. API valida tipo MIME, tamanho, gera nome aleatório seguro
5. Salva em `public/uploads/participacoes/{hash}.{ext}`
6. Retorna URL relativa: `/uploads/participacoes/{hash}.{ext}`
7. URL é salva no campo `fotoUrl` ou `videoUrl` da participação

### Segurança
- Filenames são `crypto.randomBytes(16).toString("hex")` — previne path traversal
- Extensão é sanitizada: apenas `[a-z0-9]`, max 5 chars
- Tipos permitidos: JPEG, PNG, WebP, GIF (10MB) + MP4, WebM (100MB)
- Header de autenticação obrigatório

### Volume Docker
- O diretório `public/uploads/` é montado como volume Docker (`uploads`)
- Isso garante que uploads persistam entre rebuilds/redeploys
- O Dockerfile cria o diretório com ownership `nextjs:nodejs`
- O Nginx serve `/uploads/` diretamente do volume com `alias /app/public/uploads/`, aplicando cache de 30 dias para esses arquivos estáticos

---

## 14. Painel Administrativo

### Acesso
- URL: `/admin` (link oculto no footer, ícone Settings com 30% opacidade)
- Autenticação: senha simples via `ADMIN_PASSWORD` env var
- Senha é armazenada em `sessionStorage` (persiste na aba, perde ao fechar)
- Requests autenticados enviam header `x-admin-password`

### Login Flow
1. Formulário com campo de senha
2. POST `/api/admin/auth` com `{ password }`
3. Se 200 → salva senha em `sessionStorage("metocast-admin-pw")`
4. Se 401 → mostra erro

### Abas

**Comentários:**
- Lista todos os comentários do banco (GET `/api/admin/comments`)
- Exibe: autor, videoId, data, mensagem
- Botão de excluir (DELETE `/api/admin/comments?id={id}`)

**Sugestões:**
- Lista todas as sugestões (GET `/api/admin/suggestions`)
- Exibe: título, autor, data, descrição, votos
- Botão de excluir (DELETE `/api/admin/suggestions?id={id}`)

**Participações:**
- CRUD completo
- Botão "Nova participação" abre formulário inline
- Campos: nome*, cargo*, episódio*, data*, videoId (opcional), foto (upload/URL), vídeo (upload/URL)
- Upload direto de arquivo (POST `/api/admin/upload`) ou colar URL
- Preview da foto no formulário
- Lista com foto/avatar, nome, cargo, data, episódio
- Botões de editar (abre formulário preenchido) e excluir

**Métricas:**
- GET `/api/admin/metrics`
- 4 StatCards: Page Views, Sessões Únicas, Vídeos Assistidos, Minutos Assistidos
- Tabela: Páginas Mais Acessadas (path + nome + count)
- Tabela: Vídeos Mais Assistidos (título + views + minutos)

---

## 15. Métricas e Analytics

### Coleta automática
- `MetricsTracker` (no layout raiz) envia pageview a cada navegação
- `YouTubePlayer` estima watch time via IntersectionObserver e envia ao desmontar
- Dados enviados para POST `/api/metrics`

### Session ID
- Gerado via `crypto.randomUUID()` e salvo em `sessionStorage`
- Permite contar sessões únicas sem login/cookies

### Dados coletados
- **PageView:** path + sessionId + timestamp
- **VideoView:** videoId + sessionId + watchSeconds + timestamp

### Visualização (admin)
- Total de pageviews e sessões únicas
- Top 10 páginas mais acessadas com nome amigável
- Total de vídeos assistidos e minutos acumulados
- Top 10 vídeos por views com título (resolvido via RSS)

---

## 16. Build e Docker

### Dockerfile (Multi-stage, 3 etapas)

**Stage 1 — deps:**
```dockerfile
FROM node:20-alpine
COPY package.json package-lock.json* prisma/ ./
RUN npm ci || npm install
```

**Stage 2 — builder:**
```dockerfile
FROM node:20-alpine
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build     # next build (standalone output)
```

**Stage 3 — runner:**
```dockerfile
FROM node:20-alpine
ENV NODE_ENV=production
RUN apk add --no-cache openssl   # Para Prisma engine
RUN addgroup/adduser nextjs      # Usuário non-root (UID 1001)
COPY public/                     # Assets estáticos
RUN mkdir -p ./public/uploads/participacoes && chown nextjs:nodejs
COPY .next/standalone ./         # Servidor standalone
COPY .next/static ./             # Assets estáticos do Next.js
COPY prisma/ + node_modules/.prisma + @prisma + prisma CLI
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose (3 serviços)

| Serviço | Imagem | Porta | Volumes | Depende de |
|---|---|---|---|---|
| db | postgres:16-alpine | (interna) | pgdata | — |
| app | Build local (Dockerfile) | (interna) | uploads | db (healthy) |
| nginx | nginx:alpine | 80:80 | nginx.conf (ro) | app |

**Health check do db:**
```yaml
test: ["CMD-SHELL", "pg_isready -U metocast"]
interval: 10s, timeout: 5s, retries: 5
```

**Volumes:**
- `pgdata` — dados do PostgreSQL (persistente)
- `uploads` — uploads de participações (persistente)

---

## 17. Deploy (CI/CD)

### Pipeline (`.github/workflows/deploy.yml`)

**Trigger:** Push na branch `Stable` ou dispatch manual.

**Runner:** `self-hosted` (servidor Debian 12, usuário `felipe`).

**Passos:**
1. **Checkout** — clona branch `Stable`
2. **Setup env** — copia `/home/felipe/.env.metocast` para `.env`
3. **Cleanup** — `docker system prune -af` + `docker builder prune -af`
4. **Deploy** — `docker compose down` → `build --no-cache app` → `up -d`
5. **Wait** — `sleep 15` (aguarda containers subirem)
6. **Migrations** — `docker compose exec -T app node ./node_modules/prisma/build/index.js db push`
7. **Health check** — `curl -f http://localhost:80`

### Servidor de produção
- **OS:** Debian 12
- **Hardware:** Dell T110ii
- **Usuário:** `felipe`
- **Env file:** `/home/felipe/.env.metocast`
- **Cloudflare Tunnel:** Rodando como serviço systemd (fora do Docker), mapeia `metocast.example.com` → `localhost:80`

### Para fazer deploy
1. Faça commit na branch `Stable`
2. Push para o GitHub
3. O GitHub Actions runner no servidor detecta e executa automaticamente
4. Ou: menu Actions → "Deploy Frontend to Server" → "Run workflow"

---

## 18. Infraestrutura de Rede (Nginx + Cloudflare)

### Nginx (`nginx/nginx.conf`)

**Upstream:** `app:3000` (container Next.js)

**Configurações principais:**
- `worker_processes auto`
- `keepalive_timeout 65`
- `client_max_body_size 100m` (uploads)
- Gzip: nível 6, tipos text/css/json/js/xml/svg

**Security headers:**
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

**Rate limiting:**
- Zone `api`: 10 requests/segundo por IP
- Burst: 20 (nodelay)
- Aplicado apenas em `/api/`

**Locations:**
| Path | Cache | Notas |
|---|---|---|
| `/_next/static/` | 1 ano, immutable | Assets buildados do Next.js |
| `/images/` | 30 dias | Imagens públicas |
| `/uploads/` | 30 dias | Uploads de participações |
| `/api/` | — | Rate limited, proxy headers |
| `/` (catch-all) | — | Pages, WebSocket upgrade support |

### Cloudflare Tunnel
- Roda como **serviço systemd** no host (NÃO em container Docker)
- Mapeia domínio público → `localhost:80` (Nginx)
- Configurado fora do escopo deste repositório

---

## 19. Variáveis de Ambiente

Arquivo `.env` na raiz (copiado de `/home/felipe/.env.metocast` no deploy):

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DB_PASSWORD` | Sim | Senha do PostgreSQL (default: `metocast_password`) |
| `DATABASE_URL` | Auto | Montada pelo docker-compose: `postgresql://metocast:{DB_PASSWORD}@db:5432/metocast_db` |
| `YOUTUBE_CHANNEL_ID` | Não | Default: `UCnFAxzMvp4ot-uElK_z1qSQ` |
| `NEXT_PUBLIC_SITE_URL` | Não | URL pública do site (default: `https://metocast.example.com`) |
| `ADMIN_PASSWORD` | Sim | Senha do painel admin. Sem default — **deve ser definida** |
| `NODE_ENV` | Auto | `production` no Dockerfile |

---

## 20. Testes

### Framework
- **Vitest** 2.1.0 com jsdom
- Config em `vitest.config.ts`
- Plugin `@vitejs/plugin-react`
- Path alias: `@/` → `./src/`

### Arquivos de teste
Localizados em `src/__tests__/api/`:
- `admin-auth.test.ts`
- `comments.test.ts`
- `metrics.test.ts`
- `suggestions.test.ts`

### Executar
```bash
npm test          # vitest run (single run)
npm run test:watch  # vitest (watch mode)
```

---

## 21. Comandos Úteis

### Desenvolvimento local
```bash
npm install              # Instala deps + prisma generate (postinstall)
npm run dev              # Next.js dev server (port 3000)
npm run build            # Build de produção
npm run lint             # ESLint
```

### Banco de dados
```bash
npm run db:generate      # prisma generate (gera client)
npm run db:push          # prisma db push (sync schema → DB)
npm run db:migrate       # prisma migrate dev (migrations)
npm run db:studio        # Prisma Studio (GUI web)
```

### Docker (produção)
```bash
docker compose up -d                    # Sobe todos os serviços
docker compose down                     # Para todos os serviços
docker compose build --no-cache app     # Rebuild do app
docker compose logs -f app              # Logs do app
docker compose logs -f db               # Logs do banco
docker compose exec -T app node ./node_modules/prisma/build/index.js db push  # Migration
docker compose exec db psql -U metocast -d metocast_db                        # SQL direto
```

### Deploy manual
```bash
docker compose down --remove-orphans
docker system prune -af
docker compose build --no-cache app
docker compose up -d
sleep 15
docker compose exec -T app node ./node_modules/prisma/build/index.js db push
curl -f http://localhost:80
```

---

## 22. Troubleshooting

### App não inicia
```bash
docker compose logs app            # Ver erro específico
docker compose exec db pg_isready -U metocast  # Verificar se DB está up
```

### Erro de database/Prisma
```bash
# Re-rodar migration
docker compose exec -T app node ./node_modules/prisma/build/index.js db push
# Conectar direto no banco
docker compose exec db psql -U metocast -d metocast_db
```

### Upload não funciona
- Verificar se volume `uploads` está montado: `docker compose exec app ls -la /app/public/uploads/`
- Verificar se `ADMIN_PASSWORD` está definido
- Verificar `client_max_body_size` no nginx (deve ser 100m)

### Episódios não carregam
- RSS do YouTube pode estar indisponível — cache em memória perde ao reiniciar container
- Verificar `YOUTUBE_CHANNEL_ID` no env
- Testar manualmente: `curl https://www.youtube.com/feeds/videos.xml?channel_id=UCnFAxzMvp4ot-uElK_z1qSQ`

### Build falha
- Verificar se `prisma/schema.prisma` está correto
- `npm ci` pode falhar se `package-lock.json` estiver desatualizado → rodar `npm install` localmente e commitar o lock

### Tema não muda
- Verificar se `ThemeProvider` envolve a aplicação no `layout.tsx`
- Verificar se `darkMode: 'class'` está no `tailwind.config.js`
- Limpar `localStorage("metocast-theme")`

---

## Tipos TypeScript (`src/types/index.ts`)

```typescript
interface Episode {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
}

interface Comment {
  id: number;
  videoId: string;
  author: string;
  message: string;
  createdAt: string;
}

interface Suggestion {
  id: number;
  author: string;
  title: string;
  description: string;
  votes: number;
  createdAt: string;
}

interface PageView {
  id: number;
  path: string;
  sessionId: string;
  createdAt: string;
}

interface VideoView {
  id: number;
  videoId: string;
  sessionId: string;
  watchSeconds: number;
  createdAt: string;
}

interface MetricsSummary {
  totalPageViews: number;
  uniqueSessions: number;
  topPages: { path: string; name: string; count: number }[];
  totalVideoViews: number;
  totalWatchMinutes: number;
  topVideos: { videoId: string; title: string; views: number; minutes: number }[];
}

interface Participacao {
  id: number;
  nome: string;
  cargo: string;
  episodio: string;
  videoId: string | null;
  data: string;
  fotoUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
}
```

---

> **Última atualização:** Março 2026
