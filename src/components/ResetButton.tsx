import React from 'react';
import axios from 'axios';

const ResetButton: React.FC = () => {
  const handleReset = async () => {
    try {
      await axios.post('/api/reset');
      alert('System reset successfully');
    } catch (error) {
      console.error('Error resetting system', error);
      alert('Error resetting system');
    }
  };

  return (
    <button onClick={handleReset}>Reset System</button>
  );
};

export default ResetButton;
