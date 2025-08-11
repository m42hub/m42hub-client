FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build SSR (ajuste o comando para seu projeto)
RUN npm run build:ssr

# Stage final
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist/m42hub-client/server ./server
COPY --from=builder /app/dist/m42hub-client/browser ./browser
COPY --from=builder /app/package*.json ./

RUN npm install --production

EXPOSE 4000

CMD ["node", "server/server.mjs"]
