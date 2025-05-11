# Transaction Proceassor API

A TypeScript API structured with Onion Architecture and designed to run as an AWS Lambda function.

## Project Structure

```
src/
├── domain                # Domain entities (pure business logic)
│   └── entities
├── application           # Interfaces for use cases (contracts)
│   └── services
├── infrastructure        # Implementations of use cases
│   └── services
├── interfaces            # Controllers/adapters for Lambda
│   └── controllers
└── lambda.ts             # Lambda entry point

__tests__/                # Unit tests
serverless.yml            # Configuration for AWS deployment and offline testing
```

## Running Locally

1. **Install dependencies:**
```bash
npm install
```

2. **Build the TypeScript project:**
```bash
npm run build
```

3. **Start the server locally (with Serverless Offline):**
```bash
npm run start:offline
```
Visit `http://localhost:3000/dev/process`

4. **Run tests:**
```bash
npm test
```

## Endpoint Usage

**POST /process**
- Accepts: `application/json`, `text/csv`, or `application/xml`
- Body must contain transactions with fields:
  - `cardNumber`
  - `timestamp`
  - `amount`

Example `application/json` payload:
```json
[
  { "cardNumber": "4111111111111111", "timestamp": "2025-05-08T10:00:00Z", "amount": 20.5 },
  { "cardNumber": "5111111111111111", "timestamp": "2025-05-08T12:00:00Z", "amount": -5.0 }
]
```

## Behavior
- Groups valid transactions by `cardNumber` and `day`
- Rejects any card numbers that don't start with `3`, `4`, `5`, or `6`

## Deployment
Deployed via AWS Lambda using the Serverless Framework:
```bash
npm run build
serverless deploy
```
