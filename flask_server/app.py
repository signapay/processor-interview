

from flask import Flask, request, jsonify
import json
from flask_cors import CORS
import pandas as pd
import os
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def hello():
    return "Hello, Flask!"

@app.route('/view', methods=["POST", "OPTIONS"])
def view():
    if request.method == "OPTIONS":
        return jsonify({'message': 'Preflight request successful'}), 200

    files = request.files
    response = {"clean_data": [], "error_data": []}
    
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    # Get the file with key 'myfile'
    file = files.get('myfile')
    
    if not file:
        return jsonify({"error": "File with key 'myfile' not found"}), 400

    print(f"Received file: {file.filename}")

    # Save the file to the 'uploads' directory
    upload_folder = 'uploads'
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    file_path = os.path.join(upload_folder, file.filename)
    print(f"Saving file to: {file_path}")
    
    try:
        file.save(file_path)
    except Exception as e:
        return jsonify({"error": f"Failed to save file: {str(e)}"}), 500
    
    # Define columns
    columns = ['Account Name', 'Card Number', 'Transaction Amount', 'Transaction Type', 'Description', 'Target Card Number']
    
    # Load the CSV file without headers
    try:
        df = pd.read_csv(file_path, header=None, names=columns)
        print(f"DataFrame loaded with shape: {df.shape}")
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV file: {str(e)}"}), 500
    
    # Process DataFrame
    df['Card Number'] = df['Card Number'].apply(lambda x: str(x).lstrip("'"))
    df['Target Card Number'] = df['Target Card Number'].apply(lambda x: str(x).lstrip("'"))
    
    df['Account Name'] = df['Account Name'].astype(str)
    df['Transaction Type'] = df['Transaction Type'].astype(str)
    df['Description'] = df['Description'].astype(str)
    df['Card Number'] = pd.to_numeric(df['Card Number'], errors='coerce')
    df['Target Card Number'] = pd.to_numeric(df['Target Card Number'], errors='coerce')
    df['Transaction Amount'] = pd.to_numeric(df['Transaction Amount'], errors='coerce')
    
    # Initialize an empty DataFrame for errors
    df_errors = pd.DataFrame()
    df['Error Message'] = ''
    mask_errors = pd.Series([False] * len(df))
    
    # Data validation logic
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
    
    # Error messages
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
    
    df_errors = df[mask_errors]
    df_errors['Error Message'] = df_errors.apply(get_error_message, axis=1)
    df_clean = df[~mask_errors]
    
    # Convert DataFrames to JSON serializable format
    def nan_to_none(value):
        return None if isinstance(value, float) and np.isnan(value) else value 
        #return None if np.isnan(value) else value
    df_clean.replace({np.nan,None})
    df_errors.replace({np.nan,None})
    response['clean_data'] = df_clean.applymap(nan_to_none).to_json(orient='records')
    response['error_data'] = df_errors.applymap(nan_to_none).to_json(orient='records')
    
    # Optionally remove the saved file after processing
    try:
        os.remove(file_path)
    except Exception as e:
        return jsonify({"error": f"Failed to remove file: {str(e)}"}), 500
    
    return jsonify(json.loads(response))

if __name__ == '__main__':
    app.run(debug=True)
