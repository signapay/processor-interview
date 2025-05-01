# Prisma Database Setup

This directory contains the Prisma schema and database configuration for the application.

## Setup

1. Make sure you have PostgreSQL installed and running
2. Create a `.env` file in the server directory with your database connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/processorinterviewdb"
PORT=3000
```

3. Run the database setup script:

```bash
bun run db:setup
```

This will:
- Generate the Prisma client
- Create and apply migrations

## Development

### Prisma Studio

To view and edit your database using Prisma Studio:

```bash
bun run prisma:studio
```

### Creating Migrations

After changing the schema, create a new migration:

```bash
bun run prisma:migrate -- --name your_migration_name
```

### Generating Prisma Client

If you only need to update the Prisma client:

```bash
bun run prisma:generate
```

## Docker Setup

When running with Docker, the database connection string in the container will use:

```
DATABASE_URL="postgresql://user:password@db:5432/processorinterviewdb"
```

This is configured in the `compose.yml` file.

## Schema

The current schema includes:

- `User`: For authentication
- `Transaction`: For processed transactions
- `RejectedTransaction`: For tracking rejected transaction records

## Best Practices

1. Always use migrations for schema changes
2. Keep sensitive data encrypted (e.g., card numbers)
3. Use transactions for operations that need to be atomic
4. Add proper indexes for frequently queried fields
