
import pandas as pd
import numpy as np
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/view', methods=["POST", "OPTIONS"])
def view():
    if request.method == "OPTIONS":
        return jsonify({'message': 'Preflight request successful'}), 200

    files = request.files
    response = { "error_data": [], "chart_of_accounts": [], "collections_list": []}
    
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    file = files.get('myfile')
    
    if not file:
        return jsonify({"error": "File with key 'myfile' not found"}), 400

    print(f"Received file: {file.filename}")

    upload_folder = 'uploads'
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    file_path = os.path.join(upload_folder, file.filename)
    print(f"Saving file to: {file_path}")
    
    try:
        file.save(file_path)
    except Exception as e:
        return jsonify({"error": f"Failed to save file: {str(e)}"}), 500
    
    columns = ['Account Name', 'Card Number', 'Transaction Amount', 'Transaction Type', 'Description', 'Target Card Number']
    
    try:
        df = pd.read_csv(file_path, header=None, names=columns)
        print(f"DataFrame loaded with shape: {df.shape}")
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV file: {str(e)}"}), 500
    
    df['Card Number'] = df['Card Number'].apply(lambda x: str(x).lstrip("'"))
    df['Target Card Number'] = df['Target Card Number'].apply(lambda x: str(x).lstrip("'"))
    
    df['Account Name'] = df['Account Name'].astype(str)
    df['Transaction Type'] = df['Transaction Type'].astype(str)
    df['Description'] = df['Description'].astype(str)
    df['Card Number'] = pd.to_numeric(df['Card Number'], errors='coerce')
    df['Target Card Number'] = pd.to_numeric(df['Target Card Number'], errors='coerce')
    df['Transaction Amount'] = pd.to_numeric(df['Transaction Amount'], errors='coerce')
    
    # Start with an empty DataFrame for errors
    df_errors = pd.DataFrame(columns=df.columns.tolist() + ['Error Message'])
    
    # Initialize a boolean series for errors
    mask_errors = pd.Series([False] * len(df))
    
    # Define and apply error checks
    null_mask = df.isnull().any(axis=1)
    if null_mask.any():
        mask_errors |= null_mask

    data_type_errors = pd.Series([False] * len(df))
    data_type_errors |= ~df['Account Name'].apply(lambda x: isinstance(x, str))
    data_type_errors |= ~df['Card Number'].apply(lambda x: pd.api.types.is_numeric_dtype(type(x)))
    data_type_errors |= df['Transaction Amount'].isnull()
    data_type_errors |= ~df['Transaction Type'].apply(lambda x: isinstance(x, str))
    if 'Target Card Number' in df.columns:
        data_type_errors |= df['Target Card Number'].apply(lambda x: not pd.api.types.is_numeric_dtype(type(x)))
    mask_errors |= data_type_errors
    
    valid_transaction_types = ['Credit', 'Debit', 'Transfer']
    transaction_type_errors = ~df['Transaction Type'].isin(valid_transaction_types)
    if transaction_type_errors.any():
        mask_errors |= transaction_type_errors
    
    inconsistent_amounts = (
        (df['Transaction Type'] == 'Credit') & (df['Transaction Amount'] >= 0) |
        (df['Transaction Type'] == 'Debit') & (df['Transaction Amount'] <= 0) |
        (df['Transaction Type'] == 'Transfer') & (df['Transaction Amount'] == 0)
    )
    if inconsistent_amounts.any():
        mask_errors |= inconsistent_amounts
    
    target_card_errors = (
        (df['Transaction Type'] == 'Transfer') & df['Target Card Number'].isnull() |
        (df['Transaction Type'] != 'Transfer') & df['Target Card Number'].notnull()
    )
    if target_card_errors.any():
        mask_errors |= target_card_errors
    
    exclude_missing_target_card_when_credit_or_debit = (
        (df['Transaction Type'].isin(['Credit', 'Debit'])) & df['Target Card Number'].isnull()
    )
    mask_errors &= ~exclude_missing_target_card_when_credit_or_debit
    
    duplicate_errors = df.duplicated(subset=['Account Name', 'Card Number', 'Transaction Amount', 'Transaction Type', 'Description'], keep=False)
    if duplicate_errors.any():
        mask_errors |= duplicate_errors
    
    def get_error_message(row):
        messages = []
        if pd.isnull(row).any():
            messages.append("Missing or null values")
        if not isinstance(row['Account Name'], str):
            messages.append("Invalid data type in 'Account Name'")
        if not pd.api.types.is_numeric_dtype(type(row['Card Number'])):
            messages.append("Invalid data type in 'Card Number'")
        if pd.isnull(row['Transaction Amount']):
            messages.append("Invalid data type in 'Transaction Amount' or non-numeric values")
        if not isinstance(row['Transaction Type'], str):
            messages.append("Invalid data type in 'Transaction Type'")
        if 'Target Card Number' in df.columns:
            if not pd.api.types.is_numeric_dtype(type(row['Target Card Number'])):
                messages.append("Invalid data type in 'Target Card Number'")
        if row['Transaction Type'] not in valid_transaction_types:
            messages.append("Unexpected 'Transaction Type'")
        if (row['Transaction Type'] == 'Credit' and row['Transaction Amount'] <= 0) or \
           (row['Transaction Type'] == 'Debit' and row['Transaction Amount'] >= 0) or \
           (row['Transaction Type'] == 'Transfer' and row['Transaction Amount'] == 0):
            messages.append("Inconsistent transaction amounts")
        if (row['Transaction Type'] == 'Transfer' and pd.isnull(row['Target Card Number'])) or \
           (row['Transaction Type'] != 'Transfer' and not pd.isnull(row['Target Card Number'])):
            messages.append("Target Card Number issues")
        if df.duplicated(subset=['Account Name', 'Card Number', 'Transaction Amount', 'Transaction Type', 'Description']).any():
            messages.append("Duplicate transactions")
        return ', '.join(messages)
    
    # Apply error messages
    df_errors = df.copy()
    df_errors.loc[mask_errors, 'Error Message'] = df_errors.loc[mask_errors].apply(get_error_message, axis=1)
    df_errors = df_errors[mask_errors]
    
    # Generate chart of accounts grouped by 'Card Number'
    df_clean = df[~mask_errors]
    chart_of_accounts = df_clean.groupby('Card Number').agg(
        Account_Names=('Account Name', lambda x: ', '.join(x.unique())),
        Final_Balance=('Transaction Amount', 'sum')
    ).reset_index()
    
    # Convert chart_of_accounts DataFrame to JSON
    chart_of_accounts_json = json.loads(chart_of_accounts.to_json(orient='records'))
    
    # Generate collections list based on chart_of_accounts
    # Filter to include only cards with negative balances
    negative_balance_cards = chart_of_accounts[chart_of_accounts['Final_Balance'] < 0]
    
    # Create collections_list by including all account names and negative balances
    collections_list = negative_balance_cards[['Card Number', 'Account_Names', 'Final_Balance']]
    collections_list = collections_list.sort_values(by='Card Number')  # Sort by card number
    
    # Convert sorted collections_list DataFrame to JSON
    collections_list_json = json.loads(collections_list.to_json(orient='records'))
    
    def nan_to_none(value):
        return None if isinstance(value, float) and np.isnan(value) else value 
    
    response['error_data'] = json.loads(df_errors.to_json(orient='records'))
    response['chart_of_accounts'] = chart_of_accounts_json  
    response['collections_list'] = collections_list_json 

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)