export const processFileContent = (content, accounts, setBadTransactions, setAccounts) => {
  const lines = content.split('\n');
  const newBadTransactions = [];
  const newAccounts = { ...accounts };

  lines.forEach((line) => {
    const [name, card, amount, type, description, relatedCard] = line.split(',');
    if (!name || !card || !amount || !type || !description) {
      newBadTransactions.push(line);
      return;
    }

    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat)) {
      newBadTransactions.push(line);
      return;
    }

    if (!newAccounts[name]) {
      newAccounts[name] = { cards: {}, balance: 0 };
    }
    if (!newAccounts[name].cards[card]) {
      newAccounts[name].cards[card] = 0;
    }
    newAccounts[name].cards[card] += amountFloat;
    newAccounts[name].balance += amountFloat;
  });

  setBadTransactions((prevBadTransactions) => [...prevBadTransactions, ...newBadTransactions]);
  setAccounts(newAccounts);
};


export const handleFileUpload = (e, accounts, setBadTransactions, setAccounts) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const fileContent = event.target.result;
    processFileContent(fileContent, accounts, setBadTransactions, setAccounts);
  };
  reader.readAsText(file);
};
