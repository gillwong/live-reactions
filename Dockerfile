FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

ENV HUSKY=0

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store corepack enable pnpm \
  && pnpm install --frozen-lockfile

RUN pnpm deploy --filter=api /prod/api && \
  pnpm deploy --filter=web /prod/web

FROM base AS api-builder
WORKDIR /app

COPY --from=deps /prod/api ./
RUN corepack enable pnpm && pnpm build

FROM base AS api
RUN apk add --no-cache tini
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nodejs

COPY --from=api-builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=api-builder --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs
EXPOSE 8080
ENV PORT 8080

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "node", "dist/app.js" ]


FROM base AS web-builder
WORKDIR /app

COPY ./web/.env.production.loca[l] ./.env.production.local

COPY --from=deps /prod/web ./
RUN corepack enable pnpm && pnpm build

FROM base AS web
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

RUN mkdir .next \
  && chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=web-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=web-builder --chown=nextjs:nodejs /app/.next/stati[c] ./.next/static
COPY --from=web-builder --chown=nextjs:nodejs /app/publi[c] ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
