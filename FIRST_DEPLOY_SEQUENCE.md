# HALO Africa First Deploy Sequence

Run these steps from `C:\Code\HALO-AI-Platform`.

## 0. Preconditions

Make sure:

- the HALO project is pushed to its own GitHub repository
- you are authenticated with `gcloud auth login`
- the target project is `main-presence-500410-f8`

Set the default project:

```bash
gcloud config set project main-presence-500410-f8
```

## 1. Enable required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com
```

## 2. Create Artifact Registry for HALO images

```bash
gcloud artifacts repositories create halo-platform \
  --repository-format=docker \
  --location=us-central1 \
  --description="HALO Africa website images"
```

If it already exists, this command can be skipped.

## 3. First-time staging deploy

This verifies the Dockerfile, Cloud Build config, and Cloud Run service before Git triggers are involved.

```bash
gcloud builds submit . \
  --config=cloudbuild.yaml \
  --substitutions=SHORT_SHA=manual-staging,BRANCH_NAME=develop,_DEPLOY_ENV=staging,_SERVICE_NAME=halo-africa-site-staging
```

After it finishes, get the staging URL:

```bash
gcloud run services describe halo-africa-site-staging \
  --region=us-central1 \
  --format='value(status.url)'
```

Open that URL and verify the HALO site loads.

## 4. Connect the GitHub repository to Cloud Build

Create the GitHub connection:

```bash
gcloud builds connections create github halo-github-connection \
  --region=us-central1
```

This opens/starts the GitHub authorization flow. Complete that first.

Then register the repository resource:

```bash
gcloud builds repositories create halo-ai-platform \
  --remote-uri=https://github.com/YOUR_ORG/HALO-AI-Platform.git \
  --connection=halo-github-connection \
  --region=us-central1
```

Replace `YOUR_ORG` with your actual GitHub org or username.

## 5. Create the staging CI/CD trigger

```bash
gcloud builds triggers create repository \
  --name=deploy-halo-site-staging \
  --region=us-central1 \
  --repository=projects/main-presence-500410-f8/locations/us-central1/connections/halo-github-connection/repositories/halo-ai-platform \
  --branch-pattern=^develop$ \
  --build-config=cloudbuild.yaml
```

## 6. Test the staging trigger

1. Commit a small change on `develop`.
2. Push it.
3. Confirm Cloud Build starts automatically.
4. Verify `halo-africa-site-staging` updates.

## 7. Create the production CI/CD trigger

```bash
gcloud builds triggers create repository \
  --name=deploy-halo-site-production \
  --region=us-central1 \
  --repository=projects/main-presence-500410-f8/locations/us-central1/connections/halo-github-connection/repositories/halo-ai-platform \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml
```

## 8. First-time production deploy

You can either merge `develop` into `main` and let the trigger deploy, or run a one-time manual production deploy first.

Manual production deploy:

```bash
gcloud builds submit . \
  --config=cloudbuild.yaml \
  --substitutions=SHORT_SHA=manual-prod,BRANCH_NAME=main,_DEPLOY_ENV=production,_SERVICE_NAME=halo-africa-site
```

Then inspect the production URL:

```bash
gcloud run services describe halo-africa-site \
  --region=us-central1 \
  --format='value(status.url)'
```

## 9. Production domain cutover

Map the public domains after production is verified.

```bash
gcloud run domain-mappings create \
  --service=halo-africa-site \
  --domain=haloafrica.org \
  --region=us-central1

gcloud run domain-mappings create \
  --service=halo-africa-site \
  --domain=www.haloafrica.org \
  --region=us-central1
```

For staging:

```bash
gcloud run domain-mappings create \
  --service=halo-africa-site-staging \
  --domain=staging.haloafrica.org \
  --region=us-central1
```

## 10. Map EAIOS app and API under the same brand

Production:

```bash
gcloud run domain-mappings create \
  --service=enterprise-ai-frontend \
  --domain=app.haloafrica.org \
  --region=us-central1

gcloud run domain-mappings create \
  --service=enterprise-ai-backend \
  --domain=api.haloafrica.org \
  --region=us-central1
```

Staging:

```bash
gcloud run domain-mappings create \
  --service=enterprise-ai-frontend-staging \
  --domain=staging-app.haloafrica.org \
  --region=us-central1

gcloud run domain-mappings create \
  --service=enterprise-ai-backend-staging \
  --domain=staging-api.haloafrica.org \
  --region=us-central1
```

## 11. Normal release flow after setup

After all of the above is in place:

1. Push to `develop` to update `halo-africa-site-staging`
2. Validate staging
3. Merge to `main`
4. Push `main`
5. Cloud Build deploys `halo-africa-site`

## Recommended order summary

1. Enable APIs
2. Create Artifact Registry
3. Manual staging deploy
4. Connect GitHub repo
5. Create staging trigger
6. Test staging trigger
7. Create production trigger
8. Manual production deploy or merge-to-main deploy
9. Map production domain
10. Map EAIOS subdomains
