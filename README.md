# Transaction Processor

## Context

This project is a transaction processor that accepts CSV files containing transaction data, processes the transactions, and provides various reports. It includes functionalities for uploading CSV files, processing transactions, generating reports, and handling bad transactions.

## Features

- Upload and parse CSV files
- Process transactions: Credit, Debit, and Transfer
- Generate reports for accounts, collections, and invalid transactions
- Basic authentication using a secret token

## Prerequisites

- Node.js (>= 12.x)
- npm

## Setup

### 1. Clone the Repository

- Clone repository.
- cd-processor-interview

### 2. Install dependencies

- npm install

### 3. Environment Variables

- Create a .env file in the root directory and set the required environment variables. Use the provided .env.example as a reference.
- cp .env.example .env
- Edit the .env file to include your secret keys:

### 4. Directory and File Setup

Ensure that the required directories and files are present. The application will automatically create them if they do not exist:

- public/data/uploads.json
- public/uploads

### 5. Running the Application

- npm run dev
- This will start the application on http://localhost:3000.

### 6. Authentication

- The application uses a basic token-based authentication system. To make authenticated requests to the backend API, include the Authorization header with the token:
- Authorization: Bearer your-public-auth-token

### 7. Uploading Files

You can upload CSV files through the provided UI at the root URL. The application will process the files and generate reports accordingly.

### 8. Reset

Reset will clear all files uploaded.

## API Endpoints

### Upload File
  - Endpoint: /api/upload
  - Method: POST
  - Headers:
    - Authorization: Bearer your-public-auth-token
    - Body: FormData with the CSV file

### Reset Uploads
  - Endpoint: /api/upload
  - Method: DELETE
  - Headers:
    - Authorization: Bearer your-public-auth-token


## Sample Data Files

The repository includes sample CSV files for testing purposes:
test.csv - A smaller file with sample transactions
data.csv - A larger file with more transactions, including some invalid ones

## Tests

To run tests, use the following command:
- npm test