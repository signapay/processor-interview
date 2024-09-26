# Transaction Processor

This project is a **transaction processing system** built using **Remix**, **React**, **Node.js (Express)**, **Redis**, and **TypeScript**. The application processes financial transactions from a CSV file, groups the data by accounts and cards, handles collections, and manages bad transactions. It includes features like file upload, persistence during the run, and a reporting system.

## Features

- **UI for uploading transaction files**.
- **Processing of CSV transaction files**:
  - Accounts grouped by card numbers and balances.
  - Collections (accounts with cards in debt).
  - Reporting of bad transactions (errors during parsing or validation).
- **Persistence** during the application's run using in-memory caching or Redis.
- **Reset functionality** to clear all processed data.
- **Pagination** for large datasets.
- **Built with Remix and TypeScript** for server-side rendering and type safety.

## Prerequisites

Before starting, ensure you have the following installed on your local machine:

- **Node.js**: v16.x.x or later
- **npm**: v7.x.x or later
- **Redis** (for persistence)
- **Postgres** (optional)

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   This will install both the server and the client-side dependencies.

3. **Environment Configuration**:

   Create a `.env` file in the root of your project to define the environment variables needed for running the application:

   ```bash
   //Check config/config.json for env vars

   NODE_ENV=development
   PORT=4000
   REDIS_URL=redis://localhost:6379
   ```

   You may modify the port, Redis URL, or other settings according to your setup.

## Additional Information
```bash
- Find the .env values inside the config/config.json directory.
- npm run dev will concurrently start the node and remix servers.
- redis keys are stored in two different formats for optimization.
- remove any "debugger" if present.
- Both vite and remix.config are configured for build
```

## Running the Project

There are two main modes for running this project: development and production.

### Development Mode

To run the project in development mode, use the following command:

```bash
npm run dev
```
