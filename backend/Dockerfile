FROM node:24.20.0-alpine3.24 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:24.20.0-alpine3.24 AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

RUN apk update && apk add --no-cache libssl3=3.5.8-r0 libcrypto3=3.5.8-r0

COPY --from=builder /app/dist ./dist

RUN rm -rf /usr/local/lib/node_modules/npm            /usr/local/lib/node_modules/corepack            /opt/yarn-v1.22.22     && rm -f /usr/local/bin/npm            /usr/local/bin/npx            /usr/local/bin/corepack            /usr/local/bin/yarn            /usr/local/bin/yarnpkg

EXPOSE 3000

CMD ["node", "dist/index.js"]
