import { Transaction } from "../models/Transaction.js";

export class ExpenseService {
  private transactions: Transaction[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const stored = localStorage.getItem("transactions");

    if (stored) {
      this.transactions = JSON.parse(stored);
    } else {
      this.transactions = [];
    }
  }

  private saveData(): void {
    localStorage.setItem(
      "transactions",
      JSON.stringify(this.transactions)
    );
  }

  // Getter
  get getTransactions(): Transaction[] {
    return this.transactions;
  }

  // Add Transaction
  addTransaction(
    description: string,
    amount: number,
    category: Transaction["category"],
    date: string
  ): void {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      category,
      date,
    };

    this.transactions.push(newTransaction);
    this.saveData();
  }

  // Delete
  removeTransaction(id: string): void {
    const index = this.transactions.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error("Transaction not found");
    }

    this.transactions.splice(index, 1);
    this.saveData();
  }

  // Update
  updateTransaction(
    id: string,
    description: string,
    amount: number,
    category: Transaction["category"],
    date: string
  ): void {

    const tx = this.transactions.find(t => t.id === id);

    if (!tx) {
      throw new Error("Transaction not found");
    }

    tx.description = description;
    tx.amount = amount;
    tx.category = category;
    tx.date = date;

    this.saveData();
  }

  // Total Balance
  getTotalBalance(): number {
    return this.transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
  }

  // Monthly Balance
  getMonthlyBalance(month: number, year: number): number {
    return this.transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }

  // Get transactions of a specific month
getTransactionsByMonth(month: number, year: number) {
  return this.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

// Get transactions grouped by category
getTransactionsGroupedByCategory(): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};

  this.transactions.forEach(t => {
    if (!grouped[t.category]) {
      grouped[t.category] = [];
    }
    grouped[t.category].push(t);
  });

  return grouped;
}
  // Category Summary
  getCategorySummary(): Record<string, number> {
    const summary: Record<string, number> = {};

    this.transactions.forEach(t => {
      if (!summary[t.category]) {
        summary[t.category] = 0;
      }
      summary[t.category] += t.amount;
    });

    return summary;
  }
}