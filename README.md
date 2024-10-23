# Transaction Processor
## SignaPay take home coding exercise
This project is the Transaction Processor take home coding exercise for SignaPay's Senior Software Engineer position.
It is a Next.js app with Typescript.
The product is in essence a form that allows a user to upload a .csv file containing transaction data (data shape is specified below), and several sections displaying the data based on certain criteria:
- *All Transactions* shows a table of all uploaded transaction data.
- *Accounts* displays a list of names associated with accounts. Users can click a name and then a table is displayed containing Card Numbers and Account Balances.
- *Collections* is a table listing Card Numbers and Account Balances for cards with a negative balance.
- *Bad Transactions* is a table containing rows of raw data uploaded from the .csv that were unable to be parsed.
- *Reset Form* allows users to clear uploaded files and use the app from a blank state.
- Multiple .csv's can be uploaded in one session, and their data will display *after* already uploaded data.
- Note - *user must click "Submit"* for .csv's to be processed.

-------------------------------------------------------------------------------------
A production version of the app is deployed to Vercel for users to demo.
### [Product Demo](https://processor-interview-w5vn.vercel.app/)
-------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------
The following is a short video demo of the application.
### Video Demo
https://github.com/user-attachments/assets/93e5283a-2cdb-431f-b3a0-109ef5116a00

-------------------------------------------------------------------------------------


## To install
`npm install` within `/transaction-processor` directory

## To run
`npm run build` and `npm run start` within `/transaction-processor` directory

### Note:
  - This is a bit counter intuitive to me, so I noted the following in the `helpers.ts` file to further clarify my understanding of the business logic. The function used to calculate *Account Balance* assumes the *Account Balance* starts at zero. Then each transaction is subtracted from the balance. Meaning, if a *Transaction Amount* value is positive, it will `decrease` the total *Account Balance*. Conversely, *Transaction Amount* values that are negative, will `increase` the total balance.
  
### Potential Improvements:
  - If I were to spend more time improving this app, I would paginate table and/or lazy load data.
  - Fix overlapping table cells when screen real estate is small.
  - Tweak Button's active and selected styles to highlight which feature the user is currently using.

= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =


# *ORIGINAL README BELOW:*

# Transaction Processor

## Context

Thank you for taking a the time to complete our interview code project. We realize that there are many ways to conduct the "technical part" of the interview process from L33T code tests to whiteboards, and each has its own respective pros / cons. We intentionally chose the take-home project approach because we believe it gives you the best chance to demonstrate your skills and knowledge in a "normal environment" - i.e. your computer, keyboard, and IDE.

Our expectation is that this project should take between 3-5 hours of effort. We realize that you have a life outside of this interview process so we do not specify a timeframe in which you need to complete the project. That said, we are generally actively recruiting, so a long delay may result in the opening having already been filled.

You are free to use whatever tech stack you prefer to complete the project. Once your project is complete, the next step in the process is a conversation about why you made the choices you did and a review of your solution. We believe that this conversation is as important as the code itself and provides an opportunity for feedback both ways.

We encourage you to have fun with the project, while producing a solution that you believe accurately represents how you would bring your skillset to the team.

We have attempted to make this repo as clear as possible, but if you have any questions, we encourage you to reach out.

## Project

We would like you to build a transaction processor. In this scenario, the user of your software is an internal account manager, who has been provided a transaction file from one or more of our transaction providers.

We will provide your software with a list of transactions. It needs to process the transactions and provide some reporting information back to the user. We will detail the content of the file and required reporting below.

Beyond these basic requirements, the implementation is up to you.

### Transaction Details

These transactions will contain the following information:

| Field              | Type   | Description                                                       |
| ------------------ | ------ | ----------------------------------------------------------------- |
| Account Name       | Text   | The name of the account                                           |
| Card Number        | Number | The card number used for the transaction, 1:M with account names  |
| Transaction Amount | Number | The amount of the transaction, can be positive or negative        |
| Transaction Type   | Text   | The type of transaction, values can be Credit, Debit, or Transfer |
| Description        | Text   | A brief description of the transaction                            |
| Target Card Number | Number | only provided if the transaction type is a transfer               |

### Functional Requirements

Your solutions needs to provide a system with the following functionality:

- **UI**
  - Accepts a file containing the transactions to process
    - Each file submitted should continue "in continuation of" previous submissions
  - An ability to reset the system to blank (new)
- **Logic** that correctly processes the file
- **Reporting**
  - A chart of accounts that list the account name, its cards, and the amount on each card
  - A list of accounts that we need to give to collections (any cards with a < 0.00 balance)
  - A list of "bad transactions" that someone needs to go look at (any transactions that you were unable to parse)
- **Persistence**
  - Persistence during a "run" of the software is required
    - for example, if you choose to build a nextjs or remix site, we expect that you, at minimum, use an in memory cache that maintains state as long as the process is running
    - Long term persistence such as a database is allowed, but not required.
      - If implemented, be sure that initialization is easy / documented for our review

### Data Files

In this repo, you will find the following csv files:

| File     | Description                                                                                                                                               |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| test.csv | a smaller file that has a few sample transactions - the intent is to use this file for development. like most development resources, this file is "clean" |
| data.csv | a larger file that has a number of transactions - like the real world, you should not assume that this file is not without its "issues"                   |

## Submission

You should fork this repo to your own account and then submit a PR when you are ready for your solution to be evaluated. This workflow closely follows our daily practice of feature branching > PR and following it is required for your submission to be considered "complete".

## Final Thoughts and Hints

- In this scenario, you are the initial architect creating the first pass at this project. You can consider our review the same as a Senior level engineer coming on to the project. Make sure that when we "pick up" the repo, it is clear how to stand up the project, run the solution, and potentially contribute code
- Since you are tackling this specific project, our expectation is that you are at a senior engineer level. While we 100% want your code to represent your preferred style, there are some things we consider "basic" that should be in your submission. These include ideas like the following list. This list is not exhaustive, it is meant to point in a direction:
  - Clear, consistent, readable code
  - Proper use of your selected stack
    - for example, if you choose C#, we would expect to see IOC/DI appropriately implemented
  - DRY
  - Low cyclomatic complexity
  - Low Coupling / High Cohesion
  - Clear thought and patterns for maintainability and expansion
    - This scenario is obviously simplified from reality, that said you should consider future requests like other transaction types, different file formats, etc. - this will at minimum, be a topic in the conversation
- While it should be obvious, this scenario involves "money". This means numerical accuracy is required and at least minimal security should be considered in your submission (we aren't going to "hack your solution", but there shouldn't be open API endpoints either).
- We do NOT expect you to be a designer, we do expect you to consider your user and make the experience intuitive and easy to use

As we said above, if you have any questions, please reach out.
