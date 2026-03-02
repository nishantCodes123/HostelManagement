export class UI {
    constructor(service) {
        this.service = service;
        this.editTransactionId = null;
        this.form = document.getElementById("transactionForm");
        this.tableBody = document.getElementById("transactionTableBody");
        this.totalDiv = document.getElementById("totalBalance");
        this.monthlyDiv = document.getElementById("monthlyBalance");
        this.monthlyTab = document.getElementById("monthlyTab");
        this.categoryTab = document.getElementById("categoryTab");
        this.init();
    }
    init() {
        this.renderTransactions();
        this.renderBalances();
        this.handleSubmit();
        this.handleDelete();
        this.handleEdit();
        this.handleTabSwitch();
    }
    renderTransactions() {
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
    renderBalances() {
        const total = this.service.getTotalBalance();
        const now = new Date();
        const monthly = this.service.getMonthlyBalance(now.getMonth(), now.getFullYear());
        this.totalDiv.innerText = `Total: ₹${total}`;
        this.monthlyDiv.innerText = `This Month: ₹${monthly}`;
    }
    handleSubmit() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const description = document.getElementById("description").value;
            const amount = Number(document.getElementById("amount").value);
            const category = document.getElementById("category").value;
            const date = document.getElementById("date").value;
            try {
                if (this.editTransactionId) {
                    this.service.updateTransaction(this.editTransactionId, description, amount, category, date);
                    this.editTransactionId = null;
                }
                else {
                    this.service.addTransaction(description, amount, category, date);
                }
                this.renderTransactions();
                this.renderBalances();
                this.form.reset();
            }
            catch (error) {
                alert(error.message);
            }
        });
    }
    handleDelete() {
        this.tableBody.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("deleteBtn")) {
                const id = target.getAttribute("data-id");
                if (!id)
                    return;
                this.service.removeTransaction(id);
                this.renderTransactions();
                this.renderBalances();
            }
        });
    }
    handleEdit() {
        this.tableBody.addEventListener("click", (event) => {
            const target = event.target;
            if (target.classList.contains("editBtn")) {
                const id = target.getAttribute("data-id");
                if (!id)
                    return;
                const tx = this.service.getTransactions.find(t => t.id === id);
                if (!tx)
                    return;
                document.getElementById("description").value = tx.description;
                document.getElementById("amount").value = tx.amount.toString();
                document.getElementById("category").value = tx.category;
                document.getElementById("date").value = tx.date;
                this.editTransactionId = id;
            }
        });
    }
    handleTabSwitch() {
        this.monthlyTab.addEventListener("click", () => {
            this.setActiveTab("monthly");
            this.renderMonthlyView();
        });
        this.categoryTab.addEventListener("click", () => {
            this.setActiveTab("category");
            this.renderCategoryView();
        });
    }
    renderMonthlyView() {
        const now = new Date();
        const transactions = this.service.getTransactionsByMonth(now.getMonth(), now.getFullYear());
        this.renderTable(transactions);
    }
    renderCategoryView() {
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
    renderTable(transactions) {
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
    setActiveTab(active) {
        this.monthlyTab.classList.remove("active");
        this.categoryTab.classList.remove("active");
        if (active === "monthly") {
            this.monthlyTab.classList.add("active");
        }
        else {
            this.categoryTab.classList.add("active");
        }
    }
}
