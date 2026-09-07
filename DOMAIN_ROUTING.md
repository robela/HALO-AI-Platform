# HALO Africa Domain Routing

## Recommended deployment split

Deploy the HALO Africa public website and EAIOS as separate Cloud Run services.

| Surface | Purpose | Recommended service | Recommended hostname |
|---|---|---|---|
| HALO public website | Landing page, products, company info, contact/demo | `halo-africa-site` | `haloafrica.org` or `www.haloafrica.org` |
| HALO website staging | Preview the public site before release | `halo-africa-site-staging` | `staging.haloafrica.org` |
| EAIOS app | Login, dashboard, admin, documents, workflows | `enterprise-ai-frontend` or `enterprise-ai-frontend-staging` | `app.haloafrica.org` |
| EAIOS backend | API for the EAIOS app | `enterprise-ai-backend` or `enterprise-ai-backend-staging` | `api.haloafrica.org` |

## User flow

1. Visitors land on `haloafrica.org`.
2. They browse products on the HALO website.
3. The EAIOS product card links to `https://app.haloafrica.org`.
4. The EAIOS frontend talks to the EAIOS backend API.

## Why not combine them in one container

- The HALO site is public marketing content.
- EAIOS is an authenticated product application.
- Separate services keep deployments and rollbacks independent.
- Separate hostnames make routing and ownership clear.

## DNS and Cloud Run mapping

Recommended production mappings:

- `haloafrica.org` -> `halo-africa-site`
- `www.haloafrica.org` -> `halo-africa-site`
- `app.haloafrica.org` -> `enterprise-ai-frontend`
- `api.haloafrica.org` -> `enterprise-ai-backend`

Recommended staging mappings:

- `staging.haloafrica.org` -> `halo-africa-site-staging`
- `staging-app.haloafrica.org` -> `enterprise-ai-frontend-staging`
- `staging-api.haloafrica.org` -> `enterprise-ai-backend-staging`

## Suggested Cloud Run commands

After the HALO site is first deployed, map the custom domains:

```bash
gcloud run domain-mappings create \
  --service=halo-africa-site \
  --domain=haloafrica.org \
  --region=us-central1 \
  --project=main-presence-500410-f8

gcloud run domain-mappings create \
  --service=halo-africa-site \
  --domain=www.haloafrica.org \
  --region=us-central1 \
  --project=main-presence-500410-f8

gcloud run domain-mappings create \
  --service=enterprise-ai-frontend \
  --domain=app.haloafrica.org \
  --region=us-central1 \
  --project=main-presence-500410-f8
```

If you later want a dedicated API domain:

```bash
gcloud run domain-mappings create \
  --service=enterprise-ai-backend \
  --domain=api.haloafrica.org \
  --region=us-central1 \
  --project=main-presence-500410-f8
```

## Repo and directory decision

You do not need to put HALO Africa and EAIOS in the same directory or repository.

Recommended approach:

- Keep `C:\Code\HALO-AI-Platform` as its own deployable website project.
- Keep EAIOS in its current project.
- Link them at the domain and navigation level instead of merging them into one app.
