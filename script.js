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

const transactionArray = [];
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
    });

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

    displayTransaction();
    console.log(transactionIncomeArray);
    console.log(transactionExpenseArray);

    console.log(transactionArray);

    transactionForm.reset();
  }
});
displayTransaction();
function displayTransaction() {
  if (transactionArray.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
  transactionList.innerHTML = "";
  transactionArray.forEach(function (transaction) {
    const list = document.createElement("p");
    list.classList.add("transaction-list");
    list.classList.add("transaction-history-card");
    list.textContent = ` Description: ${transaction.description}\nAmount: ${transaction.amount}\nTransaction type: ${transaction.type}\nCategory: ${transaction.category}`;
    transactionList.classList.add("transaction-list");
    transactionList.appendChild(list);
  });
}
