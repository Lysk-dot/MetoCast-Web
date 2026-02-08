# 🔧 Configuração Backend On-Premise - MetôCast

Este documento detalha **todas as configurações necessárias no backend** para funcionar em ambiente on-premise.

---

## 📋 Índice

1. [Estrutura do Backend](#estrutura-do-backend)
2. [Instalação e Dependências](#instalação-e-dependências)
3. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
4. [Portas e Networking](#portas-e-networking)
5. [Banco de Dados](#banco-de-dados)
6. [Comandos Importantes](#comandos-importantes)
7. [Configuração como Serviço](#configuração-como-serviço)
8. [CORS e Segurança](#cors-e-segurança)
9. [Troubleshooting](#troubleshooting)

---

## 📁 Estrutura do Backend

O backend MetôCast é construído com:
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Autenticação**: JWT (JSON Web Tokens)
- **Banco de Dados**: PostgreSQL

**Repositório**: https://github.com/Lysk-dot/MetôCast

---

## 🚀 Instalação e Dependências

### 1. Clone o Repositório

```bash
cd /opt/metocast
git clone https://github.com/Lysk-dot/MetôCast.git backend
cd backend
```

### 2. Crie o Ambiente Virtual

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instale as Dependências

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Principais dependências:**
- `fastapi` - Framework web
- `uvicorn[standard]` - Servidor ASGI
- `sqlalchemy` - ORM
- `alembic` - Migrations
- `psycopg2-binary` - Driver PostgreSQL
- `python-jose[cryptography]` - JWT
- `passlib[bcrypt]` - Hash de senhas
- `python-multipart` - Upload de arquivos

---

## 🔐 Configuração de Variáveis de Ambiente

### Criar arquivo `.env`

No diretório `/opt/metocast/backend/`, crie o arquivo `.env`:

```bash
cat > .env << 'EOF'
# ========================================
# MetôCast Backend - Configuração On-Premise
# ========================================

# === BANCO DE DADOS ===
# Formato: postgresql://USUARIO:SENHA@HOST:PORTA/BANCO
DATABASE_URL=postgresql://metocast_user:sua_senha_forte@localhost:5432/metocast_db

# === AUTENTICAÇÃO JWT ===
# Gerar SECRET_KEY: openssl rand -hex 32
SECRET_KEY=sua_chave_secreta_aqui_64_caracteres_hexadecimal
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# === AMBIENTE ===
DEBUG=False
ENVIRONMENT=production

# === CORS (Origens Permitidas) ===
# Separe múltiplos domínios com vírgula
# Desenvolvimento: http://localhost:5173
# Produção: http://seu-servidor.com,https://seu-dominio.com
ALLOWED_ORIGINS=http://localhost:5173,http://seu-servidor.com

# === SERVIDOR ===
HOST=0.0.0.0
PORT=8000

# === UPLOADS (Opcional) ===
# Se usar upload de imagens local
UPLOAD_DIR=/opt/metocast/uploads
MAX_UPLOAD_SIZE=10485760

EOF
```

### Gerar SECRET_KEY

```bash
openssl rand -hex 32
```

Copie o resultado e cole no `.env` no campo `SECRET_KEY`.

### ⚠️ Checklist de Configuração

- [ ] **DATABASE_URL**: Configurado com credenciais corretas do PostgreSQL
- [ ] **SECRET_KEY**: Gerado e único (64 caracteres hex)
- [ ] **ALLOWED_ORIGINS**: Inclui o domínio/IP do frontend
- [ ] **DEBUG**: Definido como `False` em produção
- [ ] **PORT**: 8000 (ou outra porta disponível)

---

## 🌐 Portas e Networking

### Portas Utilizadas

| Serviço | Porta | Uso | Acesso |
|---------|-------|-----|--------|
| **Backend API** | `8000` | FastAPI/Uvicorn | Interno (via Nginx) ou Externo |
| **PostgreSQL** | `5432` | Banco de dados | Apenas localhost |
| **Nginx** | `80` / `443` | Proxy reverso + Frontend | Externo (público) |

### Configuração de Porta do Backend

#### Opção 1: Via variável de ambiente (.env)
```env
PORT=8000
```

#### Opção 2: Via argumento do uvicorn
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Opção 3: Porta dinâmica (Railway style)
Se precisar usar porta dinâmica (como no Railway):
```bash
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

### Acessibilidade

**Desenvolvimento (acesso direto):**
```bash
# Backend escuta em todas as interfaces
uvicorn app.main:app --host 0.0.0.0 --port 8000
# Acesso: http://IP_DO_SERVIDOR:8000/api
```

**Produção (via Nginx - RECOMENDADO):**
```bash
# Backend escuta apenas localhost
uvicorn app.main:app --host 127.0.0.1 --port 8000
# Acesso: http://seu-servidor.com/api (proxy via Nginx)
```

### Firewall

**Se backend usa acesso direto (sem Nginx):**
```bash
sudo ufw allow 8000/tcp
```

**Se backend usa proxy (COM Nginx - RECOMENDADO):**
```bash
# NÃO abra a porta 8000 no firewall
# Apenas abra HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 🗄️ Banco de Dados

### 1. Criar Banco e Usuário PostgreSQL

```bash
sudo -u postgres psql
```

```sql
-- Criar banco
CREATE DATABASE metocast_db;

-- Criar usuário
CREATE USER metocast_user WITH PASSWORD 'senha_forte_aqui_12345';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE metocast_db TO metocast_user;

-- PostgreSQL 15+ (necessário para schemas)
\c metocast_db
GRANT ALL ON SCHEMA public TO metocast_user;

-- Sair
\q
```

### 2. Testar Conexão

```bash
psql -U metocast_user -d metocast_db -h localhost -W
```

### 3. Rodar Migrations

No diretório do backend:

```bash
source venv/bin/activate
alembic upgrade head
```

**O que isso faz:**
- Cria todas as tabelas necessárias
- Aplica o schema do banco
- Insere dados iniciais (se houver seeds)

### 4. Criar Usuário Admin Inicial

Se o backend tiver script de criação de admin:

```bash
# Verificar se existe o script
ls scripts/create_admin.py

# Se existir, execute:
python scripts/create_admin.py
```

**Se não existir script**, crie manualmente via SQL:

```sql
-- Conecte ao banco
psql -U metocast_user -d metocast_db -h localhost

-- Inserir admin (ajuste conforme schema do seu banco)
INSERT INTO users (email, name, hashed_password, is_admin, is_active)
VALUES (
  'admin@metocast.com',
  'Administrador',
  '$2b$12$...', -- Hash bcrypt de 'admin123'
  true,
  true
);
```

**Gerar hash bcrypt da senha:**
```bash
python3 -c "from passlib.context import CryptContext; pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto'); print(pwd_context.hash('admin123'))"
```

---

## 🎯 Comandos Importantes

### Desenvolvimento

```bash
# Ativar ambiente virtual
source venv/bin/activate

# Rodar servidor em modo desenvolvimento (auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Ou com logs detalhados
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --log-level debug

# Acessar documentação interativa
# http://localhost:8000/docs (Swagger)
# http://localhost:8000/redoc (ReDoc)
```

### Produção

```bash
# Rodar servidor em produção (múltiplos workers)
uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4

# Com logs
uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 --log-level info

# Número recomendado de workers: (CPU cores * 2) + 1
# Exemplo: 2 cores = 5 workers
```

### Migrations

```bash
# Criar nova migration
alembic revision --autogenerate -m "Descrição da alteração"

# Aplicar migrations
alembic upgrade head

# Reverter última migration
alembic downgrade -1

# Ver histórico
alembic history

# Ver status atual
alembic current
```

### Testes

```bash
# Rodar testes (se houver)
pytest

# Com cobertura
pytest --cov=app --cov-report=html
```

---

## ⚙️ Configuração como Serviço (systemd)

### 1. Criar arquivo de serviço

Use o arquivo de exemplo fornecido:

```bash
sudo cp /opt/metocast/frontend/metocast-backend.service.example /etc/systemd/system/metocast-backend.service
```

### 2. Editar o serviço (se necessário)

```bash
sudo nano /etc/systemd/system/metocast-backend.service
```

**Ajustes importantes:**
- `User` e `Group`: Usuário que rodará o serviço (ex: `www-data`)
- `WorkingDirectory`: Caminho do backend (`/opt/metocast/backend`)
- `ExecStart`: Caminho do uvicorn e argumentos
- `--workers`: Número de processos (ajuste conforme CPU)

### 3. Ativar e iniciar o serviço

```bash
# Recarregar configurações
sudo systemctl daemon-reload

# Habilitar para iniciar no boot
sudo systemctl enable metocast-backend

# Iniciar o serviço
sudo systemctl start metocast-backend

# Verificar status
sudo systemctl status metocast-backend
```

### 4. Gerenciar o serviço

```bash
# Parar
sudo systemctl stop metocast-backend

# Reiniciar
sudo systemctl restart metocast-backend

# Recarregar (sem downtime, se suportado)
sudo systemctl reload metocast-backend

# Ver logs
sudo journalctl -u metocast-backend -f

# Ver últimas 100 linhas
sudo journalctl -u metocast-backend -n 100

# Ver logs de hoje
sudo journalctl -u metocast-backend --since today
```

---

## 🔒 CORS e Segurança

### Configurar CORS

No arquivo `.env`, defina as origens permitidas:

```env
# Desenvolvimento
ALLOWED_ORIGINS=http://localhost:5173

# Produção (múltiplos domínios)
ALLOWED_ORIGINS=http://seu-servidor.com,https://seu-dominio.com,http://192.168.1.100

# Permitir qualquer origem (NÃO RECOMENDADO EM PRODUÇÃO)
ALLOWED_ORIGINS=*
```

### Validar CORS

Teste com curl:

```bash
# Teste de preflight
curl -X OPTIONS http://localhost:8000/api/episodes \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Deve retornar header: Access-Control-Allow-Origin
```

### Configurações de Segurança Recomendadas

No código do backend (`app/main.py` ou similar), certifique-se de ter:

```python
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Hosts (proteção contra host header injection)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["seu-dominio.com", "*.seu-dominio.com", "localhost"]
)
```

### Headers de Segurança (configurar no Nginx)

No `nginx.conf`:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

---

## 🐛 Troubleshooting

### Problema: Backend não inicia

**Sintomas:**
- `systemctl status metocast-backend` mostra "failed"
- Erro ao rodar `uvicorn`

**Soluções:**

1. **Verificar logs:**
```bash
sudo journalctl -u metocast-backend -n 50
```

2. **Testar manualmente:**
```bash
cd /opt/metocast/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

3. **Erros comuns:**

| Erro | Causa | Solução |
|------|-------|---------|
| `ModuleNotFoundError: No module named 'app'` | Diretório errado ou venv não ativado | `cd /opt/metocast/backend && source venv/bin/activate` |
| `Address already in use` | Porta 8000 já está em uso | `sudo lsof -i :8000` e matar o processo |
| `Could not connect to database` | PostgreSQL não rodando ou credenciais erradas | Verificar `.env` e status do PostgreSQL |
| `SECRET_KEY not set` | Variável de ambiente faltando | Conferir arquivo `.env` |

### Problema: Frontend não conecta à API

**Sintomas:**
- Erro de CORS no console do navegador
- "Network Error" ao fazer login

**Soluções:**

1. **Verificar se backend está rodando:**
```bash
curl http://localhost:8000/api/episodes
```

2. **Verificar CORS:**
- Conferir `ALLOWED_ORIGINS` no `.env` do backend
- Deve incluir o domínio do frontend

3. **Verificar proxy do Nginx:**
```bash
sudo nginx -t
cat /etc/nginx/sites-enabled/metocast | grep "proxy_pass"
```

### Problema: Erro 502 Bad Gateway

**Causa:** Nginx não consegue conectar ao backend

**Soluções:**

1. **Backend está rodando?**
```bash
sudo systemctl status metocast-backend
curl http://127.0.0.1:8000/api/episodes
```

2. **Porta correta no Nginx?**
```bash
cat /etc/nginx/sites-enabled/metocast | grep proxy_pass
# Deve ser: proxy_pass http://127.0.0.1:8000/api/;
```

3. **SELinux bloqueando?** (CentOS/RHEL)
```bash
sudo setsebool -P httpd_can_network_connect 1
```

### Problema: Migrations falham

**Erro:** `alembic upgrade head` falha

**Soluções:**

1. **Verificar conexão com banco:**
```bash
psql -U metocast_user -d metocast_db -h localhost
```

2. **Permissões do usuário:**
```sql
-- Como postgres
sudo -u postgres psql
\c metocast_db
GRANT ALL ON SCHEMA public TO metocast_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO metocast_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO metocast_user;
```

3. **Resetar migrations (CUIDADO: perde dados):**
```bash
# Dropar todas as tabelas
psql -U metocast_user -d metocast_db -h localhost -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Rodar migrations novamente
alembic upgrade head
```

### Problema: Alta carga de CPU/Memória

**Soluções:**

1. **Reduzir número de workers:**
```bash
# No arquivo .service ou command line
--workers 2  # Ao invés de 4
```

2. **Adicionar limites de recursos no systemd:**
```ini
# /etc/systemd/system/metocast-backend.service
[Service]
MemoryMax=512M
CPUQuota=50%
```

3. **Configurar timeout:**
```python
# No código FastAPI
uvicorn.run(app, timeout_keep_alive=30)
```

---

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# Backend (systemd)
sudo journalctl -u metocast-backend -f

# PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Nginx
sudo tail -f /var/log/nginx/metocast_access.log
sudo tail -f /var/log/nginx/metocast_error.log
```

### Health Check

Crie endpoint de health check no backend (`app/main.py`):

```python
@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow()}
```

Teste:
```bash
curl http://localhost:8000/health
```

### Métricas de Performance

```bash
# Requisições/segundo (Nginx)
tail -n 10000 /var/log/nginx/metocast_access.log | awk '{print $4}' | cut -d: -f1-2 | uniq -c | tail

# Tempo de resposta médio (Backend)
# Ver logs do uvicorn
```

---

## 📞 Informações Adicionais

### Estrutura de Diretórios Recomendada

```
/opt/metocast/
├── backend/              # Repositório do backend
│   ├── app/
│   ├── alembic/
│   ├── venv/
│   ├── .env
│   ├── requirements.txt
│   └── ...
├── frontend/             # Repositório do frontend
│   ├── dist/            # Build de produção
│   ├── src/
│   ├── .env
│   └── ...
└── uploads/             # Upload de imagens (opcional)
```

### Portas Padrão - Resumo

- **Frontend (dev)**: 5173
- **Backend (API)**: 8000
- **PostgreSQL**: 5432
- **Nginx (HTTP)**: 80
- **Nginx (HTTPS)**: 443

### Links Úteis

- **Documentação FastAPI**: https://fastapi.tiangolo.com
- **Documentação Alembic**: https://alembic.sqlalchemy.org
- **Documentação Uvicorn**: https://www.uvicorn.org
- **Repositório Backend**: https://github.com/Lysk-dot/MetôCast

---

## ✅ Checklist Final

Antes de considerar o backend pronto:

- [ ] PostgreSQL instalado e rodando
- [ ] Banco `metocast_db` criado com usuário `metocast_user`
- [ ] Backend clonado em `/opt/metocast/backend`
- [ ] Ambiente virtual criado e dependências instaladas
- [ ] Arquivo `.env` configurado com todas as variáveis
- [ ] `SECRET_KEY` gerado e único
- [ ] `ALLOWED_ORIGINS` inclui domínio do frontend
- [ ] Migrations executadas (`alembic upgrade head`)
- [ ] Usuário admin criado
- [ ] Serviço systemd configurado e rodando
- [ ] Backend responde em `http://localhost:8000/docs`
- [ ] Logs do backend não mostram erros críticos
- [ ] CORS funcionando (testado do frontend)
- [ ] Nginx configurado como proxy reverso (se aplicável)

---

**🎉 Backend configurado e pronto para uso!**
