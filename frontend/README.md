# Transaction Processor Frontend

This is the frontend application for the Transaction Processor, built with React and TypeScript. It provides a user interface for uploading transaction files, viewing transaction lists, and visualizing transaction data through charts.

## Features

- Upload CSV files to process transactions
- Filter transactions by account name, type, and date range
- View transaction details in a paginated list
- Visualize transaction data with interactive charts

## Prerequisites

- Node.js (version 20.10.0 or later)
- npm (comes with Node.js)

## Installation

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

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Project Structure

- `src/`: Main source directory
  - `components/`: React components
  - `types/`: TypeScript type definitions
  - `lib/`: API and utility functions
  - `styles/`: CSS and styling files

## Technologies Used

- React
- TypeScript
- Chart.js (for data visualization)
- Zod (for schema validation)
