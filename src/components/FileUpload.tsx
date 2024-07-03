import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import ResetButton from './ResetButton';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5MB in bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessage('File size exceeds the 1.5MB limit.');
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    if (!username) {
      alert('Please enter a username.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = e.target?.result;

      if (typeof fileData !== 'string') {
        alert('File could not be read as string.');
        return;
      }

     const encrypted = CryptoJS.AES.encrypt(fileData, 'your-secret-key').toString();

      const formData = new FormData();
      formData.append('file', new Blob([encrypted], { type: 'text/plain' }), file.name);
      formData.append('username', username);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert("File uploaded. Please check the transactions in 'Reports' tab");
      } else {
        alert('File upload failed');
      }
    };
    reader.readAsText(file);
  };

  //style={{ 'display': 'flex', 'justifyContent': 'left', 'padding': '10px 0', 'alignItems': 'left', 'flexDirection': 'column' }}

  return (
    <>
      <div className='file-upload-container'>
       <div>
          <label >  User ID: </label>
          <input type="text" placeholder="Enter username" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <input type="file" onChange={handleFileChange} accept=".csv"/>
          <button onClick={handleFileUpload}>Upload File</button>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
      <div> 
        <ResetButton />
      </div>
    </>
  );
};

export default FileUpload;
