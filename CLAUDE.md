# MetoCast — Contexto para Claude Code

## O projeto
Site do podcast MetôCast (estudantes da Universidade Metodista de SP). Stack: Next.js 14 + Prisma + PostgreSQL + Kubernetes. Deploy automático via GitHub Actions (self-hosted runner) na branch `Stable`.

## Infraestrutura
- **Proxmox:** `100.117.249.36` (Tailscale) — host das VMs
- **K8s:** cluster com 1 control plane + 3 workers, namespace `metocast`, 2 réplicas
- **Banco:** PostgreSQL na VM `postgres` (10.10.10.30:5432)
- **Storage:** Ceph RadosGW na porta 7480 do Proxmox (S3-compatível)
- **Acesso externo:** Cloudflare Tunnel → K8s ingress nginx
- **Docs do servidor:** `/root/docs/` no Proxmox (incidentes, runbooks, infra)

## Pendências abertas

### 🔴 storage.metocast.com (PRIORITÁRIO)
Imagens de participações sobem para o Ceph mas a URL retornada é o IP Tailscale (`http://100.117.249.36:7480/...`) — inacessível publicamente. Aparece como quadrado preto na aba Participações.

**Plano completo em:** `docs/pendente-storage-subdominio.md`

Resumo do que falta:
1. Configurar Cloudflare Tunnel no Proxmox para expor `storage.metocast.com` → `http://localhost:7480`
2. Criar CNAME `storage` no DNS Cloudflare
3. Adicionar GitHub Secret `STORAGE_PUBLIC_URL=https://storage.metocast.com`
4. Em `src/app/api/admin/upload/route.ts`, trocar:
   ```ts
   // de:
   const url = `${process.env.ENDPOINT_URL}/${process.env.R2_BUCKET_NAME}/${key}`;
   // para:
   const url = `${process.env.STORAGE_PUBLIC_URL}/${process.env.R2_BUCKET_NAME}/${key}`;
   ```
5. Adicionar `STORAGE_PUBLIC_URL` em `k8s/deployment.yaml` e `deploy.yml`

## O que foi feito na última sessão (2026-05-10)

### INC-004
- Removido `take: 50` de `GET /api/suggestions` (7 sugestões com 0 votos ficavam invisíveis)
- Probes K8s: `/` → `/api/suggestions` com `timeoutSeconds: 10`

### INC-005
- Upload migrado de filesystem local → Ceph RadosGW via `@aws-sdk/client-s3`
- RadosGW instalado no Proxmox (porta 7480), bucket `metocast-uploads` com leitura pública
- Credenciais como GitHub Secrets: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `ENDPOINT_URL`
- **Problema restante:** URL pública (ver pendência acima)

### CI/CD
- `workflow_dispatch` adicionado para trigger manual
- `kubectl wait` redundante removido do Prisma DB Push
- Seletor de pod filtra `deletionTimestamp`
- Dockerfile: `npm ci` → `npm install` (runner não tem npm)
- Rollout timeout: 180s → 300s

## Secrets K8s (via GitHub Actions → metocast-secrets)
`DATABASE_URL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `YOUTUBE_CHANNEL_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `ENDPOINT_URL`

## Comandos úteis
```bash
# Ver pods
ssh k8s-control "kubectl get pods -n metocast"

# Logs de um pod
ssh k8s-control "kubectl logs -n metocast <pod> --previous"

# Trigger manual do deploy
# GitHub → Actions → Build and Deploy → Run workflow

# RadosGW no Proxmox
ssh root@100.117.249.36 "systemctl status ceph-radosgw@rgw.pve"
```
