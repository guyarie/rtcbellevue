# Deploy (eli + Cloudflare Tunnel)

```
push to main ─▶ GitHub Actions (self-hosted runner on eli, label `eli`)
                 npm ci && npm run build && rsync -a --delete dist/ /var/www/rtcbellevue/dist/
visitor ─▶ Cloudflare (TLS) ─▶ cloudflared tunnel on eli ─▶ nginx 127.0.0.1:8081 ─▶ /var/www/rtcbellevue/dist
```
No open ports, no origin certificates, no deploy secrets.

## One-time setup on eli
1. Web root: `sudo mkdir -p /var/www/rtcbellevue/dist && sudo chown -R <runner-user> /var/www/rtcbellevue`
2. Nginx: install `deploy/nginx-rtcbellevue.conf` (site) and `deploy/nginx-redirects.conf`
   (as `/etc/nginx/snippets/rtcbellevue-redirects.conf`); `sudo nginx -t && sudo systemctl reload nginx`.
   Check: `curl -H 'Host: www.rtcbellevue.com' http://127.0.0.1:8081/claire`.
3. Runner: GitHub repo → Settings → Actions → Runners → New self-hosted runner; install on eli
   with label `eli`, as a service. Needs `node` 22 (via setup-node) and `rsync`.
4. Tunnel: add the ingress rules from `deploy/cloudflared-ingress.example.yml` to eli's
   cloudflared config and restart cloudflared. DNS routes only after the domain is on Cloudflare.

## DNS cutover
See `docs/MIGRATION_PLAN.md` Phase 7. Records that must survive the move:
- MX `smtp.google.com` (Google Workspace — therapy@ email), SPF TXT `v=spf1 include:_spf.google.com ~all`,
  DKIM `google._domainkey`, DMARC, any verification TXT.
- **`phone.rtcbellevue.com` CNAME → `holdens-box.duckdns.org`** (chat widget embedded on /contact-us).
