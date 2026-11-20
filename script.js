const totalBalance = document.getElementById("total-balance");
const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const transactionForm = document.getElementById("transaction-form");
const addTransactionBtn = document.getElementById("add-transaction-btn");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionType = document.getElementById("type");
const category = document.getElementById("category");
const transactionList = document.getElementById("transaction-list");
const emptyMessage = document.getElementById("empty-message");
const clearAllButton = document.getElementById("clear-history-btn");
const transactionFilter = document.getElementById("transaction-filter");
const searchTransactions = document.getElementById("search-transactions");
const sortTransactionsSelect = document.getElementById("sort-transactions");

const savedTransaction = JSON.parse(localStorage.getItem("transactions"));
const transactionArray = savedTransaction || [];

let editingTransactionId = null;

// Form submission listener
transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const storedDescription = descriptionInput.value.trim();
  const storedAmount = amountInput.value.trim();
  const storedType = transactionType.value.trim();
  const storedCategory = category.value.trim();
  const numericAmount = Number(storedAmount);

  if (
    storedDescription === "" ||
    storedAmount === "" ||
    storedType === "" ||
    storedCategory === ""
  ) {
    alert("Please fill the form");
    return;
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    alert("Please enter a valid amount greater than zero.");
    return;
  }

  if (editingTransactionId !== null) {
    console.log("Editing ID:", editingTransactionId);
    const targetEditIndex = transactionArray.findIndex(function (target) {
      return target.id === editingTransactionId;
    });

    if (targetEditIndex === -1) {
      return;
    }

    const transaction = transactionArray[targetEditIndex];

    transaction.description = storedDescription;
    transaction.amount = numericAmount;
    transaction.type = storedType;
    transaction.category = storedCategory;

    editingTransactionId = null;
  } else {
    transactionArray.push({
      description: storedDescription,
      amount: numericAmount,
      type: storedType,
      category: storedCategory,
      id: Date.now(),
    });
  }
  addTransactionBtn.textContent = "Add Transaction";
  updateSummary();
  transactionFilter.dispatchEvent(new Event("change"));
  transactionForm.reset();
});

displayTransaction(transactionArray);
updateSummary();

// Display transactions
function displayTransaction(transactionArr = transactionArray) {
  if (transactionArr.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  transactionList.innerHTML = "";

  transactionArr.forEach(function (transaction) {
    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.dataset.id = transaction.id;

    delBtn.addEventListener("click", function (event) {
      const eventDelTarget = Number(event.target.dataset.id);

      const targetDelIndex = transactionArray.findIndex(function (target) {
        return target.id === eventDelTarget;
      });

      if (targetDelIndex === -1) {
        return;
      }

      transactionArray.splice(targetDelIndex, 1);
      if (editingTransactionId === eventDelTarget) {
        editingTransactionId = null;
        transactionForm.reset();
        addTransactionBtn.textContent = "Add Transaction";
      }
      updateSummary();
      transactionFilter.dispatchEvent(new Event("change"));
    });

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.dataset.id = transaction.id;

    editBtn.addEventListener("click", function (event) {
      editingTransactionId = Number(event.target.dataset.id);

      const targetEditIndex = transactionArray.findIndex(function (target) {
        return target.id === editingTransactionId;
      });

      if (targetEditIndex === -1) {
        editingTransactionId = null;
        addTransactionBtn.textContent = "Add Transaction";
        return;
      }

      const editTransaction = transactionArray[targetEditIndex];

      descriptionInput.value = editTransaction.description;
      amountInput.value = editTransaction.amount;
      transactionType.value = editTransaction.type;
      category.value = editTransaction.category;
      addTransactionBtn.textContent = "Edit Transaction";
    });

    // Transaction history
    const list = document.createElement("p");

    list.classList.add("transaction-list");
    list.classList.add("transaction-history-card");

    list.textContent = `Description: ${transaction.description}
Amount: ${transaction.amount}
Transaction type: ${transaction.type}
Category: ${transaction.category}
Id: ${transaction.id}`;

    list.appendChild(delBtn);
    list.appendChild(editBtn);

    transactionList.classList.add("transaction-list");
    transactionList.appendChild(list);
  });
}

// Update dashboard summary
function updateSummary() {
  const transactionIncomeArray = transactionArray.filter(
    function (transaction) {
      return transaction.type === "income";
    },
  );

  const transactionExpenseArray = transactionArray.filter(
    function (transaction) {
      return transaction.type === "expense";
    },
  );

  const totalIncomeAmount = transactionIncomeArray.reduce(function (
    sum,
    transaction,
  ) {
    return sum + transaction.amount;
  }, 0);

  totalIncome.textContent = totalIncomeAmount;

  const totalExpenseAmount = transactionExpenseArray.reduce(function (
    sum,
    transaction,
  ) {
    return sum + transaction.amount;
  }, 0);

  totalExpenses.textContent = totalExpenseAmount;

  totalBalance.textContent = totalIncomeAmount - totalExpenseAmount;

  localStorage.setItem("transactions", JSON.stringify(transactionArray));
}

// Clear all transactions
clearAllButton.addEventListener("click", function () {
  if (transactionArray.length === 0) {
    alert("No transaction yet");
  } else if (confirm("Are you sure you want to clear all transactions?")) {
    transactionArray.splice(0, transactionArray.length);

    editingTransactionId = null;
    transactionForm.reset();

    updateSummary();
    displayTransaction(transactionArray);
  }
  addTransactionBtn.textContent = "Add Transaction";
});
function filterTransactions() {
  const searchInput = searchTransactions.value.toLowerCase();
  const searchedTransactions = transactionArray.filter(function (transaction) {
    if (
      (transactionFilter.value.toLowerCase() === "all" ||
        transactionFilter.value.toLowerCase() ===
          transaction.type.toLowerCase()) &&
      (transaction.description.toLowerCase().includes(searchInput) ||
        transaction.category.toLowerCase().includes(searchInput) ||
        transaction.amount.toString().includes(searchInput))
    ) {
      return true;
    }
  });
  displayTransaction(searchedTransactions);
}
transactionFilter.addEventListener("change", filterTransactions);

searchTransactions.addEventListener("input", filterTransactions);

function sortTransactions() {
  const sortedTransactions = [...transactionArray];
  if (sortTransactionsSelect.value === "lowest") {
    sortedTransactions.sort(function (a, b) {
      return a.amount - b.amount;
    });
  } else if (sortTransactionsSelect.value === "highest") {
    sortedTransactions.sort(function (a, b) {
      return b.amount - a.amount;
    });
  }
  displayTransaction(sortedTransactions);
}
sortTransactionsSelect.addEventListener("change", sortTransactions);
