# MetôCast Web

Site oficial do **MetôCast** — Podcast dos estudantes da Universidade Metodista.

## Sobre

Podcast criado por estudantes da Universidade Metodista para discutir educação, vida universitária, cultura e temas sociais relevantes.

Os episódios são automaticamente importados do canal no YouTube via RSS feed. Vídeos são entregues pelo embed do YouTube (zero carga no servidor).

## Stack

- **Next.js 14** — Frontend + API (App Router)
- **PostgreSQL** — Banco de dados (comentários e sugestões)
- **Prisma** — ORM
- **Tailwind CSS** — Estilização
- **Nginx** — Reverse proxy
- **Cloudflare Tunnel** — Acesso público seguro
- **Docker Compose** — Orquestração

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page com últimos episódios |
| `/episodios` | Lista paginada de todos os episódios |
| `/episodio/[videoId]` | Página individual do episódio |
| `/assistir` | Todos os episódios com player embutido |
| `/sobre` | Sobre o projeto |
| `/comunidade` | Sugestões de temas da comunidade |

## Início Rápido

### Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Subir PostgreSQL local
docker run -d --name metocast-db \
  -e POSTGRES_USER=metocast \
  -e POSTGRES_PASSWORD=metocast_password \
  -e POSTGRES_DB=metocast \
  -p 5432:5432 \
  postgres:16-alpine

# 3. Configurar variáveis
cp .env.example .env.local

# 4. Criar tabelas do banco
npx prisma db push

# 5. Rodar em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

### Deploy em Produção

```bash
# 1. Configurar variáveis
cp .env.docker.example .env

# 2. Subir com Docker
docker compose up -d --build

# 3. Criar tabelas (primeira vez)
docker compose exec app npx prisma db push
```

Documentação completa de deploy em [DEPLOY.md](DEPLOY.md).

## Links Oficiais

- [Spotify](https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy)
- [YouTube](https://www.youtube.com/@MetoCast)
- [Instagram](https://www.instagram.com/meto_cast/)

## Licença

Projeto de uso interno da Universidade Metodista.

---

Feito pela equipe MetôCast
