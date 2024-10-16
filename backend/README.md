# Transaction Processor

A robust transaction processing system for internal account managers.

## Features

- Process transactions from CSV and JSON files
- Generate detailed transaction reports
- CLI interface for file-based processing
- REST API for transaction processing and file uploads
- Robust error handling and input validation

## Prerequisites

- Node.js (version 20.10.0 or later)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/processor-interview/transaction-processor.git
   cd transaction-processor/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .envrc.example .envrc
   ```

4. Give execute permission to the transaction processor script:
   ```
   chmod +x .bin/run
   ```

## Usage

### CLI Mode

Process transactions from a file:

```
npm run start:cli -- process <file-path>
```
Or use the provided script:

```
./.bin/run --cli
```

### Server Mode

Start the REST API server:

```
npm run start:server
```

Or use the provided script:

```
./.bin/run --server
```


## API Endpoints

- `POST /api/process`: Process transactions sent in the request body
- `POST /api/process-transactions`: Process transactions from an uploaded CSV file

## Development

- Run in development mode: `npm run dev`
- Build the project: `npm run build`
- Run tests: `npm test`

## Project Structure

- `transaction-processor/`: Main source directory
  - `features/`: Core processing logic
  - `interfaces/`: CLI and REST API implementations
  - `helpers/`: Utility and Validation functions
  - `types/`: TypeScript type definitions
  - `__tests__/`: Test files

## Technologies Used

- TypeScript
- Express.js
- Zod (for schema validation)
- Jest (for testing)
- csv-parser (for CSV file processing)
- yargs (for CLI argument parsing)

