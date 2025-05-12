# Etapa 1: compilar TypeScript
FROM node:22 AS builder
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
COPY .env .env
RUN npm install

# Copiar el resto del código
COPY . .
RUN npm run build

# Etapa 2: imagen para producción
FROM node:22
WORKDIR /app

# Copiar solo lo necesario desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY .env .env
RUN npm install --omit=dev

EXPOSE 3030
CMD ["npm", "start"]
