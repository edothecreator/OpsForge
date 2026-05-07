# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Only install production dependencies
RUN npm ci --omit=dev

# --- Stage 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
# Install everything (including Nx and compilers)
RUN npm ci
COPY . .
RUN npx nx build @opsforge/api --prod

# --- Stage 3: Runner ---
FROM node:20-alpine AS runner
# Security: Don't run as root
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D appuser
WORKDIR /app

# Copy production node_modules and built code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/api ./

USER appuser
EXPOSE 3000

# Healthcheck for Docker Engine
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "main.js"]

CMD ["node", "main.js"]