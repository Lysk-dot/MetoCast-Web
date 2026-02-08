# 🎯 Backend On-Premise - Resumo Executivo

## O que você precisa fazer no Backend:

### 1️⃣ **Portas**
- **Backend API:** `8000` (padrão)
- **PostgreSQL:** `5432` (padrão)

### 2️⃣ **Instalação**
```bash
cd /opt/metocast
git clone https://github.com/Lysk-dot/MetôCast.git backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3️⃣ **Configurar Variáveis (.env)**
```env
DATABASE_URL=postgresql://metocast_user:senha@localhost:5432/metocast_db
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
ALLOWED_ORIGINS=http://seu-servidor.com
PORT=8000
```

### 4️⃣ **Banco de Dados**
```bash
# Criar banco
sudo -u postgres psql -c "CREATE DATABASE metocast_db;"
sudo -u postgres psql -c "CREATE USER metocast_user WITH PASSWORD 'senha';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE metocast_db TO metocast_user;"

# Rodar migrations
alembic upgrade head
```

### 5️⃣ **Iniciar Backend**
```bash
# Desenvolvimento
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Produção (como serviço)
sudo cp metocast-backend.service.example /etc/systemd/system/metocast-backend.service
sudo systemctl enable metocast-backend
sudo systemctl start metocast-backend
```

### 6️⃣ **Verificar**
```bash
# Testar API
curl http://localhost:8000/api/episodes

# Ver logs
sudo journalctl -u metocast-backend -f
```

---

## 📚 Documentação Completa

- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Guia completo do backend (600+ linhas)
- **[SETUP_ON_PREMISE.md](SETUP_ON_PREMISE.md)** - Guia completo frontend + backend
- **[CHANGELOG_ONPREMISE.md](CHANGELOG_ONPREMISE.md)** - Todas as alterações feitas

---

## ⚠️ Checklist Rápido

- [ ] PostgreSQL instalado e rodando
- [ ] Banco `metocast_db` criado
- [ ] Backend clonado em `/opt/metocast/backend`
- [ ] Arquivo `.env` configurado
- [ ] `SECRET_KEY` gerado (openssl rand -hex 32)
- [ ] `ALLOWED_ORIGINS` inclui domínio do frontend
- [ ] Migrations executadas (alembic upgrade head)
- [ ] Backend rodando na porta 8000
- [ ] API responde: http://localhost:8000/docs

---

**✅ Pronto! Backend configurado.**
