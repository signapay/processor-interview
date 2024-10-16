# Transaction Processor

This project consists of a frontend and a backend for processing transactions. The frontend is built with React, while the backend is built with Node.js and Express, written in TypeScript.

## Frontend

### Overview

The frontend application provides a user interface for uploading transaction files, viewing transaction lists, and visualizing transaction data through charts.

### Features

- Upload CSV files to process transactions
- Filter transactions by account name, type, and date range
- View transaction details in a paginated list
- Visualize transaction data with interactive charts

### Prerequisites

- Node.js (version 20.10.0 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/processor-interview/transaction-processor.git
   cd transaction-processor/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .envrc.example .envrc
   ```

### Available Scripts

- **`npm start`**: Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- **`npm test`**: Launches the test runner in interactive watch mode.
- **`npm run build`**: Builds the app for production to the `build` folder.
- **`npm run eject`**: Removes the single build dependency from your project.

### Project Structure

- `src/`: Main source directory
  - `components/`: React components
  - `types/`: TypeScript type definitions
  - `lib/`: API and utility functions
  - `styles/`: CSS and styling files

### Technologies Used

- React
- TypeScript
- Chart.js (for data visualization)
- Zod (for schema validation)

## Backend

### Overview

The backend is a robust transaction processing system for internal account managers. It provides a CLI interface for file-based processing and a REST API for transaction processing and file uploads.

### Features

- Process transactions from CSV and JSON files
- Generate detailed transaction reports
- CLI interface for file-based processing
- REST API for transaction processing and file uploads
- Robust error handling and input validation

### Prerequisites

- Node.js (version 20.10.0 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/processor-interview/transaction-processor.git
   cd transaction-processor/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .envrc.example .envrc
   ```

4. Give execute permission to the transaction processor script:
   ```bash
   chmod +x .bin/run
   ```

### Usage

#### CLI Mode

Process transactions from a file:

```bash
npm run start:cli -- process <file-path>
```

#### REST API Mode

Start the server:

```bash
npm run start:server
```

### API Endpoints

- `POST /api/process`: Process transactions sent in the request body
- `POST /api/process-transactions`: Process transactions from an uploaded CSV file

### Project Structure

- `transaction-processor/`: Main source directory
  - `features/`: Core processing logic
  - `interfaces/`: CLI and REST API implementations
  - `helpers/`: Utility and Validation functions
  - `types/`: TypeScript type definitions
  - `__tests__/`: Test files

### Technologies Used

- TypeScript
- Express.js
- Zod (for schema validation)
- Jest (for testing)
- csv-parser (for CSV file processing)
- yargs (for CLI argument parsing)
