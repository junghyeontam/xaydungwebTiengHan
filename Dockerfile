# Multi-Surface Monorepo Dockerfile
# Build target via: docker build --build-arg APP_NAME=web -t junghyeon-web .
#                   docker build --build-arg APP_NAME=teach -t junghyeon-teach .
#                   docker build --build-arg APP_NAME=admin -t junghyeon-admin .

ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9 --activate

# Stage 1: Prune monorepo for target app
FROM base AS builder
ARG APP_NAME=web
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy workspace source files
COPY . .

# Install dependencies and build target app
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @junghyeon/${APP_NAME} run build

# Stage 2: Minimal Production Runner
FROM base AS runner
ARG APP_NAME=web
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and built next runtime
COPY --from=builder /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/${APP_NAME}/server.js"]
