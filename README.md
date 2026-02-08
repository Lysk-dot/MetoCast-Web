# 🎙️ MetôCast Web

Site oficial do **MetôCast** - Podcast dos estudantes da Universidade Metodista.

## 📋 Sobre o Projeto

O MetôCast Web é a plataforma web do podcast MetôCast, desenvolvida para divulgar episódios, conectar com a comunidade e gerenciar conteúdo através de um painel administrativo.

### ✨ Funcionalidades

**Página Pública:**
- 🏠 Landing page com apresentação do podcast
- 🎧 Listagem de episódios com thumbnails do Spotify
- 🔗 Links para Spotify, YouTube e Instagram
- 👥 Seção sobre a equipe
- 📱 Design responsivo (mobile-first)

**Painel Administrativo:**
- 🔐 Autenticação JWT
- 📝 CRUD de episódios (criar, editar, excluir, publicar)
- 🔗 Gerenciamento de links oficiais
- 🖼️ Suporte a imagens de capa dos episódios

## 🛠️ Tecnologias

- **Frontend:** React 18 + Vite
- **Estilização:** Tailwind CSS v4 + Inline Styles
- **Roteamento:** React Router DOM v6
- **HTTP Client:** Axios
- **Ícones:** Lucide React
- **Notificações:** React Hot Toast
- **Backend:** FastAPI + PostgreSQL (container Docker separado)


## 🚀 Instalação

## 🔧 Configuração de Ambiente

### Desenvolvimento Local

1. **Copie o arquivo de exemplo:**
```bash
cp .env.example .env
```

2. **Edite o `.env` se necessário:**
```env
VITE_API_URL=http://localhost:8000/api
```

3. **Inicie o servidor:**
```bash
npm run dev
```

### Produção

Para deploy em produção, configure as variáveis de ambiente:

**GitHub Pages:**
- Não precisa configurar (usa base URL relativa)

**CloudFlare / Domínio Próprio:**
- Configure `VITE_API_URL` para apontar para sua API

**Exemplo `.env.production`:**
```env
VITE_API_URL=https://api.metocast.seudominio.com/api
```

**Build para produção:**
```bash
npm run build
```

Os arquivos estarão em `dist/` prontos para deploy.

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (para o backend)

### Configuração

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/MetoCast-Web.git
cd MetôCast-Web
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acesse:** http://localhost:5173

### Backend

O frontend se conecta ao backend MetôCast que roda em Docker:

```bash
cd ../MetôCast
docker compose up -d
```

API disponível em: http://localhost:8000

## 🏠 Instalação On-Premise

Para instalar o MetôCast em ambiente on-premise (servidor próprio), siga o guia completo:

📖 **[Guia de Instalação On-Premise](SETUP_ON_PREMISE.md)**

### Quick Start On-Premise

1. Configure o arquivo `.env`:
```bash
cp .env.example .env
nano .env
```

2. Ajuste a URL da API:
```env
VITE_API_URL=http://seu-servidor:8000/api
VITE_ENV=production
```

3. Execute o script de deploy:
```bash
./deploy.sh
```

4. Configure o Nginx:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/metocast
sudo ln -s /etc/nginx/sites-available/metocast /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Arquivos de referência:**
- `SETUP_ON_PREMISE.md` - Guia completo de instalação
- `.env.example` - Exemplo de variáveis de ambiente
- `nginx.conf.example` - Configuração Nginx pronta
- `deploy.sh` - Script automatizado de build

## 📁 Estrutura do Projeto

```
MetôCast-Web/
├── public/
│   └── images/
│       └── logo-metocast.png    # Logo do podcast
├── src/
│   ├── components/
│   │   ├── About.jsx            # Seção "Sobre"
│   │   ├── EpisodeCard.jsx      # Card de episódio
│   │   ├── EpisodeGrid.jsx      # Grid de episódios
│   │   ├── Footer.jsx           # Rodapé
│   │   ├── Hero.jsx             # Seção principal
│   │   ├── Navbar.jsx           # Barra de navegação
│   │   └── Team.jsx             # Seção da equipe
│   ├── context/
│   │   └── AuthContext.jsx      # Contexto de autenticação
│   ├── pages/
│   │   ├── Home.jsx             # Página inicial
│   │   ├── Login.jsx            # Página de login
│   │   └── AdminPanel.jsx       # Painel administrativo
│   ├── services/
│   │   ├── api.js               # Cliente HTTP
│   │   └── auth.js              # Serviços de autenticação
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Ponto de entrada
│   └── index.css                # Estilos globais
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔐 Acesso ao Painel Admin

- **URL:** http://localhost:5173/login
- **Email:** admin@metocast.com
- **Senha:** admin123

> ⚠️ Altere a senha em produção!

## 🎨 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Amarelo | #FFC107 | Cor primária, destaques |
| Azul | #1E88E5 | Cor secundária, links |
| Azul Escuro | #1B4B8A | Backgrounds, logo |
| Roxo | #6C5CE7 | Acentos |
| Escuro | #0D0D0F | Background principal |
| Superfície | #1A1A1F | Cards, seções |

## 📱 Integração com App Mobile

O site compartilha o mesmo backend com o app mobile Flutter (MetôCast-App), garantindo sincronização de dados.

## 📡 API Endpoints

### Públicos
- GET /api/episodes - Lista episódios publicados
- GET /api/links - Lista links oficiais

### Autenticados (Admin)
- POST /api/auth/login - Login
- GET /api/admin/episodes - Lista todos episódios
- POST /api/admin/episodes - Criar episódio
- PUT /api/admin/episodes/:id - Atualizar episódio
- DELETE /api/admin/episodes/:id - Excluir episódio

## 🚀 Deploy

### Build de Produção

```bash
npm run build
```

## 📞 Links Oficiais

- 🎧 [Spotify](https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy)
- 📺 [YouTube](https://www.youtube.com/@MetoCast)
- 📸 [Instagram](https://www.instagram.com/meto_cast/)

## 📄 Licença

Este projeto é de uso interno da Universidade Metodista.

---

Feito com ❤️ pela equipe MetôCast
