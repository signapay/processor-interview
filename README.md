# Card Transaction Processor

A full-stack application for processing and reporting credit card transactions. This application allows users to upload transaction files in various formats (CSV, JSON, XML) and provides comprehensive reporting capabilities.

## Features

- **Transaction Processing**
  - Support for multiple file formats (CSV, JSON, XML)
  - Credit card validation and type detection
  - Automatic rejection of invalid transactions

- **Reporting Dashboard**
  - Volume by Card Type (Visa, Mastercard, Amex, Discover)
  - Volume by Individual Card
  - Daily Transaction Volume
  - Rejected Transactions List

## Tech Stack

- **Frontend**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React

- **Backend**
  - Bun.js
  - TypeScript
  - Elysia (Web Framework)
  - Drizzle ORM
  - PostgreSQL

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker Compose

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd signapay-processor-interview
   ```

2. Start the application:
   ```bash
   docker compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

### Development Setup

1. Install dependencies:
   ```bash
   # Server
   cd server
   bun install

   # Client
   cd ../client
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.docker` to `.env` in both server and client directories
   - Update the variables as needed

3. Start the development servers:
   ```bash
   # Server
   cd server
   bun run dev

   # Client
   cd ../client
   npm run dev
   ```

### Production Setup

The application includes production-ready Docker configurations that use multi-stage builds to create optimized production images.

1. Build the production images:
   ```bash
   # Build all services
   docker compose build --target prod

   # Or build individual services
   docker compose build --target prod server
   docker compose build --target prod client
   ```

2. Set up production environment variables:
   - Copy `.env.docker` to `.env.prod` in both server and client directories
   - Update the variables with production values
   - Ensure to set appropriate production values for:
     - Database credentials
     - API endpoints
     - Security settings

3. Run in production mode:
   ```bash
   # Start all services in production mode
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

   # Or start individual services
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d server
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d client
   ```

4. Production considerations:
   - The production build uses optimized images with minimal dependencies
   - Static assets are pre-built and served efficiently
   - Database connections are configured for production use
   - Logging is configured for production environments
   - Health checks are enabled for container orchestration

## Known Limitations and Future Improvements

### Current Limitations

1. **Credit Card Validation**
   - The current implementation uses a basic Luhn algorithm for credit card validation
   - No BIN (Bank Identification Number) validation
   - No specific length validation per card type
   - No real-time card validation against payment networks

2. **Transaction Processing**
   - No support for batch processing of large files
   - No progress tracking for large file uploads
   - No retry mechanism for failed transactions
   - No transaction deduplication beyond basic cardNumber, timestamp and amount checks

3. **Security**
   - Basic API authentication not implemented
   - No rate limiting
   - No input sanitization beyond basic validation

### Planned Improvements

1. **Enhanced Validation**
   - Implement proper BIN validation
   - Add card type-specific validation rules
   - Integrate with payment network APIs for real-time validation

2. **Performance**
   - Implement streaming for large file processing
   - Add background job processing for large files
   - Implement proper database indexing
   - Add caching layer for frequently accessed reports

3. **Security**
   - Add authentication
   - Implement rate limiting
   - Add input sanitization
   - Implement proper error handling and logging

4. **User Experience**
   - Add real-time progress tracking for file uploads
   - Implement better error messages
   - Add data export functionality
   - Add more detailed transaction reports

5. **Testing**
   - Add end-to-end tests using Cypress or Playwright
   - Implement frontend unit tests with React Testing Library
   - Add integration tests for API endpoints
   - Set up continuous integration for automated testing
   - Add performance testing for large file uploads
   - Implement test coverage reporting

6. **Production Setup**
   - Complete the production Docker configuration with proper multi-stage builds
   - Add production-specific environment configurations
   - Implement proper logging and monitoring in production
   - Set up health checks for container orchestration
   - Configure production database optimizations
   - Add deployment documentation for cloud providers
   - Implement proper SSL/TLS configuration
   - Set up automated backups for the database
