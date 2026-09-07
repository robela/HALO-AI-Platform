# HALO Africa Site Deploy Commands

Run these commands from `C:\Code\HALO-AI-Platform`.

## 1. One-time setup

Enable required services:

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  --project=main-presence-500410-f8
```

Create the Artifact Registry repository used by [cloudbuild.yaml](c:/Code/HALO-AI-Platform/cloudbuild.yaml):

```bash
gcloud artifacts repositories create halo-platform \
  --repository-format=docker \
  --location=us-central1 \
  --description="HALO Africa website images" \
  --project=main-presence-500410-f8
```

## 2. Manual staging deploy

This is the fastest first deploy before setting up triggers:

```bash
gcloud builds submit . \
  --config=cloudbuild.yaml \
  --substitutions=SHORT_SHA=manual-staging,BRANCH_NAME=develop,_DEPLOY_ENV=staging,_SERVICE_NAME=halo-africa-site-staging \
  --project=main-presence-500410-f8
```

## 3. Manual production deploy

```bash
gcloud builds submit . \
  --config=cloudbuild.yaml \
  --substitutions=SHORT_SHA=manual-prod,BRANCH_NAME=main,_DEPLOY_ENV=production,_SERVICE_NAME=halo-africa-site \
  --project=main-presence-500410-f8
```

## 4. Create GitHub-backed Cloud Build triggers

If your GitHub repo is not connected yet, create the connection first:

```bash
gcloud builds connections create github halo-github-connection \
  --region=us-central1 \
  --project=main-presence-500410-f8
```

Create the repository resource after authorizing the connection in the browser:

```bash
gcloud builds repositories create halo-ai-platform \
  --remote-uri=https://github.com/YOUR_ORG/HALO-AI-Platform.git \
  --connection=halo-github-connection \
  --region=us-central1 \
  --project=main-presence-500410-f8
```

Create the staging trigger:

```bash
gcloud builds triggers create repository \
  --name=deploy-halo-site-staging \
  --region=us-central1 \
  --repository=projects/main-presence-500410-f8/locations/us-central1/connections/halo-github-connection/repositories/halo-ai-platform \
  --branch-pattern=^develop$ \
  --build-config=cloudbuild.yaml \
  --project=main-presence-500410-f8
```

Create the production trigger:

```bash
gcloud builds triggers create repository \
  --name=deploy-halo-site-production \
  --region=us-central1 \
  --repository=projects/main-presence-500410-f8/locations/us-central1/connections/halo-github-connection/repositories/halo-ai-platform \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml \
  --project=main-presence-500410-f8
```

## 5. Cloud Run service URLs

Inspect the deployed services:

```bash
gcloud run services describe halo-africa-site-staging \
  --region=us-central1 \
  --format='value(status.url)' \
  --project=main-presence-500410-f8

gcloud run services describe halo-africa-site \
  --region=us-central1 \
  --format='value(status.url)' \
  --project=main-presence-500410-f8
```

## 6. Custom domain mappings

Production:

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
```

Staging:

```bash
gcloud run domain-mappings create \
  --service=halo-africa-site-staging \
  --domain=staging.haloafrica.org \
  --region=us-central1 \
  --project=main-presence-500410-f8
```

EAIOS app and API mappings:

```bash
gcloud run domain-mappings create \
  --service=enterprise-ai-frontend \
  --domain=app.haloafrica.org \
  --region=us-central1 \
  --project=main-presence-500410-f8

gcloud run domain-mappings create \
  --service=enterprise-ai-backend \
  --domain=api.haloafrica.org \
  --region=us-central1 \
  --project=main-presence-500410-f8
```