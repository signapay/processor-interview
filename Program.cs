using CompanyNS.TransactionProcessor.RecordParsing;
using CompanyNS.TransactionProcessor.Repository;

class Program
{
    static void Main(string[] args)
    {
        var parser = new Format1TransactionRecordParser();
        var repo = new InMemoryTransactionRepository();

        string? command;

        do
        {
            Console.Write("\nCommand (? for help): ");
            command = Console.ReadLine();
            if (command == null)
                break;

            if (command == "")
                continue;

            command = command.ToLower();
            switch (command)
            {
                case "?":
                    showCommands();
                    break;

                case "reset":
                    reset(repo);
                    break;

                case "quit":
                    // Do nothing...loop condition will handle this
                    break;

                default:
                    if (processFile(command, parser, repo))
                        generateReports(repo);
                    break;
            }
        } while (command != "quit");
    }

    static void showCommands()
    {
        Console.WriteLine("Commands:");
        Console.WriteLine("\treset\t\t\tResets the system");
        Console.WriteLine("\tquit\t\t\tExits the program");
        Console.WriteLine("\t<filename>\t\tEnters the transactions from <filename> into the system and generates summary reports");
        Console.WriteLine();
    }

    static void reset(ITransactionRepository repo)
    {
        repo.Clear();
    }

    static bool processFile(string filename, ITransactionRecordParser parser, ITransactionRepository repo)
    {
        try
        {
            using (StreamReader reader = new StreamReader(filename))
            {
                string? line;
                while ((line = reader.ReadLine()) != null)
                {
                    line = line.Trim();
                    if (line.Length == 0)
                        continue;

                    var record = parser.Parse(line);
                    repo.Add(record);
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.ToString());
            return false;
        }

        return true;
    }

    static void generateReports(ITransactionRepository repo)
    {
        var delinquentAccounts = generateAccountReport(repo);
        generateDelinquentAccountsReport(delinquentAccounts);
        generateBadTransactionsReport(repo);
    }

    /**
     * Produces list of delinquent accounts to avoid having to reiterate through all
     * of the cards.
     */
    static HashSet<string> generateAccountReport(ITransactionRepository repo)
    {
        var delinquentAccounts = new HashSet<string>();

        // Chart of accounts, the cards on those accounts, and the card balance
        //  Account1
        //          Card1   Balance1
        //          Card2   Balance2
        //  Account2
        //          Card3   Balance3

        Console.WriteLine("--ACCOUNTS--");
        var accounts = repo.ListAccounts();
        foreach (var account in accounts)
        {
            var cards = repo.ListCardsByAccount(account);
            Console.WriteLine($"Account: {account}");
            Console.WriteLine("\tCards:");
            foreach (var card in cards)
            {
                var balance = repo.GetBalance(card);
                Console.WriteLine($"\t{card}\t{balance}");

                if (balance < 0)
                    delinquentAccounts.Add($"{account}: {card} (Balance: {balance})");
            }
            Console.WriteLine("--\n");
        }
        Console.WriteLine("--END: ACCOUNTS--");

        return delinquentAccounts;
    }

    static void generateDelinquentAccountsReport(HashSet<string> delinquentAccounts)
    {
        Console.WriteLine("\n--DELINQUENT ACCOUNTS--");
        foreach (var account in delinquentAccounts)
            Console.WriteLine(account);

        Console.WriteLine("--END: DELINQUENT ACCOUNTS--");
    }

    static void generateBadTransactionsReport(ITransactionRepository repo)
    {
        // List of bad transactions
        Console.WriteLine("\n--BAD TRANSACTIONS--");
        foreach (var badRecord in repo.GetBadTransactions())
            Console.WriteLine(badRecord.badRawData);

        Console.WriteLine("--END: BAD TRANSACTIONS--");
    }
}
