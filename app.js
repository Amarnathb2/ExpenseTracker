// ------------------ Global Data ------------------
let expensesData = { expenses: [], emiTypes: [] };

// Load from localStorage if exists
const savedData = localStorage.getItem('expensesData');
if (savedData) expensesData = JSON.parse(savedData);

// ------------------ Shared Functions ------------------

// Save data to localStorage (can later integrate Drive)
function saveData() {
    localStorage.setItem('expensesData', JSON.stringify(expensesData));
    console.log('Data saved');
}

// Back to Home button generator
function addBackButton() {
    const btn = document.createElement('button');
    btn.textContent = '🏠 Back to Home';
    btn.style.margin = '20px';
    btn.style.padding = '10px';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.onclick = () => window.location = 'index.html';
    document.body.prepend(btn);
}

// Populate EMI dropdown
function populateEMItypes(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (!select) return;
    select.innerHTML = '';
    expensesData.emiTypes.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.name;
        opt.textContent = e.name;
        select.appendChild(opt);
    });
}

// ------------------ Expense Functions ------------------

function addExpense(type, amount, emiType=null) {
    const date = new Date().toISOString();
    let expense = { type, amount, date };

    if (type === 'EMI') {
        const emi = expensesData.emiTypes.find(e => e.name === emiType);
        if (!emi) return alert('Please configure EMI first!');
        emi.paidAmount += amount;
        expense.emiType = emiType;
        expense.totalAmount = emi.totalAmount;
        expense.paidAmount = emi.paidAmount;
        expense.remainingAmount = emi.totalAmount - emi.paidAmount;
    }

    expensesData.expenses.push(expense);
    saveData();
    alert('Expense added!');
}

// Configure new EMI
function configureEMI(name, total, paid) {
    if (!name || isNaN(total) || isNaN(paid)) return alert('Invalid data');
    expensesData.emiTypes.push({ name, totalAmount: total, paidAmount: paid });
    saveData();
    alert('EMI configured!');
}

// ------------------ View Functions ------------------

function displayExpenses(containerId) {
    const list = document.getElementById(containerId);
    if (!list) return;
    list.innerHTML = "<h3>Your Expenses:</h3>";
    if (expensesData.expenses.length === 0) list.innerHTML += "<p>No expenses yet.</p>";
    expensesData.expenses.forEach(e => {
        if (e.type === 'EMI') {
            list.innerHTML += `<div class="expense-item">${e.type} - ${e.emiType}: ${e.amount} (Paid: ${e.paidAmount}, Remaining: ${e.remainingAmount})<br><small>${new Date(e.date).toLocaleString()}</small></div>`;
        } else {
            list.innerHTML += `<div class="expense-item">${e.type}: ${e.amount}<br><small>${new Date(e.date).toLocaleString()}</small></div>`;
        }
    });
}

function displayPendingEMI(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "<h3>Pending EMIs:</h3>";
    let hasPending = false;
    expensesData.emiTypes.forEach(e => {
        const remaining = e.totalAmount - e.paidAmount;
        if (remaining > 0) {
            container.innerHTML += `<div>${e.name}: Remaining Amount ${remaining}</div>`;
            hasPending = true;
        }
    });
    if (!hasPending) container.innerHTML += "<p>No pending EMI.</p>";
}
