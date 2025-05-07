FROM node:20-alpine AS base
WORKDIR /usr/src/client
COPY package.json package-lock.json* ./

FROM base AS dev
RUN npm install
EXPOSE 3001
ENV PORT=3001
CMD ["npm", "run", "dev"]

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /usr/src/client
COPY --from=builder /usr/src/client/package.json .
COPY --from=builder /usr/src/client/package-lock.json .
COPY --from=builder /usr/src/client/.next ./.next
COPY --from=builder /usr/src/client/public ./public
COPY --from=builder /usr/src/client/node_modules ./node_modules

EXPOSE 3001
ENV PORT=3001
CMD ["npm", "run", "start"]
