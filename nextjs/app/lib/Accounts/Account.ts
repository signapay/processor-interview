interface Card {
    cardNumber: number;
    balance: number;
}

export interface Account {
    name: string;
    cards: Card[];
}