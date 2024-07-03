export const CREATE_TABLES_QUERY:string = `
                                            DROP TABLE IF EXISTS failed_transactions;
                                            DROP TABLE IF EXISTS transaction_details;
                                            DROP TABLE IF EXISTS account_details;
                                            DROP TABLE IF EXISTS file_history;


                                            CREATE TABLE file_history (
                                            file_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            file_name TEXT,
                                            uploaded_date DATE,
                                            uploaded_by TEXT,
                                            status TEXT
                                            );

                                            CREATE TABLE account_details (
                                            card_number TEXT ,
                                            account_name TEXT,
                                            balance_amt INTEGER,
                                            PRIMARY KEY (card_number, account_name)
                                            );

                                            CREATE TABLE transaction_details (
                                            file_id INTEGER,
                                            transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            account_name TEXT,
                                            card_number TEXT,
                                            amount TEXT,
                                            transaction_type TEXT,
                                            description TEXT,
                                            target_card_number TEXT,
                                            FOREIGN KEY (file_id) REFERENCES file_history(file_id)
                                            );

                                            CREATE TABLE failed_transactions (
                                            file_id INTEGER,
                                            transaction_id INTEGER,
                                            error_msg TEXT,
                                            FOREIGN KEY (file_id) REFERENCES file_history(file_id),
                                            PRIMARY KEY (file_id, transaction_id)
                                            );
                                            ` ;
export const GET_FILE_ID: string = "select seq+1 as fileId from sqlite_sequence WHERE name ='file_history' " ;
export const INSERT_FILE_HISTORY: string =  `Insert into file_history (  file_name, uploaded_date, uploaded_by, status)
                                                 VALUES (?, DateTime('now'), ?, 'Processing')` ;
export const GET_TRANSACTION_ID: string = "select seq+1 as transaction_id from sqlite_sequence WHERE name ='transaction_details' " ;
export const INSERT_TRANSACTION_DETAILS: string =  `INSERT INTO transaction_details (file_id, transaction_id, account_name, card_number, amount, transaction_type, description, target_card_number)
                                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ;
export const GET_TRANSACTIONS: string = 'SELECT * FROM transaction_details';
export const GET_BALANCE_AMT: string = 'SELECT  balance_amt from account_details where card_number=? and account_name=?' ;
export const UPDATE_BALANCE_AMT:string = `update account_details set balance_amt = ? where card_number=? and account_name=?` ;                                                       
export const INSERT_ACCOUNT_DETAILS: string = `INSERT INTO account_details (card_number, account_name, balance_amt )
                                                VALUES (?, ?, ?)`;
export const INSERT_FAILED_TRANSACTIONS: string = `INSERT INTO failed_transactions (file_id, transaction_id, error_msg)
                                                    VALUES (?, ?, ?)`;
export const UPDATE_FILE_HISTORY: string =  `update file_history set status = ? where file_id = ? `;     
export const GET_ACCOUNT_DETAILS: string = 'SELECT * FROM account_details';
export const GET_BAD_TRANSACTIONS: string = ` select  t.account_name, t.card_number, t.amount, t.transaction_type, t.description, t.target_card_number, ft.error_msg
                                                from failed_transactions ft , transaction_details t
                                                where ft.transaction_id = t.transaction_id and ft.file_id = t.file_id` ;
export const GET_NEGATIVE_BALANCE_ACCOUNTS: string = 'SELECT * FROM account_details where balance_amt < 0';
