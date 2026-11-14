# rtcbellevue.com DNS before the move (public lookup, 2026-11-14)

Nameservers: ns-cloud-b1..b4.googledomains.com (Google Domains → now Squarespace Domains). DNSSEC: off (no DS record).

| Type | Name | Value | Keep? |
|---|---|---|---|
| A | @ | 198.185.159.144, .145, 198.49.23.144, .145 | **No** — Squarespace site; replaced by tunnel CNAME |
| CNAME | www | ext-sq.squarespace.com | **No** — replaced by tunnel CNAME |
| MX | @ | 1 smtp.google.com | **Yes** — Google Workspace mail (DNS only) |
| TXT | @ | `v=spf1 include:_spf.google.com ~all` | **Yes** |
| TXT | _dmarc | `v=DMARC1; p=none;` | **Yes** |
| TXT | google._domainkey | `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA393j4RIuOfISh9qCjzRA9MomqHjEITHMaFjy+Nn9QkZk/hZU88MsEwZZVzZO2WWZ28DfAy7ugXJjUKvv6BwdfUDIqd480tkO//+0/tu9jVZvsIGY0XH/BUGvHuDeb/WVW84TY4aQNxDXovS/R4ZXi62dPND2jp3/EjSvMscy9KOXcLjEA1JkjyMtMc8WhST21GPctICk4PJs2LpwnpUvxLOUpUZYxM5ZwkGsjUHvPnxB1NM9VbTNeDQ96U6z+pf2cnfp1XSOYuv7MgMtJbHVzW8JQHArSnhIVzO5dMLV1veMgVt1pg3w/UROI8+Rqx2coSjIRUbrIRUQQMDA77GGtQIDAQAB` | **Yes** (one string; DNS shows it split in two) |
| CNAME | phone | holdens-box.duckdns.org | **Yes** — chat widget on /contact-us; keep **DNS only** (grey cloud) |
| CNAME/TXT | _domainconnect | _domainconnect.domains.squarespace.com | No — Squarespace-only |

Public lookups only see names we know to ask for. Before switching nameservers, compare against the full
record list in the Squarespace Domains DNS panel (it may hold records not listed here).
