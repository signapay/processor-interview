import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions, TooltipItem } from 'chart.js';
import { Transaction } from '../types/transaction';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type TransactionChartProps = {
  transactions: Transaction[];
}

const getChartData = (transactions: Transaction[]) => {
  const transactionTypes = ['Credit', 'Debit', 'Transfer'];
  return {
    labels: transactionTypes,
    datasets: [
      {
        label: 'Transaction Amounts',
        data: transactionTypes.map(type =>
          Number(transactions
            .filter(transaction => transaction.transactionType === type)
            .reduce((sum, transaction) => sum + transaction.transactionAmount, 0)
            .toFixed(2)
          )
        ),
        backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };
};

const getChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      },
    },
    title: {
      display: true,
      text: 'Transaction Summary',
      font: {
        size: 18,
        weight: 'bold' as const,
      },
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<'bar'>) => `$${context.formattedValue}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => `$${value}`,
      },
    },
  },
});

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  const transactionData = getChartData(transactions);
  const chartOptions = getChartOptions();

  return (
    <div style={{ 
      height: '300px', 
      width: '100%', 
      margin: '20px 0', 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      {Bar && <Bar data={transactionData} options={chartOptions as ChartOptions<'bar'>} />}
    </div>
  );
};

export default TransactionChart;
