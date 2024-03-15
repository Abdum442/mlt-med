import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";
import { expenseForm } from './expenseForm.js';
import { loansForm } from './loansForm.js';
import { debitForm } from './debitForm.js';


const taxReportsBtn = document.getElementById('taxReportsBtn');
const profitLossBtn = document.getElementById('profitLossBtn');
const expenseBtn = document.getElementById('expensesBtn');
const companyLoansBtn = document.getElementById('companyLoansBtn');
const companyDebitBtn = document.getElementById('companyDebitBtn');
const pageTitle = document.querySelector('#recent_orders .cardHeader h2');

const mainContainer = document.getElementById('mainContainer');

const financialReportMgtMenu = document.getElementById('financialRreportMgt');

const addNewBtn = document.getElementById('add_new');


const taxReportTableHeader = ['ID', 'Item', 'Tax Collected', 'Tax Withheld'];
const profitLossTableHeader = ['ID', 'Item', 'Total Cost', 'Revenue', 'Unsold Cost', 'Void Cost', 'Profit/Loss'];
const expenseTableHeader = ['ID', 'Reason', 'Amount', 'Date', 'P. Method', 'Remarks'];
const loansTableHeader = ['ID', 'Purpose', 'Amount', 'Duration Days', 'Start Date', 'End Date', 'Remarks'];
const debitTableHeader = ['ID', 'Purpose', 'Amount', 'Interest Rate', 'Payment Terms', 'Remarks'];


let commonData = {
  tableId: "mainContainer",
  tableHeader: [],
  tableData: []
};

taxReportsBtn.addEventListener('click', updateTaxReports);
profitLossBtn.addEventListener('click', updateProfitLoss);
expenseBtn.addEventListener('click', updateExpenses);
addNewBtn.addEventListener('click', function(){
  if (pageTitle.textContent === 'Company Expenses') {
    registerExpense();
  }
  if (pageTitle.textContent === 'Company Loans'){
    registerLoan();
  }
  if (pageTitle.textContent === 'Company Debit'){
    registerDebit();
  }

});
companyDebitBtn.addEventListener('click', updateDebit);

companyLoansBtn.addEventListener('click', updateLoans);

function updateTaxReports() {
  pageTitle.innerHTML = 'Tax Report'
  const salesData = JSON.parse(localStorage.getItem('sales-data'));
  const purchaseData = JSON.parse(localStorage.getItem('purchase-data'))

  const taxReportTableData = JSON.parse(localStorage.getItem('products-data')).map(product =>{
    let tax_collected = 0; let tax_payable = 0.00;
    for (const sales of salesData) {
      if(product.id == sales.product_id){

        tax_collected += Number(sales.tax_withheld);
      }
    }
    for (const purchase of purchaseData) {
      if (product.id == purchase.product_id){
        tax_payable = Number(purchase.tax_withheld);
      }
    }
    console.log('tax_payable: ', tax_payable);
    return [product.id, product.name, tax_collected.toFixed(2).toLocaleString(), tax_payable.toFixed(2).toLocaleString()];
  });
  commonData.tableHeader = taxReportTableHeader;
  commonData.tableData = taxReportTableData;

  const taxReportTable = new CreateTableFromData(commonData);
  taxReportTable.renderTable();
}

function updateProfitLoss() {
  pageTitle.innerHTML = "Profit/Loss Report"
  const salesData = JSON.parse(localStorage.getItem('sales-data'));
  const purchaseData = JSON.parse(localStorage.getItem('purchase-data'));
  const stockData = JSON.parse(localStorage.getItem('stock-data'));
  const productData = JSON.parse(localStorage.getItem('products-data'));

  const profitLossTableData = productData.map(product => {
    let cost; let total_sold = 0; let unsold_qty; let void_qty = 0;
    for(const purchase of purchaseData) {
      if (product.id == purchase.product_id) {
        cost = parseFloat(purchase.amount_paid);
      }
    }
    for (const stock of stockData) {
      if (product.id == stock.product_id) {
        unsold_qty = parseInt(stock.quantity) * parseFloat(product.purchase_price);
      }
    }
    for (const sales of salesData) {
      if (product.id == sales.product_id) {
        total_sold += parseFloat(sales.amount_received);
      }
    }
    const profit_loss = total_sold + unsold_qty - cost;
    return [product.id, product.name, isNaN(cost) ? 0.00 : cost.toLocaleString(), isNaN(total_sold) ? 0.00 : total_sold.toLocaleString(), 
      isNaN(unsold_qty) ? 0.00 : unsold_qty.toLocaleString(), isNaN(void_qty) ? 0.00 : void_qty.toLocaleString(), isNaN(profit_loss) ? 0.00 : profit_loss.toLocaleString()];
  });

  commonData.tableHeader = profitLossTableHeader;
  commonData.tableData = profitLossTableData;

  const profitLossTable = new CreateTableFromData(commonData);
  profitLossTable.renderTable();

}
// Expenses related
function updateExpenses() {
  const expensesData = JSON.parse(localStorage.getItem('expenses-data'));

  const expenseTableData = expensesData.map(expense => [expense.id, expense.description, expense.amount, formatDate(expense.expense_date),
                                                          expense.payment_method, expense.remarks]);
  addNewBtn.style.display = 'block';
  pageTitle.innerHTML = 'Company Expenses';

  commonData.tableHeader = expenseTableHeader;
  commonData.tableData = expenseTableData;

  const expenseHTMLtable = new CreateTableFromData(commonData);

  expenseHTMLtable.renderTable();
}

function registerExpense() {
  pageTitle.textContent = 'Expense Registry'
  addNewBtn.style.display = 'none';
  expenseForm.showExpenseForm();
  const expenseHTMLForm = document.getElementById('expenseForm');

  expenseHTMLForm.parentElement.querySelector('#modify_btn').style.display = 'none';

  expenseHTMLForm.querySelector('#expense_date').value = new Date().toISOString().slice(0, 10);

  const saveBtn = expenseHTMLForm.parentElement.querySelector('#save_btn');

  saveBtn.addEventListener('click', saveExpenseData);


  const errorDisplay = document.querySelector('.error-display');
  

  async function saveExpenseData() {
    errorDisplay.querySelector('ul').innerHTML = '';
    errorDisplay.querySelector('ul').style.listStyle = 'none';
    const expenseData = {
      description: expenseHTMLForm.querySelector('#description').value,
      amount: expenseHTMLForm.querySelector('#amount').value,
      expense_date: expenseHTMLForm.querySelector('#expense_date').value,
      payment_method: expenseHTMLForm.querySelector('#payment-method').value,
      remarks: expenseHTMLForm.querySelector('#remark').value
    }
    let checkData = false; 
    console.log('Amount: ', expenseData.amount);
    if (expenseData.description === '') {
      const descriptionError = document.createElement('li');
      descriptionError.innerHTML = `<span style="color:red">* Purpose is required </span>`;
      errorDisplay.querySelector('ul').appendChild(descriptionError);
      errorDisplay.style.display = 'block';
      checkData = true;
    } 
    if (expenseData.amount === '') {
      const error = document.createElement('li');
      error.innerHTML = `<span style="color:red">* Amount is required </span>`;
      errorDisplay.querySelector('ul').appendChild(error);
      errorDisplay.style.display = 'block';
      checkData = true;
    }

    if (expenseData.expense_date === '') {
      const error = document.createElement('li');
      error.innerHTML = `<span style="color:red">* Expense Date is required </span>`;
      errorDisplay.querySelector('ul').appendChild(error);
      errorDisplay.style.display = 'block';
      checkData = true;
    }

    if (!checkData) {
      const expense = await window.electronAPI.fetchData('add-expenses-data', expenseData);

      mainContainer.innerHTML = '';
      financialReportMgtMenu.click();
      setTimeout(() => {
        expenseBtn.click();
      }, 1000);
    }
  }
}

// Loans related

function updateLoans() {
  const loansData = JSON.parse(localStorage.getItem('loans-data'));

  const loansTableData = loansData.map(loan => [loan.id, loan.purpose, loan.amount, loan.duration_days, 
    formatDate(loan.start_date), formatDate(loan.end_date), loan.remarks]);
  addNewBtn.style.display = 'block';
  pageTitle.innerHTML = 'Company Loans';

  commonData.tableHeader = loansTableHeader;
  commonData.tableData = loansTableData;

  const loansHTMLtable = new CreateTableFromData(commonData);

  loansHTMLtable.renderTable();
}

function registerLoan() {
  addNewBtn.style.display = 'none';
  loansForm.showLoansForm();
  const loansHTMLForm = document.getElementById('loansForm');

  loansHTMLForm.parentElement.querySelector('#modify_btn').style.display = 'none';

  loansHTMLForm.querySelector('#start-date').value = new Date().toISOString().slice(0, 10);
  loansHTMLForm.querySelector('#end-date').value = new Date().toISOString().slice(0, 10);


  const saveBtn = loansHTMLForm.parentElement.querySelector('#save_btn');

  saveBtn.addEventListener('click', saveLoanData);


  const errorDisplay = document.querySelector('.error-display');


  async function saveLoanData() {
    errorDisplay.querySelector('ul').innerHTML = '';
    errorDisplay.querySelector('ul').style.listStyle = 'none';

    const loanData = {
      purpose: loansHTMLForm.querySelector('#purpose').value,
      amount: loansHTMLForm.querySelector('#amount').value,
      duration_days: loansHTMLForm.querySelector('#duration-days').value,
      start_date: loansHTMLForm.querySelector('#start-date').value,
      end_date: loansHTMLForm.querySelector('#end-date').value,
      remarks: loansHTMLForm.querySelector('#remark').value
    }
    let checkData = false;
    if (loanData.purpose === '') {
      const descriptionError = document.createElement('li');
      descriptionError.innerHTML = `<span style="color:red">* Purpose is required </span>`;
      errorDisplay.querySelector('ul').appendChild(descriptionError);
      errorDisplay.style.display = 'block';
      checkData = true;
    }
    if (loanData.amount === '') {
      const error = document.createElement('li');
      error.innerHTML = `<span style="color:red">* Amount is required </span>`;
      errorDisplay.querySelector('ul').appendChild(error);
      errorDisplay.style.display = 'block';
      checkData = true;
    }

    if (loanData.duration_days === '') {
      const error = document.createElement('li');
      error.innerHTML = `<span style="color:red">* Duration Days is required </span>`;
      errorDisplay.querySelector('ul').appendChild(error);
      errorDisplay.style.display = 'block';
      checkData = true;
    }
    if (loanData.start_date === '') {
      const error = document.createElement('li');
      error.innerHTML = `<span style="color:red">* Start Date is required </span>`;
      errorDisplay.querySelector('ul').appendChild(error);
      errorDisplay.style.display = 'block';
      checkData = true;
    }

    if (loanData.end_date === '') {
      const error = document.createElement('li');
      error.innerHTML = `<span style="color:red">* End Date is required </span>`;
      errorDisplay.querySelector('ul').appendChild(error);
      errorDisplay.style.display = 'block';
      checkData = true;
    }

    if (!checkData) {
      const expense = await window.electronAPI.fetchData('add-loans-data', loanData);

      mainContainer.innerHTML = '';
      financialReportMgtMenu.click();
      setTimeout(() => {
        companyLoansBtn.click();
      }, 1000);
    }
  }
}

//Company debit related

function updateDebit() {
  const debitsData = JSON.parse(localStorage.getItem('debit-data'));

  const debitsTableData = debitsData.map(debit => [debit.id, debit.purpose, debit.amount, debit.interest_rate,
    debit.payment_terms, debit.remarks]);
  addNewBtn.style.display = 'block';
  pageTitle.innerHTML = 'Company Debit';

  commonData.tableHeader = debitTableHeader;
  commonData.tableData = debitsTableData;

  const debitHTMLtable = new CreateTableFromData(commonData);

  debitHTMLtable.renderTable();
}

function registerDebit() {
  addNewBtn.style.display = 'none';
  debitForm.showDebitForm();

  const debitHTMLForm = document.getElementById('debitForm');

  debitHTMLForm.parentElement.querySelector('#modify_btn').style.display = 'none';


  const saveBtn = debitHTMLForm.parentElement.querySelector('#save_btn');

  saveBtn.addEventListener('click', saveDebitData);


  const errorDisplay = document.querySelector('.error-display');


  async function saveDebitData() {
    errorDisplay.querySelector('ul').innerHTML = '';
    errorDisplay.querySelector('ul').style.listStyle = 'none';

    const debitData = {
      purpose: debitHTMLForm.querySelector('#purpose').value,
      amount: debitHTMLForm.querySelector('#amount').value,
      interest_rate: debitHTMLForm.querySelector('#interest-rate').value,
      payment_terms: debitHTMLForm.querySelector('#payment-terms').value,
      remarks: debitHTMLForm.querySelector('#remark').value
    }
    let checkData = false;
    if (debitData.purpose === '') {
      const descriptionError = document.createElement('li');
      descriptionError.innerHTML = `<span style="color:red">* Purpose is required </span>`;
      errorDisplay.querySelector('ul').appendChild(descriptionError);
      errorDisplay.style.display = 'block';
      checkData = true;
    }
    if (debitData.amount === '') {
      const error = document.createElement('li');
      error.innerHTML = `<span style="color:red">* Amount is required </span>`;
      errorDisplay.querySelector('ul').appendChild(error);
      errorDisplay.style.display = 'block';
      checkData = true;
    }

    if (!checkData) {
      const debit_id = await window.electronAPI.fetchData('add-debit-data', debitData);

      mainContainer.innerHTML = '';
      financialReportMgtMenu.click();

      setTimeout(() => {
        companyDebitBtn.click();
      }, 1000);
    }
  }
}

//tools
function formatDate(dateString) {
  // Parse the date string using Date.parse() for better compatibility
  const dateObject = new Date(dateString);

  // Define default formatting options
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



