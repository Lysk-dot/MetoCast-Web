# 🏠 Guia de Instalação On-Premise - MetôCast Web

Este guia detalha como instalar e configurar o MetôCast (Frontend + Backend) em ambiente on-premise.

---

## 📋 Pré-requisitos

### Software Necessário
- **Node.js** 18+ e npm (para o frontend)
- **Python** 3.10+ e pip (para o backend)
- **PostgreSQL** 14+ (banco de dados)
- **Git** (para clonar os repositórios)

### Opcionais (Produção)
- **Nginx** ou **Apache** (servidor web para frontend)
- **systemd** (gerenciamento de serviços Linux)
- **Certificado SSL** (HTTPS)

---

## 🎯 Arquitetura On-Premise

```
┌─────────────────────────────────────────────┐
│  Nginx (Porta 80/443)                       │
│  Frontend React + Proxy reverso para API    │
└────────────────┬────────────────────────────┘
                 │
                 │ Proxy para /api/*
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Backend FastAPI (Porta 8000)               │
│  uvicorn app.main:app                       │
└────────────────┬────────────────────────────┘
                 │
                 │ PostgreSQL
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  PostgreSQL Database (Porta 5432)           │
│  metocast_db                                │
└─────────────────────────────────────────────┘
```

---

## 🔧 Instalação

### 1. Instalar Dependências do Sistema

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib python3-pip python3-venv nodejs npm nginx git
```

#### CentOS/RHEL
```bash
sudo yum install -y postgresql-server postgresql-contrib python3-pip nodejs nginx git
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

---

### 2. Configurar Banco de Dados PostgreSQL

```bash
# Acessar o PostgreSQL
sudo -u postgres psql

# Criar banco e usuário
CREATE DATABASE metocast_db;
CREATE USER metocast_user WITH PASSWORD 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON DATABASE metocast_db TO metocast_user;

# Sair do PostgreSQL
\q
```

#### Permitir conexões locais (se necessário)
Edite `/etc/postgresql/14/main/pg_hba.conf` (ajuste a versão se necessário):
```
# IPv4 local connections:
host    metocast_db    metocast_user    127.0.0.1/32    md5
```

Reinicie o PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

### 3. Instalar e Configurar o Backend (FastAPI)

```bash
# Criar diretório para o projeto
sudo mkdir -p /opt/metocast
sudo chown $USER:$USER /opt/metocast
cd /opt/metocast

# Clonar repositório do backend
git clone https://github.com/Lysk-dot/MetôCast.git backend
cd backend

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env
cat > .env << EOF
DATABASE_URL=postgresql://metocast_user:senha_forte_aqui@localhost:5432/metocast_db
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
ALLOWED_ORIGINS=http://localhost,http://seu-servidor.com
EOF

# Rodar migrations
alembic upgrade head

# Criar usuário admin inicial (opcional - se houver script)
# python scripts/create_admin.py
```

#### Testar Backend
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
# Acesse: http://localhost:8000/docs
```

---

### 4. Instalar e Configurar o Frontend (React)

```bash
cd /opt/metocast

# Clonar repositório do frontend
git clone https://github.com/Lysk-dot/MetôCast-Web.git frontend
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
nano .env
```

Edite o arquivo `.env`:
```env
# Para desenvolvimento local
VITE_API_URL=http://localhost:8000/api
VITE_ENV=development
VITE_BASE_URL=/

# Para produção (ajuste conforme seu domínio)
# VITE_API_URL=http://seu-servidor.com/api
# VITE_ENV=production
# VITE_BASE_URL=/
```

#### Testar Frontend (desenvolvimento)
```bash
npm run dev
# Acesse: http://localhost:5173
```

#### Build para Produção
```bash
npm run build
# Arquivos gerados em: dist/
```

---

## 🚀 Configuração de Produção

### 5. Configurar Backend como Serviço (systemd)

Crie o arquivo `/etc/systemd/system/metocast-backend.service`:

```ini
[Unit]
Description=MetôCast Backend API (FastAPI)
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/metocast/backend
Environment="PATH=/opt/metocast/backend/venv/bin"
ExecStart=/opt/metocast/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Ativar e iniciar o serviço:
```bash
sudo systemctl daemon-reload
sudo systemctl enable metocast-backend
sudo systemctl start metocast-backend
sudo systemctl status metocast-backend
```

---

### 6. Configurar Nginx

Crie o arquivo `/etc/nginx/sites-available/metocast`:

```nginx
server {
    listen 80;
    server_name seu-servidor.com;  # Altere para seu domínio ou IP
    
    # Frontend (arquivos estáticos)
    root /opt/metocast/frontend/dist;
    index index.html;
    
    # Servir arquivos estáticos
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy reverso para API Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Ativar o site:
```bash
sudo ln -s /etc/nginx/sites-available/metocast /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### 7. Configurar HTTPS (Opcional, mas Recomendado)

#### Usando Let's Encrypt (Certbot)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-servidor.com

# Renovação automática (já configurado pelo certbot)
sudo systemctl status certbot.timer
```

---

## 🔐 Segurança

### Firewall (UFW)
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Alterar Senha Admin
Acesse o painel em: `http://seu-servidor.com/login`
- Email padrão: `admin@metocast.com`
- Senha padrão: `admin123`

**⚠️ IMPORTANTE:** Altere a senha imediatamente após o primeiro login!

---

## 📊 Monitoramento e Logs

### Ver logs do backend
```bash
sudo journalctl -u metocast-backend -f
```

### Ver logs do Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Ver logs do PostgreSQL
```bash
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 🔄 Atualizações

### Atualizar Backend
```bash
cd /opt/metocast/backend
git pull
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart metocast-backend
```

### Atualizar Frontend
```bash
cd /opt/metocast/frontend
git pull
npm install
npm run build
sudo systemctl restart nginx
```

---

## 🐛 Troubleshooting

### Problema: Backend não inicia
```bash
# Verificar logs
sudo journalctl -u metocast-backend -n 50

# Verificar se a porta está em uso
sudo netstat -tulpn | grep 8000

# Testar manualmente
cd /opt/metocast/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Problema: Frontend não carrega API
1. Verifique se o backend está rodando: `curl http://localhost:8000/api/episodes`
2. Verifique o arquivo `.env` do frontend
3. Inspecione o console do navegador (F12) para ver os erros de rede

### Problema: Erro 502 Bad Gateway (Nginx)
```bash
# Verificar se o backend está rodando
sudo systemctl status metocast-backend

# Verificar configuração do Nginx
sudo nginx -t

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log
```

### Problema: Banco de dados não conecta
```bash
# Verificar se o PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql -U metocast_user -d metocast_db -h localhost
```

---

## 📞 Suporte

- **Repositório Frontend:** https://github.com/Lysk-dot/MetôCast-Web
- **Repositório Backend:** https://github.com/Lysk-dot/MetôCast
- **Email:** felipe@metocast.com

---

## 📝 Checklist de Instalação

- [ ] PostgreSQL instalado e configurado
- [ ] Banco `metocast_db` criado
- [ ] Backend clonado e dependências instaladas
- [ ] Variáveis de ambiente do backend configuradas (`.env`)
- [ ] Migrations executadas (`alembic upgrade head`)
- [ ] Frontend clonado e dependências instaladas
- [ ] Variáveis de ambiente do frontend configuradas (`.env`)
- [ ] Build de produção gerado (`npm run build`)
- [ ] Serviço systemd do backend criado e iniciado
- [ ] Nginx configurado e rodando
- [ ] Firewall configurado (portas 80, 443)
- [ ] SSL/HTTPS configurado (opcional)
- [ ] Senha admin alterada
- [ ] Testes de login e CRUD realizados

---

**✅ Pronto!** Seu MetôCast está rodando em ambiente on-premise.
