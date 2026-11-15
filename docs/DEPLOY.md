# Deploy (eli + Cloudflare Tunnel)

```
push to main ─▶ GitHub Actions (self-hosted runner on eli, label `eli`)
                 npm ci && npm run build && rsync -a --delete dist/ /var/www/rtcbellevue/dist/
visitor ─▶ Cloudflare (TLS) ─▶ cloudflared tunnel on eli ─▶ nginx 127.0.0.1:8081 ─▶ /var/www/rtcbellevue/dist
```
No open ports, no origin certificates, no deploy secrets.

## Current setup (done 2026-11-14)
- **DNS**: `rtcbellevue.com` is a zone in **RTC's own Cloudflare account** (nameservers `aisha`/`alberto.ns.cloudflare.com`).
  Registration is still at Squarespace Domains (ex-Google Domains); can be transferred to Cloudflare Registrar later.
  Guy is a member of that account.
- **Nginx on eli**: `/etc/nginx/sites-available/rtcbellevue` (= `deploy/nginx-rtcbellevue.conf`) +
  `/etc/nginx/snippets/rtcbellevue-redirects.conf` (= `deploy/nginx-redirects.conf`), listening on `127.0.0.1:8081`.
  Web root `/var/www/rtcbellevue/dist`. **Deploys don't touch nginx config** — after changing a file in `deploy/`:
  `git pull && sudo cp deploy/nginx-rtcbellevue.conf /etc/nginx/sites-available/rtcbellevue && sudo cp deploy/nginx-redirects.conf /etc/nginx/snippets/rtcbellevue-redirects.conf && sudo nginx -t && sudo systemctl reload nginx`
- **Runner**: `eli-rtcbellevue` (label `eli`) in `~/actions-runner-rtcbellevue`, running as a service (`sudo ./svc.sh status`).
- **Tunnel**: `rtcbellevue`, a dashboard-managed tunnel in RTC's Cloudflare account (Zero Trust → Networks → Tunnels).
  On eli it runs as its own unit `cloudflared-rtcbellevue.service` (token in `/etc/cloudflared/rtcbellevue.env`),
  separate from eli's other tunnels. Public hostnames are configured in the dashboard → `http://localhost:8081`.
- **Live since 2026-11-14**: `www` + apex are tunnel public hostnames; `phone` is a tunnel hostname too (chat widget).
- **Preview**: https://preview.rtcbellevue.com (served from eli; nginx sends `X-Robots-Tag: noindex` for any host other than (www.)rtcbellevue.com).

## Go-live (done 2026-11-14 — kept for reference/rollback)
Email is unaffected: MX/SPF/DKIM/DMARC already live in Cloudflare unchanged.
1. Cloudflare → DNS: delete the 4 Squarespace `A` records on `rtcbellevue.com` and the `www` CNAME → `ext-sq.squarespace.com`.
2. Tunnel → Public Hostnames: add `www.rtcbellevue.com` and `rtcbellevue.com` → HTTP `localhost:8081` (this creates the proxied CNAMEs).
3. SSL/TLS: "Always Use HTTPS" on.
4. Verify: https://www.rtcbellevue.com loads from eli; apex redirects to www; old URLs redirect; `phone.rtcbellevue.com` chat widget on /contact-us;
   contact form (FormSubmit may ask for activation once for the live domain); add `rtcbellevue.com` in Plausible.
5. Rollback = delete the two public hostnames and re-add the old records (see `deploy/dns-snapshot-2026-11-14.md`). Takes effect in about a minute.
6. After ~2 weeks: cancel the Squarespace **website** plan (not the domain; keep auto-renew on, or transfer it to Cloudflare).
