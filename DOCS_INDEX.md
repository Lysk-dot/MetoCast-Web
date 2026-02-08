# 📚 Índice de Documentação - MetôCast On-Premise

Guia completo para instalação e configuração do MetôCast em ambiente on-premise.

---

## 🚀 Início Rápido

**Primeira vez?** Comece aqui:

1. **[BACKEND_RESUMO.md](BACKEND_RESUMO.md)** ⚡ (5 min)
   - Resumo executivo do backend
   - Comandos essenciais
   - Checklist rápido

2. **[QUICKSTART_ONPREMISE.md](QUICKSTART_ONPREMISE.md)** ⚡ (15 min)
   - Instalação completa resumida
   - Comandos prontos para copiar/colar
   - Verificação rápida

---

## 📖 Documentação Completa

### Backend

- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** 📘 (Leitura: 30 min)
  - Instalação detalhada do backend
  - Configuração de portas e networking
  - Banco de dados PostgreSQL
  - CORS e segurança
  - Troubleshooting completo
  - Monitoramento e logs

### Frontend + Backend Integrado

- **[SETUP_ON_PREMISE.md](SETUP_ON_PREMISE.md)** 📗 (Leitura: 45 min)
  - Guia completo de instalação
  - Frontend React + Backend FastAPI
  - PostgreSQL, Nginx, systemd
  - HTTPS com Let's Encrypt
  - Segurança e firewall
  - Manutenção e atualizações

---

## 🔧 Arquivos de Configuração

### Prontos para Usar

- **[.env.example](.env.example)**
  - Template de variáveis de ambiente do frontend
  - Copie para `.env` e ajuste conforme necessário

- **[nginx.conf.example](nginx.conf.example)**
  - Configuração completa do Nginx
  - Proxy reverso + servir frontend
  - Cache e segurança
  - Copie para `/etc/nginx/sites-available/metocast`

- **[metocast-backend.service.example](metocast-backend.service.example)**
  - Serviço systemd para o backend
  - Restart automático
  - Copie para `/etc/systemd/system/metocast-backend.service`

### Scripts

- **[deploy.sh](deploy.sh)** 🔨
  - Script automatizado de build
  - Verifica `.env`, instala deps, gera build
  - Execute: `./deploy.sh`

---

## 📝 Changelog e Documentação

- **[CHANGELOG_ONPREMISE.md](CHANGELOG_ONPREMISE.md)** 📋
  - Todas as alterações feitas no projeto
  - Arquivos criados e modificados
  - Impacto e compatibilidade
  - Estatísticas completas

- **[README.md](README.md)** 📄
  - Visão geral do projeto
  - Tecnologias utilizadas
  - Estrutura do projeto
  - Seção On-Premise adicionada

---

## 🗺️ Roteiro de Instalação

### Opção 1: Quick Start (Experiente)
```
1. BACKEND_RESUMO.md        → Configurar backend
2. QUICKSTART_ONPREMISE.md  → Deploy completo
3. Testar e usar
```

### Opção 2: Instalação Completa (Primeira vez)
```
1. SETUP_ON_PREMISE.md      → Ler seções 1-3
2. BACKEND_SETUP.md         → Seguir guia backend
3. SETUP_ON_PREMISE.md      → Continuar seções 4-7
4. Verificar com checklists
```

### Opção 3: Apenas Backend
```
1. BACKEND_RESUMO.md        → Visão geral
2. BACKEND_SETUP.md         → Instalação detalhada
```

---

## 🎯 Por Caso de Uso

### Preciso configurar o backend
👉 **[BACKEND_SETUP.md](BACKEND_SETUP.md)**

### Quero fazer deploy completo
👉 **[SETUP_ON_PREMISE.md](SETUP_ON_PREMISE.md)**

### Tenho pressa, comandos rápidos
👉 **[BACKEND_RESUMO.md](BACKEND_RESUMO.md)** + **[QUICKSTART_ONPREMISE.md](QUICKSTART_ONPREMISE.md)**

### Algo deu errado
👉 **[BACKEND_SETUP.md](BACKEND_SETUP.md)** → Seção Troubleshooting  
👉 **[SETUP_ON_PREMISE.md](SETUP_ON_PREMISE.md)** → Seção Troubleshooting

### Quero entender as mudanças
👉 **[CHANGELOG_ONPREMISE.md](CHANGELOG_ONPREMISE.md)**

### Preciso configurar Nginx
👉 **[nginx.conf.example](nginx.conf.example)**

### Preciso configurar systemd
👉 **[metocast-backend.service.example](metocast-backend.service.example)**

---

## 📊 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────┐
│  Nginx (Porta 80/443)                       │
│  • Serve frontend estático (React)          │
│  • Proxy reverso /api/* → Backend           │
└────────────────┬────────────────────────────┘
                 │
                 │ HTTP/HTTPS
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Backend FastAPI (Porta 8000)               │
│  • Autenticação JWT                         │
│  • CRUD (episódios, links)                  │
│  • Gerenciado por systemd                   │
└────────────────┬────────────────────────────┘
                 │
                 │ SQL
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  PostgreSQL (Porta 5432)                    │
│  • Banco de dados: metocast_db              │
│  • Usuário: metocast_user                   │
└─────────────────────────────────────────────┘
```

---

## ⚙️ Componentes do Sistema

### Frontend (React + Vite)
- **Porta dev:** 5173
- **Porta preview:** 4173
- **Arquivos produção:** `dist/`
- **Config:** `.env`, `vite.config.js`
- **Script build:** `npm run build` ou `./deploy.sh`

### Backend (FastAPI + Uvicorn)
- **Porta:** 8000 (configurável)
- **Config:** `.env` (no diretório backend)
- **Comando dev:** `uvicorn app.main:app --reload`
- **Comando prod:** Via systemd service
- **Docs:** http://localhost:8000/docs

### Banco de Dados (PostgreSQL)
- **Porta:** 5432
- **Banco:** metocast_db
- **Usuário:** metocast_user
- **Migrations:** Alembic (`alembic upgrade head`)

### Servidor Web (Nginx)
- **Portas:** 80 (HTTP), 443 (HTTPS)
- **Config:** `/etc/nginx/sites-available/metocast`
- **Logs:** `/var/log/nginx/metocast_*.log`

---

## 🔗 Links Úteis

### Repositórios
- **Frontend:** https://github.com/Lysk-dot/MetôCast-Web
- **Backend:** https://github.com/Lysk-dot/MetôCast

### Documentação Tecnologias
- **FastAPI:** https://fastapi.tiangolo.com
- **React:** https://react.dev
- **Vite:** https://vitejs.dev
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Nginx:** https://nginx.org/en/docs/

---

## ✅ Checklists

### Backend Pronto?
- [ ] PostgreSQL instalado e rodando
- [ ] Banco criado e usuário configurado
- [ ] `.env` do backend configurado
- [ ] Migrations executadas
- [ ] Backend responde em http://localhost:8000/docs

### Frontend Pronto?
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env` do frontend configurado
- [ ] Build gerado (`npm run build`)
- [ ] Nginx configurado e rodando
- [ ] Site acessível via navegador

### Produção Pronta?
- [ ] Backend como serviço systemd
- [ ] Nginx como proxy reverso
- [ ] Firewall configurado
- [ ] HTTPS configurado (opcional)
- [ ] Logs sendo gerados
- [ ] Senha admin alterada

---

## 🆘 Suporte

### Problemas Comuns

1. **Backend não inicia**
   - Ver: [BACKEND_SETUP.md](BACKEND_SETUP.md#troubleshooting) → "Backend não inicia"
   - Comando: `sudo journalctl -u metocast-backend -n 50`

2. **Frontend não conecta à API**
   - Ver: [BACKEND_SETUP.md](BACKEND_SETUP.md#troubleshooting) → "Frontend não conecta"
   - Verificar: CORS, `.env`, Nginx proxy

3. **Erro 502 Bad Gateway**
   - Ver: [BACKEND_SETUP.md](BACKEND_SETUP.md#troubleshooting) → "Erro 502"
   - Verificar: Backend rodando, porta correta

4. **Migrations falham**
   - Ver: [BACKEND_SETUP.md](BACKEND_SETUP.md#troubleshooting) → "Migrations falham"
   - Verificar: Permissões PostgreSQL

### Comandos de Diagnóstico

```bash
# Verificar serviços
sudo systemctl status metocast-backend
sudo systemctl status postgresql
sudo systemctl status nginx

# Ver logs
sudo journalctl -u metocast-backend -f
sudo tail -f /var/log/nginx/metocast_error.log

# Testar conectividade
curl http://localhost:8000/api/episodes
curl http://localhost/api/episodes
```

---

## 📞 Contato

- **Email:** felipe@metocast.com
- **GitHub Issues:** [MetôCast-Web Issues](https://github.com/Lysk-dot/MetôCast-Web/issues)

---

**📌 Dica:** Salve este arquivo como favorito! Ele é seu guia central para toda a documentação.

**Última atualização:** 08 de Fevereiro de 2026
