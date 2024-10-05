# Transaction Processor

This application has been created as my submission for the code challenge outlined in [Code-Challenge-Instructions.md](Code-Challenge-Instructions.md).

## Standing up the project

This project is a standalone Next.js application which does not require any additional setup beyond the standard. To get up and running, simply clone the repo and run the following commands:

```
cd nextjs
npm install
npm run dev
```

## Packages of note

Beyond the standard Next/Tailwind setup and dependencies this project also implements the following:

- Zustand for state management
- Shadcn for UI components and style cohesion
- Papaparse for CSV parsing

## Functional Requirements, MoSCoW style

Let's outline the functional requirements (and wishes!) for this project using the MoSCoW method. These will be checked off and refactored as we go.

### Must Have

- [ ] File Pool -> Management: CSV transaction files can be uploaded to or removed from the file pool to populate the transactions being reported on.

- [ ] Transaction Summary -> Cards by Account with Balance report.

- [ ] Transaction Summary -> Accounts for Collections report.

- [ ] Transaction Summary -> Bad transactions report.


### Should Have

- [ ] File Pool -> Bad Transactions: Invalid transactions are surfaced for any files that have transactions that cannot be parsed.

- [ ] Transaction Summary -> Accounts for Collections download to CSV. 

### Could Have

- [ ] File Pool: Drag & Drop file upload

### Won't Have

- [ ] Session Saving