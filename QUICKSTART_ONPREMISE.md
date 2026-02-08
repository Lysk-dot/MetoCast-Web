# 🚀 Quick Start - Deploy On-Premise

Este é um guia rápido para deploy. Para instruções completas, veja [SETUP_ON_PREMISE.md](SETUP_ON_PREMISE.md).

## Checklist Rápido

### 1. Pré-requisitos
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y postgresql nodejs npm nginx git python3-pip python3-venv
```

### 2. Banco de Dados
```bash
sudo -u postgres psql
CREATE DATABASE metocast_db;
CREATE USER metocast_user WITH PASSWORD 'SUA_SENHA_AQUI';
GRANT ALL PRIVILEGES ON DATABASE metocast_db TO metocast_user;
\q
```

### 3. Backend
```bash
cd /opt/metocast
git clone https://github.com/Lysk-dot/MetôCast.git backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurar .env
cat > .env << EOF
DATABASE_URL=postgresql://metocast_user:SUA_SENHA@localhost:5432/metocast_db
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
ALLOWED_ORIGINS=http://seu-servidor.com
EOF

alembic upgrade head
```

### 4. Frontend
```bash
cd /opt/metocast
git clone https://github.com/Lysk-dot/MetôCast-Web.git frontend
cd frontend
npm install
cp .env.example .env

# Editar .env
nano .env
# VITE_API_URL=http://seu-servidor.com/api
# VITE_ENV=production

npm run build
```

### 5. Configurar Serviços
```bash
# Backend systemd
sudo cp metocast-backend.service.example /etc/systemd/system/metocast-backend.service
sudo nano /etc/systemd/system/metocast-backend.service  # Ajustar caminhos
sudo systemctl daemon-reload
sudo systemctl enable metocast-backend
sudo systemctl start metocast-backend

# Nginx
sudo cp nginx.conf.example /etc/nginx/sites-available/metocast
sudo nano /etc/nginx/sites-available/metocast  # Ajustar domínio e caminhos
sudo ln -s /etc/nginx/sites-available/metocast /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Firewall
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 7. HTTPS (Opcional)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## Acesso

- **Site:** http://seu-servidor.com
- **Admin:** http://seu-servidor.com/login
- **Credenciais padrão:**
  - Email: admin@metocast.com
  - Senha: admin123 ⚠️ ALTERAR IMEDIATAMENTE

## Verificação

```bash
# Status do backend
sudo systemctl status metocast-backend

# Logs do backend
sudo journalctl -u metocast-backend -f

# Status do Nginx
sudo systemctl status nginx

# Logs do Nginx
sudo tail -f /var/log/nginx/metocast_*.log

# Testar API
curl http://localhost:8000/api/episodes
```

## Problemas Comuns

### Backend não inicia
```bash
cd /opt/metocast/backend
source venv/bin/activate
uvicorn app.main:app --reload  # Testar manualmente
```

### Frontend não conecta à API
- Verificar `.env` do frontend (VITE_API_URL)
- Verificar console do navegador (F12)
- Verificar proxy reverso no Nginx

### Erro 502 Bad Gateway
- Backend está rodando? `systemctl status metocast-backend`
- Porta correta? `netstat -tulpn | grep 8000`
- Nginx configurado? `nginx -t`

---

📖 **Documentação completa:** [SETUP_ON_PREMISE.md](SETUP_ON_PREMISE.md)
