# Pendente: URL pública para imagens do Ceph (storage.metocast.com)

**Status:** Aguardando implementação  
**Criado em:** 2026-05-10  
**Contexto:** INC-005 — imagens de participações perdendo após restart de pod

---

## Situação atual

O upload de arquivos foi migrado do filesystem local do pod para o **Ceph RadosGW** (S3-compatível, porta 7480 no Proxmox). Arquivos agora persistem entre restarts e são compartilhados entre réplicas.

**Problema em aberto:** A URL retornada pelo upload é `http://100.117.249.36:7480/metocast-uploads/...` — IP Tailscale, inacessível para browsers fora da rede privada. As imagens aparecem como quadrado preto na aba Participações.

---

## Solução planejada: subdomínio `storage.metocast.com`

### Fluxo após o fix

```
Upload → Ceph RadosGW (interno)
Leitura → Browser → storage.metocast.com → Cloudflare Tunnel → Ceph :7480
```

A URL pública das imagens passa pelo Cloudflare antes de chegar ao Ceph. O backend recebe a requisição e redireciona internamente — o IP do Ceph nunca é exposto.

### Vantagens
- IP do Ceph permanece privado (apenas acessível via Tailscale)
- Cloudflare faz cache das imagens automaticamente (CDN gratuito)
- URL limpa: `https://storage.metocast.com/metocast-uploads/participacoes/abc123.jpg`

---

## O que precisa ser feito

### 1. Cloudflare Tunnel — Proxmox
Editar o config do `cloudflared` no Proxmox (normalmente em `/etc/cloudflared/config.yml`) e adicionar o novo hostname **antes** da regra catch-all:

```yaml
ingress:
  - hostname: storage.metocast.com
    service: http://localhost:7480
  - hostname: metocast.com        # regra existente
    service: http://<ip-k8s>:80
  - service: http_status:404      # catch-all, sempre por último
```

Reiniciar o serviço:
```bash
systemctl restart cloudflared
```

### 2. DNS Cloudflare
No dashboard da conta Cloudflare, domínio `metocast.com`:
- Tipo: **CNAME**
- Nome: `storage`
- Destino: mesmo valor do CNAME do tunnel principal (ex: `<id>.cfargotunnel.com`)
- Proxy: **ligado** (laranja)

### 3. Código — variável de ambiente
Adicionar novo secret no GitHub:

| Nome | Valor |
|------|-------|
| `STORAGE_PUBLIC_URL` | `https://storage.metocast.com` |

### 4. Código — upload route
Em `src/app/api/admin/upload/route.ts`, trocar a linha de construção da URL pública:

```ts
// Antes (IP Tailscale — não funciona publicamente)
const url = `${process.env.ENDPOINT_URL}/${process.env.R2_BUCKET_NAME}/${key}`;

// Depois (URL pública via Cloudflare)
const url = `${process.env.STORAGE_PUBLIC_URL}/${process.env.R2_BUCKET_NAME}/${key}`;
```

### 5. Código — deployment.yaml
Adicionar a nova env var no pod:

```yaml
- name: STORAGE_PUBLIC_URL
  valueFrom:
    secretKeyRef:
      name: metocast-secrets
      key: STORAGE_PUBLIC_URL
```

### 6. Workflow — deploy.yml
Adicionar ao `kubectl create secret generic metocast-secrets`:

```bash
--from-literal=STORAGE_PUBLIC_URL="${{ secrets.STORAGE_PUBLIC_URL }}" \
```

### 7. next.config.js — domínio permitido
Se no futuro a página usar `next/image` em vez de `<img>`, adicionar o domínio:

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'storage.metocast.com' },
    // ... existentes
  ],
}
```

Por enquanto a página usa `<img>` direto, então não é necessário.

---

## Verificação pós-deploy

```bash
# Confirmar que o túnel está respondendo
curl -I https://storage.metocast.com/metocast-uploads/

# Fazer upload de uma imagem pelo painel admin e verificar que a URL retornada começa com https://storage.metocast.com
# Confirmar que a imagem aparece na aba Participações sem quadrado preto
```

---

## Resumo do que foi feito em 2026-05-10

### INC-004 — Sugestões não apareciam na aba Comunidade
- Removido `take: 50` do `GET /api/suggestions` (7 sugestões com 0 votos ficavam fora)
- Probes do K8s alterados de `/` para `/api/suggestions` com `timeoutSeconds: 10` (evita restarts por lentidão do YouTube RSS)

### INC-005 — Imagens de participações se perdendo
- Upload migrado de filesystem local do pod para **Ceph RadosGW** via `@aws-sdk/client-s3`
- RadosGW instalado e configurado no Proxmox (porta 7480, bucket `metocast-uploads` com leitura pública)
- Credenciais adicionadas como GitHub Secrets e propagadas para K8s via workflow
- **Pendente:** URL pública via `storage.metocast.com` (este documento)

### CI/CD
- Adicionado `workflow_dispatch` para trigger manual de deploy
- Removido `kubectl wait` redundante no step de Prisma DB Push
- Seletor de pod filtra `deletionTimestamp` para evitar executar em pod terminando
- Dockerfile usa `npm install` em vez de `npm ci` (runner não tem npm no PATH)
- Timeout do rollout aumentado de 180s para 300s
