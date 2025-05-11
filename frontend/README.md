# Card Processor Landing Page

A modern, responsive landing page for a card processing company featuring a transaction management system.


## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation


1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Run the development server:

\`\`\`bash
npm run build && npm run start

\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Usage

### Viewing Transactions

The landing page includes a transaction table that displays:
- Card number (only first three digits visible)
- Date of the transaction
- Transaction amount (positive or negative)

### Uploading Transaction Files

You can upload your own transaction data using the file upload feature:

1. Click the "Upload File" button
2. Select your file (CSV, JSON, or XML format)
3. The transaction table will update with your data

## Server Response Format

The application expects the server to return transaction data in the following format:

\`\`\`json
{
  "cardNumber1": {
    "YYYY-MM-DD": [amount],
    "YYYY-MM-DD": [amount]
  },
  "cardNumber2": {
    "YYYY-MM-DD": [amount],
    "YYYY-MM-DD": [amount]
  }
}
\`\`\`

Where:
- `cardNumber` is the full card number
- `YYYY-MM-DD` is the date of the transaction
- `amount` is the transaction amount (positive for credits, negative for debits)

## Building for Production

To build the application for production:

\`\`\`bash
npm run build
\`\`\`

To start the production server:

\`\`\`bash
npm start
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx           # Main landing page
│   └── layout.tsx         # Root layout
├── components/
│   ├── hero-section.tsx   # Hero section component
│   ├── transaction-section.tsx # Transaction section wrapper
│   ├── transaction-table.tsx   # Transaction table component
│   └── file-upload.tsx    # File upload component
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts           # Utility functions
└── public/
    └── ...                # Static assets
\`\`\`


