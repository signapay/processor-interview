FROM oven/bun:latest AS base
WORKDIR /usr/src/server
COPY package.json bun.lock ./
RUN bun install
COPY . .

FROM base AS dev
CMD ["bun", "run", "dev"]
EXPOSE 3000

FROM base AS prod
RUN bun run build
CMD ["./dist/server"]
EXPOSE 3000
