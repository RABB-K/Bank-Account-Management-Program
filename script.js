// --- BankAccount Class Definition ---
class BankAccount {
  constructor(ownerName) {
    this.ownerName = ownerName;     // Owner's name (useful for transfers and summaries)
    this.balance = 0;               // Starting balance
    this.transactions = [];         // List of all transactions (deposits & withdrawals)
  }

  // Deposit money into the account
  deposit(amount) {
    if (amount > 0) {
      this.transactions.push({
        type: "deposit",
        amount,
        date: new Date().toLocaleString() // Record the transaction date
      });
      this.balance += amount;
      return `Successfully deposited $${amount}. New balance: $${this.balance}`;
    }
    return "Deposit amount must be greater than zero.";
  }

  // Withdraw money from the account if funds are sufficient
  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.transactions.push({
        type: "withdraw",
        amount,
        date: new Date().toLocaleString()
      });
      this.balance -= amount;
      return `Successfully withdrew $${amount}. New balance: $${this.balance}`;
    }
    return "Insufficient balance or invalid amount.";
  }

  // Return current balance as a string
  checkBalance() {
    return `Current balance: $${this.balance}`;
  }

  // Return an array of deposit transactions
  listAllDeposits() {
    return this.transactions.filter(tx => tx.type === "deposit");
  }

  // Return an array of withdrawal transactions
  listAllWithdrawals() {
    return this.transactions.filter(tx => tx.type === "withdraw");
  }

  // Transfer money to another BankAccount instance
  transfer(amount, targetAccount) {
    if (!(targetAccount instanceof BankAccount)) {
      return "Transfer failed. Invalid target account.";
    }

    if (amount > 0 && amount <= this.balance) {
      this.withdraw(amount);         // Withdraw from this account
      targetAccount.deposit(amount); // Deposit into target account
      return `Transferred $${amount} to ${targetAccount.ownerName}.`;
    }

    return "Transfer failed. Invalid amount or insufficient funds.";
  }

  // Generate a monthly summary string
  getMonthlySummary() {
    const totalDeposited = this.transactions
      .filter(tx => tx.type === "deposit")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalWithdrawn = this.transactions
      .filter(tx => tx.type === "withdraw")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const netChange = totalDeposited - totalWithdrawn;

    return `
--- Monthly Summary for ${this.ownerName} ---
Total Deposited: $${totalDeposited}
Total Withdrawn: $${totalWithdrawn}
Net Change: $${netChange}
Final Balance: $${this.balance}
----------------------------------------
`.trim();
  }
}

// --- Setup Section ---

// Create a Map to store all accounts by name (for transfers)
const accounts = new Map();

// Create the main user account and add to accounts map
const mainAccountName = "User";
accounts.set(mainAccountName, new BankAccount(mainAccountName));

// Get DOM elements
const balanceEl = document.getElementById("balance");
const depositAmountInput = document.getElementById("depositAmount");
const depositBtn = document.getElementById("depositBtn");
const withdrawAmountInput = document.getElementById("withdrawAmount");
const withdrawBtn = document.getElementById("withdrawBtn");
const transferAmountInput = document.getElementById("transferAmount");
const transferTargetInput = document.getElementById("transferTarget");
const transferBtn = document.getElementById("transferBtn");
const listDepositsBtn = document.getElementById("listDepositsBtn");
const listWithdrawalsBtn = document.getElementById("listWithdrawalsBtn");
const showSummaryBtn = document.getElementById("showSummaryBtn");
const transactionsList = document.getElementById("transactionsList");
const summaryBox = document.getElementById("summaryBox");

// Reference to the main user's BankAccount
const account = accounts.get(mainAccountName);

// Update the displayed balance
function updateBalance() {
  balanceEl.textContent = account.checkBalance();
}

// Display a list of transactions in the <ul> element
function displayTransactions(transactions) {
  transactionsList.innerHTML = "";     // Clear existing list
  summaryBox.hidden = true;            // Hide summary box if it was visible

  if (transactions.length === 0) {
    transactionsList.innerHTML = "<li>No transactions found.</li>";
    return;
  }

  transactions.forEach(tx => {
    const li = document.createElement("li");
    li.textContent = `${tx.type.toUpperCase()}: $${tx.amount} on ${tx.date}`;
    transactionsList.appendChild(li);
  });
}

// --- Event Listeners ---

// Deposit button click
depositBtn.addEventListener("click", () => {
  const amount = parseFloat(depositAmountInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid deposit amount greater than zero.");
    return;
  }

  alert(account.deposit(amount));
  depositAmountInput.value = "";
  updateBalance();
});

// Withdraw button click
withdrawBtn.addEventListener("click", () => {
  const amount = parseFloat(withdrawAmountInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid withdraw amount greater than zero.");
    return;
  }

  alert(account.withdraw(amount));
  withdrawAmountInput.value = "";
  updateBalance();
});

// Transfer button click
transferBtn.addEventListener("click", () => {
  const amount = parseFloat(transferAmountInput.value);
  const targetName = transferTargetInput.value.trim();

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid transfer amount greater than zero.");
    return;
  }

  if (!targetName) {
    alert("Please enter a valid target account name.");
    return;
  }

  // Get or create the target account
  let targetAccount = accounts.get(targetName);
  if (!targetAccount) {
    targetAccount = new BankAccount(targetName);
    accounts.set(targetName, targetAccount);
  }

  const msg = account.transfer(amount, targetAccount);
  alert(msg);
  transferAmountInput.value = "";
  transferTargetInput.value = "";
  updateBalance();
});

// Show deposits
listDepositsBtn.addEventListener("click", () => {
  displayTransactions(account.listAllDeposits());
});

// Show withdrawals
listWithdrawalsBtn.addEventListener("click", () => {
  displayTransactions(account.listAllWithdrawals());
});

// Show monthly summary
showSummaryBtn.addEventListener("click", () => {
  transactionsList.innerHTML = "";                  // Clear transaction list
  summaryBox.textContent = account.getMonthlySummary(); // Show summary
  summaryBox.hidden = false;                        // Make summary visible
});

// --- Initialize Page ---
updateBalance(); // Show starting balance
