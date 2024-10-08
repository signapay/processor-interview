# Transaction Processor

This application has been created as my submission for the code challenge outlined in [Code Challenge Instructions](/instructions/README.md)

## Standing up the project

This project is a standalone Next.js application which does not require any additional setup beyond the standard. To get up and running, simply clone the repo and run the following commands:

```
cd nextjs
npm install
npm run dev
```

## Tests

Some tests have been provided to examine Transfer logic and some general tests to establish the testing framework. To run them after standing up the project:

```
cd nextjs
npm test
```


## Packages of note

Beyond the standard Next/Tailwind setup and dependencies this project also implements the following:

- Zustand for state management
- Shadcn for UI components and style cohesion
- Papaparse for CSV parsing

## Functional Requirements, MoSCoW style

Let's outline the functional requirements (and wishes!) for this project using the MoSCoW method. These will be checked off and refactored as we go.

### Must Have

- [x] Transaction Summary -> Cards by Account with Balance report.
- [x] Transaction Summary -> Accounts for Collections report.
- [x] File Pool: Transaction parsing issues will be surfaced.
- [x] File Pool: CSV Files with transactions can be uploaded to populate Transaction Collection      
- [x] File Pool: File Pool can be reset, clearing out files and Transaction Collection


### Should Have

***moved to won't have to represent state at pull request***


### Could Have

***moved to won't have to represent state at pull request***

### Won't Have

- [ ] File Pool -> Management: CSV transaction files can be managed **on an individual basis** (added and removed) to populate the transactions being reported on.
- [ ] File Pool: Drag & Drop file upload
- [ ] Session Saving
- [ ] Transaction Summary -> Accounts for Collections download to CSV. 
