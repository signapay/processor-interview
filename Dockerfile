FROM oven/bun:1.2 as base

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY server/package.json ./server/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && bun run build

# Generate Prisma client
RUN cd server && bunx prisma generate

# Set entrypoint script
COPY server/scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["bun", "start"]
