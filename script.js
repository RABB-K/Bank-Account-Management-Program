class BankAccount {
  constructor() {
    this.balance = 0;
    this.transactions = [];
  }

  deposit(amount) {
    if (amount > 0) {
      this.transactions.push({ type: "deposit", amount });
      this.balance += amount;
      return `Successfully deposited $${amount}. New balance: $${this.balance}`;
    }
    return "Deposit amount must be greater than zero.";
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.transactions.push({ type: "withdraw", amount });
      this.balance -= amount;
      return `Successfully withdrew $${amount}. New balance: $${this.balance}`;
    }
    return "Insufficient balance or invalid amount.";
  }

  checkBalance() {
    return `Current balance: $${this.balance}`;
  }

  listAllDeposits() {
    const deposits = this.transactions
      .filter(tx => tx.type === "deposit")
      .map(tx => tx.amount)
      .join(",");
    return `Deposits: ${deposits}`;
  }

  listAllWithdrawals() {
    const withdrawals = this.transactions
      .filter(tx => tx.type === "withdraw")
      .map(tx => tx.amount)
      .join(",");
    return `Withdrawals: ${withdrawals}`;
  }
}