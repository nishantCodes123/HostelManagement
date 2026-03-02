import { ExpenseService } from "../services/expenseService.js";
import { Transaction } from "../models/Transaction.js";

export class UI {
  private form: HTMLFormElement;
  private tableBody: HTMLTableSectionElement;
  private totalDiv: HTMLElement;
  private monthlyDiv: HTMLElement;
  private monthlyTab: HTMLButtonElement;
  private categoryTab: HTMLButtonElement;

  private editTransactionId: string | null = null;

  constructor(private service: ExpenseService) {
    this.form = document.getElementById("transactionForm") as HTMLFormElement;
    this.tableBody = document.getElementById("transactionTableBody") as HTMLTableSectionElement;
    this.totalDiv = document.getElementById("totalBalance") as HTMLElement;
    this.monthlyDiv = document.getElementById("monthlyBalance") as HTMLElement;
    this.monthlyTab = document.getElementById("monthlyTab") as HTMLButtonElement;
    this.categoryTab = document.getElementById("categoryTab") as HTMLButtonElement;

    this.init();
  }

  private init(): void {
    this.renderTransactions();
    this.renderBalances();
    this.handleSubmit();
    this.handleDelete();
    this.handleEdit();
    this.handleTabSwitch();
  }

  private renderTransactions(): void {
    this.tableBody.innerHTML = "";

    const transactions = this.service.getTransactions;

    transactions.forEach(tx => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.description}</td>
        <td>${tx.category}</td>
        <td>₹${tx.amount}</td>
        <td>
          <button data-id="${tx.id}" class="editBtn">Edit</button>
          <button data-id="${tx.id}" class="deleteBtn">Delete</button>
        </td>
      `;

      this.tableBody.appendChild(row);
    });
  }

  private renderBalances(): void {
    const total = this.service.getTotalBalance();

    const now = new Date();
    const monthly = this.service.getMonthlyBalance(
      now.getMonth(),
      now.getFullYear()
    );

    this.totalDiv.innerText = `Total: ₹${total}`;
    this.monthlyDiv.innerText = `This Month: ₹${monthly}`;
  }

  private handleSubmit(): void {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      const description = (document.getElementById("description") as HTMLInputElement).value;
      const amount = Number((document.getElementById("amount") as HTMLInputElement).value);
      const category = (document.getElementById("category") as HTMLSelectElement).value as any;
      const date = (document.getElementById("date") as HTMLInputElement).value;

      try {
        if (this.editTransactionId) {
          this.service.updateTransaction(
            this.editTransactionId,
            description,
            amount,
            category,
            date
          );

          this.editTransactionId = null;
        } else {
          this.service.addTransaction(
            description,
            amount,
            category,
            date
          );
        }

        this.renderTransactions();
        this.renderBalances();
        this.form.reset();

      } catch (error: any) {
        alert(error.message);
      }
    });
  }

  private handleDelete(): void {
    this.tableBody.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("deleteBtn")) {
        const id = target.getAttribute("data-id");
        if (!id) return;

        this.service.removeTransaction(id);
        this.renderTransactions();
        this.renderBalances();
      }
    });
  }

  private handleEdit(): void {
    this.tableBody.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("editBtn")) {
        const id = target.getAttribute("data-id");
        if (!id) return;

        const tx = this.service.getTransactions.find(t => t.id === id);
        if (!tx) return;

        (document.getElementById("description") as HTMLInputElement).value = tx.description;
        (document.getElementById("amount") as HTMLInputElement).value = tx.amount.toString();
        (document.getElementById("category") as HTMLSelectElement).value = tx.category;
        (document.getElementById("date") as HTMLInputElement).value = tx.date;

        this.editTransactionId = id;
      }
    });
  }

 private handleTabSwitch(): void {

  this.monthlyTab.addEventListener("click", () => {
    this.setActiveTab("monthly");   
    this.renderMonthlyView();
  });

  this.categoryTab.addEventListener("click", () => {
    this.setActiveTab("category"); 
    this.renderCategoryView();
  });
}
private renderMonthlyView(): void {

  const now = new Date();
  const transactions = this.service.getTransactionsByMonth(
    now.getMonth(),
    now.getFullYear()
  );

  this.renderTable(transactions);
}
private renderCategoryView(): void {

  const grouped = this.service.getTransactionsGroupedByCategory();

  this.tableBody.innerHTML = "";

  for (const category in grouped) {

    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
      <td colspan="5" style="font-weight:bold; background:#f0f0f0">
        ${category}
      </td>
    `;
    this.tableBody.appendChild(headerRow);

    grouped[category].forEach(tx => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.description}</td>
        <td>${tx.category}</td>
        <td>₹${tx.amount}</td>
        <td>
          <button data-id="${tx.id}" class="editBtn">Edit</button>
          <button data-id="${tx.id}" class="deleteBtn">Delete</button>
        </td>
      `;
      this.tableBody.appendChild(row);
    });
  }
}

private renderTable(transactions: Transaction[]): void {

  this.tableBody.innerHTML = "";

  transactions.forEach(tx => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.description}</td>
      <td>${tx.category}</td>
      <td>₹${tx.amount}</td>
      <td>
        <button data-id="${tx.id}" class="editBtn">Edit</button>
        <button data-id="${tx.id}" class="deleteBtn">Delete</button>
      </td>
    `;

    this.tableBody.appendChild(row);
  });
}

private setActiveTab(active: "monthly" | "category") {

  this.monthlyTab.classList.remove("active");
  this.categoryTab.classList.remove("active");

  if (active === "monthly") {
    this.monthlyTab.classList.add("active");
  } else {
    this.categoryTab.classList.add("active");
  }
}
}