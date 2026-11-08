const totalBalance = document.getElementById("total-balance");
const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionType = document.getElementById("type");
const category = document.getElementById("category");
const transactionList = document.getElementById("transaction-list");
const emptyMessage = document.getElementById("empty-message");
const clearAllButton = document.getElementById("clear-history-btn");
const savedTransaction = JSON.parse(localStorage.getItem("transactions"));
const transactionArray = savedTransaction || [];
transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const storedDescription = descriptionInput.value.trim();
  const storedAmount = amountInput.value.trim();
  const storedType = transactionType.value.trim();
  const storedCategory = category.value.trim();
  if (
    storedDescription === "" ||
    storedAmount === "" ||
    storedType === "" ||
    storedCategory === ""
  ) {
    alert("Please fill the form");
  } else {
    transactionArray.push({
      description: storedDescription,
      amount: Number(storedAmount),
      type: storedType,
      category: storedCategory,
      id: Date.now(),
    });
    updateSummary();
    displayTransaction();
    console.log(transactionArray);

    transactionForm.reset();
  }
});
displayTransaction();
updateSummary();
function displayTransaction() {
  if (transactionArray.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
  transactionList.innerHTML = "";
  transactionArray.forEach(function (transaction) {
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.dataset.id = transaction.id;
    delBtn.addEventListener("click", function (event) {
      const eventTarget = Number(event.target.dataset.id);
      const targetIndex = transactionArray.findIndex(function (target) {
        return target.id === eventTarget;
      });
      if (targetIndex === -1) {
        return;
      }
      transactionArray.splice(targetIndex, 1);

      displayTransaction();
      updateSummary();
    });

    const list = document.createElement("p");
    list.classList.add("transaction-list");
    list.classList.add("transaction-history-card");
    list.textContent = ` Description: ${transaction.description}\nAmount: ${transaction.amount}\nTransaction type: ${transaction.type}\nCategory: ${transaction.category} \nId: ${transaction.id}`;
    list.appendChild(delBtn);
    transactionList.classList.add("transaction-list");
    transactionList.appendChild(list);
  });
}

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
  console.log(transactionIncomeArray);
  console.log(transactionExpenseArray);
  localStorage.setItem("transactions", JSON.stringify(transactionArray));
}
