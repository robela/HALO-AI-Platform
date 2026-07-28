# Stage 1: Build the Vite frontend with a slimmer Debian base.
FROM node:22-bookworm-slim AS builder
WORKDIR /app

ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_API_BASE_URL=http://localhost:8000

ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve the built SPA with an unprivileged nginx image.
FROM nginxinc/nginx-unprivileged:stable-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
