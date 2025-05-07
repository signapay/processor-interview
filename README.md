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

3. **Run database migrations:**
   After the containers are up, run the following commands to ensure the database tables are created and up to date:
   ```bash
   # In a new terminal, from the root of the project
   docker compose exec server bunx drizzle-kit generate
   docker compose exec server bunx drizzle-kit push
   ```

4. Access the application:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

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
