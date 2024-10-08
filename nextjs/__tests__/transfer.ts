import { TransactionCollection } from "@/app/lib/Transactions/TransactionCollection";
import { processTransactionsFromCSV } from "@/app/utils/csvParser";

/**
 * This test harness was created for sorting out the transfer logic as described in AccountManager.ts
 * 
 * CSV was constructed programmatically line-by-line to allow commenting to demonstrate the expected behavior.
 */

const transactionCollection = new TransactionCollection();

const csvLines: string[] = [];

/**
 * TEST "LOCAL FIRST" Transfer logic:
 * 
 * If the target card number exists in the local account, transfer to it.
 */

csvLines.push('AAA,1111,1000,Credit,Foo,');
// AAA.1111: Init Credit to 1000

csvLines.push('BBB,2222,0,Credit,Foo,');
// AAA.1111: 1000
// BBB.2222: Init Credit to 0

csvLines.push('AAA,2222,0,Credit,Foo,');
// AAA.1111: 1000
// AAA.2222: Init Credit to 0
// BBB.2222: 0

csvLines.push('AAA,1111,100,Transfer,Foo,2222');
// AAA.1111: To 2222 Debit 100 to 900
// AAA.2222: From 1111 Credit 100 to 100
// BBB.2222: 0

/**
 * TEST "EXTERNAL SECOND" Transfer logic:
 * 
 * If the target card number doesn't exist in the local account, 
 * try to find the first occurrence of that Card Number in all 
 * Accounts *alphabetically*, transfer to that if found.
 */

csvLines.push('CCC,3333,0,Credit,Foo,');
csvLines.push('DDD,3333,0,Credit,Foo,');
// AAA.1111: 900
// AAA.2222: 100
// BBB.2222: 0
// CCC.3333: Init Credit to 0
// DDD.3333: Init Credit to 0

csvLines.push('AAA,1111,100,Transfer,Foo,3333');
// AAA.1111: To 3333 Debit 100 to 800
// AAA.2222: 100
// BBB.2222: 0
// CCC.3333: From 1111 Credit 100 to 100
// DDD.3333: 0

/**
 * TEST "LOCAL FALLBACK" Transfer logic:
 * 
 * If the target card number doesn't exist in the local account, 
 * and also doesn't exist in any other account, fall back to 
 * creating a new card in the local account.
 */

csvLines.push('AAA,1111,100,Transfer,Foo,4444');
// AAA.1111: To 4444 Debit 100 to 700
// AAA.2222: 100
// AAA.4444: From 1111 Init Credit to 100
// BBB.2222: 0
// CCC.3333: 100
// DDD.3333: 0


// Remind about Chase Money Glitch: We can go negative when "transferring" money
// Even to ourselves.
csvLines.push('AAA,5555,100,Transfer,Foo,6666');
// AAA.1111: 700
// AAA.2222: 100
// AAA.4444: 100
// AAA.5555: To 6666 Init Debit 100 to -100
// AAA.5555: From 5555 Init Credit 100 to 100
// BBB.2222: 0
// CCC.3333: 100
// DDD.3333: 0

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

    testAccountCardBalance('AAA', 1111, 700);
    testAccountCardBalance('AAA', 2222, 100);
    testAccountCardBalance('AAA', 4444, 100);
    testAccountCardBalance('BBB', 2222, 0);
    testAccountCardBalance('CCC', 3333, 100);
    testAccountCardBalance('DDD', 3333, 0);
    testAccountCardBalance('AAA', 5555, -100);
    testAccountCardBalance('AAA', 6666, 100);

});