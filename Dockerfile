# syntax=docker/dockerfile:1.6
# ---------- 1) deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- 2) build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

# ---------- 3) runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3030

# usuario no-root
RUN addgroup -g 1001 nodejs && adduser -S -u 1001 -G nodejs nestjs

COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json

# Multer (eventos.controller.ts) crea ./uploads/eventos en el bootstrap.
# Hasta migrar todo a MinIO, dejamos el directorio listo y owned by nestjs.
RUN mkdir -p /app/uploads/eventos && chown -R nestjs:nodejs /app/uploads

USER nestjs
EXPOSE 3030

# La app valida JWT_SECRET y demás envs al boot — si falla, crashea visible.
CMD ["node", "dist/main.js"]
