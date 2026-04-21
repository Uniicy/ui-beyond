# syntax=docker/dockerfile:1.7

# ── Stage 1: build storybook-static/ ───────────────────────────────────────
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY . .
RUN bun run build-storybook

# ── Stage 2: serve static build via nginx ──────────────────────────────────
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/storybook-static /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
