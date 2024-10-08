import { TransactionCollection } from "@/app/lib/Transactions/TransactionCollection";
import { processTransactionsFromCSV } from "@/app/utils/csvParser";

/**
 * This test harness was created to run general tests.
 * 
 * CSV was constructed programmatically line-by-line to allow commenting to demonstrate the expected behavior.
 */

const transactionCollection = new TransactionCollection();

const csvLines: string[] = [];

// New Debit to unknown card will create a new card in the local account and subtract the value
csvLines.push('AAA,1001,100,Debit,Foo,');

// New Debit of negative value to unknown card will create a new card in the local account with net positive value
csvLines.push('AAA,1002,-100,Debit,Foo,');

// Card can be initialized to 0 with Credit OR Debit
csvLines.push('AAA,1003,0,Debit,Foo,');

// Card can be initialized to 0 with Credit OR Debit
csvLines.push('AAA,1004,0,Credit,Foo,');

// Add some credits to an account
csvLines.push('BBB,1001,1,Credit,Foo,');
csvLines.push('BBB,1001,2,Credit,Foo,');
csvLines.push('BBB,1001,3,Credit,Foo,');
csvLines.push('BBB,1001,4,Credit,Foo,');
csvLines.push('BBB,1001,5,Credit,Foo,');
csvLines.push('BBB,1001,6,Credit,Foo,');
csvLines.push('BBB,1001,7.86,Credit,Foo,');

const csvContents = csvLines.join('\n');

describe('Transfer Scenarios', () => {

    let accountSummary: ReturnType<typeof transactionCollection.getAccountSummary>;

    // TODO: Move this to a helper file
    function testAccountCardBalance(accountName: string, cardNumber: number, expectedBalance: number) {
        it(`${accountName}.${cardNumber} balance = ${expectedBalance}`, () => {
            const account = accountSummary.find(acc => acc.name === accountName);
            expect(account).toBeDefined();
            
            const card = account?.cards.find(c => c.cardNumber === cardNumber);
            expect(card).toBeDefined();
            expect(card?.balance).toBe(expectedBalance);
        });
    }

    beforeAll(async () => {
      const result = await processTransactionsFromCSV(csvContents);
      transactionCollection.addTransactions(result.data);
      accountSummary = transactionCollection.getAccountSummary();
    });

    testAccountCardBalance('AAA', 1001, -100);
    testAccountCardBalance('AAA', 1002, 100);
    testAccountCardBalance('AAA', 1003, 0);
    testAccountCardBalance('AAA', 1004, 0);
    testAccountCardBalance('BBB', 1001, 28.86);

});