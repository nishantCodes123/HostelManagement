export class ExpenseService {
    constructor() {
        this.transactions = [];
        this.loadData();
    }
    loadData() {
        const stored = localStorage.getItem("transactions");
        if (stored) {
            this.transactions = JSON.parse(stored);
        }
        else {
            this.transactions = [];
        }
    }
    saveData() {
        localStorage.setItem("transactions", JSON.stringify(this.transactions));
    }
    // Getter
    get getTransactions() {
        return this.transactions;
    }
    // Add Transaction
    addTransaction(description, amount, category, date) {
        const newTransaction = {
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
    removeTransaction(id) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index === -1) {
            throw new Error("Transaction not found");
        }
        this.transactions.splice(index, 1);
        this.saveData();
    }
    // Update
    updateTransaction(id, description, amount, category, date) {
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
    getTotalBalance() {
        return this.transactions.reduce((sum, t) => sum + t.amount, 0);
    }
    // Monthly Balance
    getMonthlyBalance(month, year) {
        return this.transactions
            .filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === month && d.getFullYear() === year;
        })
            .reduce((sum, t) => sum + t.amount, 0);
    }
    // Get transactions of a specific month
    getTransactionsByMonth(month, year) {
        return this.transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === month && d.getFullYear() === year;
        });
    }
    // Get transactions grouped by category
    getTransactionsGroupedByCategory() {
        const grouped = {};
        this.transactions.forEach(t => {
            if (!grouped[t.category]) {
                grouped[t.category] = [];
            }
            grouped[t.category].push(t);
        });
        return grouped;
    }
    // Category Summary
    getCategorySummary() {
        const summary = {};
        this.transactions.forEach(t => {
            if (!summary[t.category]) {
                summary[t.category] = 0;
            }
            summary[t.category] += t.amount;
        });
        return summary;
    }
}
