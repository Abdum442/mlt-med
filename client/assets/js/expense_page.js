import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const financialMgt = document.getElementById('financialReportMgt');
const expensesBtn = document.getElementById('expensesBtn');
const detailsContainer = document.body.querySelector('.details .recentOrders');

expensesBtn.addEventListener('click', function () {

  detailsContainer.innerHTML = '';
  const expensesContainer = expensesTabContainer();

  detailsContainer.appendChild(expensesContainer);

  const expenseContent = document.getElementById('expense-content');
  expenseContent.style.display = 'block';

  const newExpenseArea = document.createElement('div');
  newExpenseArea.className = 'add-new-sales';

  const newExpenseBtn = document.createElement('button');
  newExpenseBtn.textContent = 'Add New Expense';

  newExpenseArea.appendChild(newExpenseBtn);

  expenseContent.appendChild(newExpenseArea);


  const expenseTableContainer = document.createElement('div');
  expenseTableContainer.id = 'expense-table';


  expenseContent.appendChild(expenseTableContainer);

  const expenseModal = createAddExpenseModal();
  expenseContent.appendChild(expenseModal);
  expenseModal.style.display = 'none';

  const expenseCategoryModal = createAddExpenseCategoryModal();
  expenseContent.appendChild(expenseCategoryModal);
  expenseCategoryModal.style.display = 'none';


  newExpenseBtn.addEventListener('click', async function () {
    await addCategoriesToOptions();
    expenseModal.style.display = 'block';
  })

  expenseModal.querySelector('.add-expense-category').addEventListener('click', function () {
    expenseCategoryModal.style.display = 'block';
  })

  expensesTable();

  expenseModal.querySelector('.expense-save').addEventListener('click', async function () {
    await addExpenseData();
    expenseModal.style.display = 'none';
  });

  expenseCategoryModal.querySelector('.expense-category-save').addEventListener('click', async function () {
    await addNewExpenseCategory();
    await addCategoriesToOptions();
    expenseCategoryModal.style.display = 'none';

  })
})

function expensesTabContainer() {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.id = "payable-container"

  tabContainer.innerHTML = `<div class="tab">
                              <button id="payable-tab" style="width:auto; padding: 20px 30px;">Expenses</button>
                            </div>
                            <div class="tab-content" id="expense-content">
    
                            </div>`;
  return tabContainer;
}

async function expensesTable() {
  const tableHead = ['ID', 'Description', 'Category', 'Date', 'Amount'];

  let commonData = {
    tableId: "expense-table",
    tableHeader: tableHead,
    tableData: []
  };

  const queryType = 'SELECT';
  const query = 'SELECT * FROM cat_expenses';
  const expenseRawData = await window.electronAPI.sendQuery('general-query', queryType, query);

  const expenseObjData = JSON.parse(expenseRawData);

  const expenseData = expenseObjData.map(expense => [
    expense.id,
    expense.description,
    expense.expense_category_id,
    formatDate(expense.date),
    formatNumber(parseFloat(expense.amount)),
  ]);

  commonData.tableData = expenseData;

  const tableObjFunc = new CreateTableFromData(commonData);

  tableObjFunc.renderTable();
}


function createAddExpenseModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'expense-modal'
  modal.innerHTML =
    `<div class="modal-content">
      <span onclick="document.getElementById('expense-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
      <h2>Add Payable Details</h2>
      <div class="form-container">
        <div class="row">
          <div class="col-50">
            <label for="expense-category">Expense Category</label>
            <input type="text" list="expense-category-list" id="expense-category" name="expense-category" placeholder="Search..">
            <datalist name="expense-category" id="expense-category-list"></datalist> 
          </div>
          <div class="col-50">
            <button class="btn add-expense-category" style="background-color:blue">Add Category</button>
          </div>
        </div>
        <div class="row">
          <div class="col-75">
            <label for="expense-description">Description</label>
            <textarea name="expense-description" id="expense-description" style="width:100%; height:50px;resize:vertical;"></textarea>
          </div>
          <div class="col-25">
            <label for="expense-amount">Amount</label>
            <input type="text" id="expense-amount" name="expense-amount">
          </div>
        </div>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn expense-save">Save</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('expense-modal').style.display='none'" class="btn" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
  return modal;
}

function createAddExpenseCategoryModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'expense-category-modal';
  modal.style.zIndex = '100';
  modal.innerHTML =
    `<div class="modal-content">
      <span onclick="document.getElementById('expense-category-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
      <h2>Add Expense Category</h2>
      <div class="form-container">
        <div class="row">
          <div class='col-25'>
            <label for="expense-category-name">Name</label>
            <input type="text" id="expense-category-name" name="expense-category-name">
            </div>
          <div class="col-75">
            <label for="expense-category-description">Description</label>
            <textarea name="expense-category-description" id="expense-category-description" style="width:100%; height:50px;resize:vertical;"></textarea>
          </div>
        </div>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn expense-category-save">Save</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('expense-category-modal').style.display='none'" class="btn" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
  return modal;
}

function extractExpenseModalData() {
  const expenseModal = document.getElementById('expense-modal');

  const expenseDescriptionInput = expenseModal.querySelector('#expense-description');
  const expenseAmountInput = expenseModal.querySelector('#expense-amount');
  const expenseCategoryIdInput = expenseModal.querySelector('#expense-category');

  let message = 'pass';
  if (expenseDescriptionInput.value === '') {
    message = 'Expense Description is required.';
  }
  if (expenseAmountInput.value === '') {
    message = 'Expense Amount is required.';
  }
  if (expenseCategoryIdInput.value === '') {
    message = 'Search or Add expense Category';
  }

  const data = {
    message: message,
    description: expenseDescriptionInput.value.trim(),
    amount: parseFloat(expenseAmountInput.value.trim()),
    expense_category_id: parseInt(expenseCategoryIdInput.value)
  }
  return data;
}

function extractAddExpenseCategoryModalData() {
  const modal = document.getElementById('expense-category-modal');


  const categoryNameInput = modal.querySelector('#expense-category-name');
  const categoryDescriptionInput = modal.querySelector('#expense-category-description');
  let message = 'pass';
  if (categoryNameInput.value === '') {
    message = 'Expense Category name is required.';
  }
  if (categoryDescriptionInput.value === '') {
    message = 'Expense Description is required'
  }

  const data = {
    message: message,
    name: categoryNameInput.value.trim(),
    description: categoryDescriptionInput.value.trim(),
  }
  return data;
}

async function addNewExpenseCategory() {
  const modal = document.getElementById('expense-category-modal');
  const data = extractAddExpenseCategoryModalData();
  if (data.message !== 'pass') {
    alert(`${data.message}`);
    return;
  }
  const queryType = 'INSERT';
  const query = 'INSERT INTO expense_categories (name, description) VALUES ($1, $2)';
  const queryData = [data.name, data.description];
  const responseMessage = await window.electronAPI.sendQuery('general-query', queryType, query, queryData);

  const resMes = JSON.parse(responseMessage);


  modal.style.display = 'none';

}

async function addExpenseData() {

  const data = extractExpenseModalData();
  // console.log('id on addPaymentData: ', paymentModalData.id);

  if (data.message !== 'pass') {
    alert(`${data.message}`)
  }


  const queryType = 'INSERT';
  const query = 'INSERT INTO cat_expenses (date, description, amount, expense_category_id) VALUES ($1, $2, $3, $4)';
  const queryData = [
    new Date(),
    data.description,
    data.amount,
    data.expense_category_id
  ];

  const InsertMessage = await window.electronAPI.sendQuery('general-query', queryType, query, queryData);

  const insertMessage = JSON.parse(InsertMessage);

  if (insertMessage.message !== 'Insert successful') {
    alert('Expense data insertion was not successful');
    return;
  }


}

async function addCategoriesToOptions(){
  const dataList = document.getElementById('expense-category-list');
  dataList.innerHTML = '';

  const queryType = 'SELECT';
  const query = 'SELECT * FROM expense_categories';
  const categoryRawData = await window.electronAPI.sendQuery('general-query', queryType, query);
 
  const categoryData = JSON.parse(categoryRawData);

  for (const cat of categoryData) {
    const option = document.createElement('option');
    option.id = cat.id + '';
    option.text = cat.name;
    option.value = cat.id;
    dataList.appendChild(option);
  }

  

}


function formatStatus(tr) {
  const statusElement = tr.cells[4];
  console.log(statusElement);
  if (statusElement.textContent === 'pending') {
    statusElement.innerHTML = `<span class="status inProgress">Pending</span>`;
  }

  if (statusElement.textContent === 'paid') {
    statusElement.innerHTML = `<span class="status delivered">Paid</span>`;

  }
}


function formatNumber(number) {
  return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionsDigits: 2 })
}

function formatDate(dateString) {

  const dateObject = new Date(dateString);

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false
  };

  const formatter = new Intl.DateTimeFormat(navigator.language, options);
  const formattedDate = formatter.format(dateObject);

  return formattedDate;

}