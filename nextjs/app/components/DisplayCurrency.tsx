import React from 'react';

interface CurrencyProps {
    amount: number;
    decorated?: boolean;
}

/**
 * A component that displays a currency amount with an optional decoration.
 * Relies on the Intl.NumberFormat API to format the currency.
 */

export default function Currency({ amount, decorated = false }: CurrencyProps) {

    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);

    const style = decorated && amount < 0 ? { backgroundColor: 'rgba(255, 0, 0, 0.1)' } : {};

    return <span style={style}>{formatted}</span>;
}