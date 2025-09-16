# Use Node.js 18 Alpine image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json files
COPY package.json pnpm-lock.yaml* ./
COPY apps/cms/package.json ./apps/cms/
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install pnpm
RUN npm install -g pnpm

# Build packages
RUN pnpm --filter @triplezerosports/config build
RUN pnpm --filter @triplezerosports/types build

# Build CMS
RUN pnpm --filter cms build

# Production image, copy all the files and run payload
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 payload

# Copy built application
COPY --from=builder --chown=payload:nodejs /app/apps/cms/dist ./dist
COPY --from=builder --chown=payload:nodejs /app/apps/cms/package.json ./package.json
COPY --from=builder --chown=payload:nodejs /app/node_modules ./node_modules

USER payload

EXPOSE 3001

ENV PORT 3001

CMD ["node", "dist/server.js"]
