import React from 'react';
import { render, screen} from '@testing-library/react';
import App from './app';

describe('App Component', () => {
  test('renders the Transaction Processor title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Transaction Processor/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders FileUpload component', () => {
    render(<App />);
    const fileUploadElement = screen.getByText(/Process Transactions/i);
    expect(fileUploadElement).toBeInTheDocument();
  });
});
