let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const expenseForm = document.getElementById('expenseForm');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const errorMessage = document.getElementById('errorMessage');

const expenseList = document.getElementById('expenseList');
const totalCountElement = document.getElementById('totalCount');
const totalAmountElement = document.getElementById('totalAmount');

const searchInput = document.getElementById('search');
const filterCategorySelect = document.getElementById('filterCategory');

document.addEventListener('DOMContentLoaded', () => {
  renderExpenses();
});

expenseForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  if (name === '') {
    showError('Please enter an expense name.');
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    showError('Please enter a valid positive amount.');
    return;
  }

  if (category === '') {
    showError('Please select a category.');
    return;
  }

  if (date === '') {
    showError('Please select a date.');
    return;
  }
  
  showError('');
  
  const newExpense = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category,
    date: date
  };
  
  expenses.push(newExpense);
  saveToLocalStorage();
  
  expenseForm.reset();
  renderExpenses();
});

searchInput.addEventListener('input', renderExpenses);
filterCategorySelect.addEventListener('change', renderExpenses);

function showError(msg) {
  errorMessage.textContent = msg;
}

function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function deleteExpense(id) {
  const confirmDelete = confirm('Are you sure you want to delete this expense?');
  
  if (confirmDelete) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveToLocalStorage();
    renderExpenses();
  }
}

function renderExpenses() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = filterCategorySelect.value;
  
  expenseList.innerHTML = '';
  
  const filteredExpenses = expenses.filter(expense => {
    const matchesNameOrCategory = expense.name.toLowerCase().includes(searchTerm) || 
                                  expense.category.toLowerCase().includes(searchTerm);
    
    const matchesCategoryFilter = selectedCategory === 'All' || expense.category === selectedCategory;

    return matchesNameOrCategory && matchesCategoryFilter;
  });
  
  filteredExpenses.forEach(expense => {
    const row = document.createElement('tr');

    row.innerHTML = 
      <td data-label="Name">${expense.name}</td>
      <td data-label="Amount">${expense.amount} Birr</td>
      <td data-label="Category">${expense.category}</td>
      <td data-label="Date">${expense.date}</td>
      <td data-label="Action">
        <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    ;

    expenseList.appendChild(row);
  });
  
  updateTotals();
}

function updateTotals() {
  const totalCount = expenses.length;
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  totalCountElement.textContent = totalCount;
  totalAmountElement.textContent = ${totalAmount} Birr;
}