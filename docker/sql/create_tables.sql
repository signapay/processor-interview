\c signapay;

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR(255) PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
	timestamp TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS transactions_file_name ON transactions (file_name);
CREATE INDEX IF NOT EXISTS transactions_card_number ON transactions (card_number);
CREATE INDEX IF NOT EXISTS transactions_card_type ON transactions (card_type);
CREATE INDEX IF NOT EXISTS transactions_timestamp ON transactions (timestamp);

CREATE TABLE IF NOT EXISTS errors (
    transaction_id VARCHAR(255) PRIMARY KEY, 
    file_name VARCHAR(255) NOT NULL,       
    record TEXT,             
    error_codes TEXT,                      
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the error was logged
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP-- Timestamp when the error was last updated
);

CREATE TABLE IF NOT EXISTS files (
    file_name VARCHAR(255) PRIMARY KEY,      -- Name of the uploaded file
	total INT,
	transactionsSaved INT,
	errorsSaved INT,
	ignored INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the error was logged
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the error was last updated
);

