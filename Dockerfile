FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Limpar cache e instalar dependências
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build SSR
RUN npm run build:ssr

# Stage final
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos built do SSR
COPY --from=builder /app/dist/m42hub-client ./dist/m42hub-client
COPY --from=builder /app/package*.json ./

# Instalar apenas dependências de produção
RUN npm install --production --legacy-peer-deps

EXPOSE 4000

# Comando para iniciar o servidor SSR
CMD ["node", "dist/m42hub-client/server/server.mjs"]
