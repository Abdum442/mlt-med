import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const financialMgt = document.getElementById('financialReportMgt');
const payableBtn = document.getElementById('payable-btn');
const detailsContainer = document.body.querySelector('.details .recentOrders');

payableBtn.addEventListener('click', function () {
  
  detailsContainer.innerHTML = '';
  const payableContainer = payableTabContainer();

  detailsContainer.appendChild(payableContainer);

  const payableContent = document.getElementById('payable-content');
  const payPaymentContent = document.getElementById('payable-payment-content');

  const newPayableArea = document.createElement('div');
  newPayableArea.className = 'add-new-sales';

  const newPayableBtn = document.createElement('button');
  newPayableBtn.textContent = 'Add New Payable';

  newPayableArea.appendChild(newPayableBtn);

  payableContent.appendChild(newPayableArea);

  const payableTableContainer = document.createElement('div');
  payableTableContainer.id = 'payable-table';

  const payMadeTableContainer = document.createElement('div');
  payMadeTableContainer.id = 'payment-made-table';

  payableContent.appendChild(payableTableContainer);

  const payableModal = createAddPayableModal();
  payableContent.appendChild(payableModal);
  payableModal.style.display = 'none';

  const payPaymentModal = createPaymentModal();
  payPaymentContent.appendChild(payPaymentModal);
  payPaymentModal.style.display = 'none';

  payPaymentContent.appendChild(payMadeTableContainer);

  newPayableBtn.addEventListener('click', function(){
    payableModal.style.display = 'block';
  })

  manageTabEvents();

  payablesTable();
  paymentMade();

  payableModal.querySelector('.payable-save').addEventListener('click', async function () {
    await addNewPayableData();
  });

  payPaymentModal.querySelector('.payable-save').addEventListener('click', async function (){
    await addPaymentData();
    payableBtn.click();
    payPaymentModal.style.display = 'none';
    document.getElementById('payable-payment-tab').click();

  })
})

function payableTabContainer() {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.id = "payable-container"

  tabContainer.innerHTML = `<div class="tab">
              <button class="tab-link" id="payable-tab" style="width:auto; padding: 20px 30px;">Payables</button>
              <button class="tab-link" id="payable-payment-tab" style="width:auto; padding: 20px 30px;">Payments Made</button>
            </div>
            <div class="tab-content" id="payable-content">
    
            </div>
            <div class="tab-content" id="payable-payment-content">
              <h2>Table of Payments made</h2>
            </div>`;
  return tabContainer;
}

function manageTabEvents() {
  const salesTab = document.getElementById('payable-tab');
  const orderTab = document.getElementById('payable-payment-tab');

  salesTab.addEventListener('click', function () {
    manageTabs('payable-tab', 'payable-content')
  });
  orderTab.addEventListener('click', function () {
    manageTabs('payable-payment-tab', 'payable-payment-content')
  });

  salesTab.click();
}
function manageTabs(tabId, contId) {
  const tab = document.getElementById(tabId);
  const tabCont = document.getElementById(contId);
  var i, tabLinks, tabContents;
  tabLinks = document.getElementsByClassName('tab-link');
  tabContents = document.getElementsByClassName('tab-content')
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove('active');
    tabContents[i].style.display = 'none';
  }
  tab.classList.add('active');
  tabCont.style.display = 'block';
}

async function payablesTable(){
const tableContainer = document.getElementById('payable-table');
const tableHead = ['ID', 'Amount', 'Description', 'Due Date', 'Status', 'Amount Left'];

  let commonData = {
    tableId: "payable-table",
    tableHeader: tableHead,
    tableData: []
  };

  const queryType = 'SELECT';
  const query = 'SELECT * FROM payables';
  const payablesRawData = await window.electronAPI.sendQuery('general-query', queryType, query);

  const payableObjData = JSON.parse(payablesRawData);

  const payableData = payableObjData.map(pay => [
    pay.id, 
    formatNumber(parseFloat(pay.amount)), 
    pay.description, 
    formatDate(pay.due_date), 
    pay.status, 
    formatNumber(parseFloat(pay.amount_left)),
  ]);

  commonData.tableData = payableData;

  const tableObjFunc = new CreateTableFromData(commonData);

  tableObjFunc.renderTable();

  clickable_dropdown_btn(tableContainer.querySelector('table'));

  tableContainer.querySelectorAll('table tbody tr').forEach(tr => {
    formatStatus(tr);
    const modifyBtn = tr.querySelector('td .drop-content a.modify');
    const deleteBtn = tr.querySelector('td .drop-content a.delete');
    
    tr.querySelector('td .drop-btn').addEventListener('click', (event) => {
      event.stopPropagation();
      tr.querySelector('td .dropdown-btn .drop-content').classList.add('show');
      deleteBtn.style.display = 'none';
      modifyBtn.textContent = 'Pay';
    })

    modifyBtn.addEventListener('click', async function (event) {
      event.stopPropagation();
      const payableId = getIDfromPayableRow(tr);

      const payableData = await getPayableDataById(payableId);
      console.log('payable data: ', payableData);

      partialFillPaymentModal(payableData);

      document.getElementById('payable-payment-tab').click();
      document.getElementById('payment-modal').style.display = 'block';




    })
  })
}

async function paymentMade() {
  // const tableContainer = document.getElementById('payable-table');
  const tableHead = ['ID', 'Description', 'Payable ID', 'Amount', 'Payment Date'];

  let commonData = {
    tableId: "payment-made-table",
    tableHeader: tableHead,
    tableData: []
  };

  const queryType = 'SELECT';
  const query = `SELECT
                    pm.id,
                    pay.description AS description,
                    pm.payable_id,
                    pm.amount,
                    pm.payment_date  
                 FROM payments_made pm
                 JOIN payables pay ON pay.id = pm.payable_id`;
  const paymentsRawData = await window.electronAPI.sendQuery('general-query', queryType, query);

  const paymentsObjData = JSON.parse(paymentsRawData);

  const paymentsData = paymentsObjData.map(pay => [
    pay.id,
    pay.description,
    pay.payable_id,
    formatNumber(parseFloat(pay.amount)),
    formatDate(pay.payment_date),
  ]);

  commonData.tableData = paymentsData;

  const tableObjFunc = new CreateTableFromData(commonData);

  tableObjFunc.renderTable();

  

}

function createAddPayableModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'payable-modal'
  modal.innerHTML =
    `<div class="modal-content">
      <span onclick="document.getElementById('payable-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
      <h2>Add Payable Details</h2>
      <div class="form-container">
          <label for="payable-description">Description</label>
          <textarea name="payableDescription" id="payable-description" style="width:100%; height:50px;resize:vertical;"></textarea>
        <div class="row">
          <div class="col-50">
            <label for="payable-amount">Amount</label>
            <input type="text" id="payable-amount" name="payableAmount">
          </div>
          <div class="col-50">
            <label for="payable-due-date">Due Date</label>
            <input type="date" id="payable-due-date">
          </div>
        </div>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn payable-save">Save</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('payable-modal').style.display='none'" class="btn" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
  return modal;
}

function createPaymentModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'payment-modal'
  modal.innerHTML =
    `<div class="modal-content">
      <span onclick="document.getElementById('payment-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
      <h2>Add Payable Details</h2>
      <div class="form-container">
        <div class="row">
          <div class='col-50'>
            <label for="payment-description">Description</label>
            <textarea name="payableDescription" id="payment-description" style="width:100%; height:50px;resize:vertical;"></textarea>
          </div>
          <div class="col-50">
            <label for="payment-amount-left">Amount Left</label>
            <input type="text" id="payment-amount-left" name="paymentAmountLeft">
          </div>
        </div>
        <div class="row">
          <div class="col-50">
            <label for="payment-due-date">Due Date</label>
            <input type="text" id="payment-due-date">
          </div>
          <div class="col-50">
            <label for="payment-amount">Payment Amount</label>
            <input type="text" id="payment-amount">
          </div>
          <input type='hidden' id='payable-id'>
        </div>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn payable-save">Save</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('payment-modal').style.display='none'" class="btn" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
  return modal;
}

function extractPayableModalData() {
  const payableModal = document.getElementById('payable-modal');

  const payableDescriptionInput = payableModal.querySelector('#payable-description');
  const payableAmountInput = payableModal.querySelector('#payable-amount');
  const payableDueDateInput = payableModal.querySelector('#payable-due-date');
  let message = 'pass';
  if(payableDescriptionInput.value === ''){
    message = 'Payable Description is required.';
  }
  if(payableAmountInput.value === ''){
    message = 'Payable Amount is required.';
  }
  if(payableDueDateInput.value === ''){
    message = 'Payment Due Date is required';
  }

  const data = {
    message: message,
    description: payableDescriptionInput.value.trim(),
    amount: parseFloat(payableAmountInput.value.trim()),
    due_date: payableDueDateInput.value
  }
  return data;
}

function extractPaymentModalData() {
  const paymentModal = document.getElementById('payment-modal');

  const paymentAmountInput = paymentModal.querySelector('#payment-amount');
  const payableId = parseInt(paymentModal.querySelector('#payable-id').value);
  let message = 'pass';
  if (paymentAmountInput.value === '') {
    message = 'Payment amount is required.';
  }

  const data = {
    message: message,
    amount: parseFloat(paymentAmountInput.value.trim()),
    id: payableId,
  }
  return data;
}

async function addNewPayableData(){
const payableModal = document.getElementById('payable-modal');
const data = extractPayableModalData();
if(data.message !== 'pass'){
  alert(`${data.message}`);
  return;
}
const queryType = 'INSERT';
const query = 'INSERT INTO payables (description, amount, due_date, amount_left, status) VALUES ($1, $2, $3, $4, $5)';
const queryData = [data.description, data.amount, data.due_date, data.amount, 'pending'];
const responseMessage = await window.electronAPI.sendQuery('general-query', queryType, query, queryData);

const resMes = JSON.parse(responseMessage);


payableModal.style.display = 'none';

}

function getIDfromPayableRow(tr) {
return parseInt(tr.cells[0].textContent);
}

async function partialFillPaymentModal(payableData) {
  const paymentModal = document.getElementById('payment-modal');
  // console.log('due date: ', payableData[0].id)  

  paymentModal.querySelector('#payable-id').value = payableData[0].id;
  paymentModal.querySelector('#payment-description').value = payableData[0].description;
  paymentModal.querySelector('#payment-amount-left').value = formatNumber(parseFloat(payableData[0].amount_left));
  paymentModal.querySelector('#payment-due-date').value = formatDate(payableData[0].due_date);

  paymentModal.querySelector('#payment-description').disabled = true;
  paymentModal.querySelector('#payment-amount-left').disabled = true;
  paymentModal.querySelector('#payment-due-date').disabled = true;
}

async function addPaymentData() {
  
  const paymentModalData = extractPaymentModalData();
  console.log('id on addPaymentData: ', paymentModalData.id);
  const payableData = await getPayableDataById(paymentModalData.id);

  console.log('payableData on addPaymetData: ', payableData);

  if(paymentModalData.message !== 'pass') {
    alert(`${paymentModalData.message}`)
  }

  const leftAmount = payableData[0].amount_left - paymentModalData.amount;

  const payableQueryType = 'UPDATE';
  const payableQuery = 'UPDATE payables SET amount_left = $1, status = $2 WHERE id = $3';
  const payableQueryData = [
    leftAmount,
    leftAmount <= 0 ? 'paid' : 'pending',
    paymentModalData.id
  ];

  const payableUpdateMessage = await window.electronAPI.sendQuery('general-query', payableQueryType, payableQuery, payableQueryData);

  const updateMessage = JSON.parse(payableUpdateMessage);

  if (updateMessage.message !== 'Update successful') {
    alert('Updating of Payable is not successful!');
    return;
  }

  const paymentQueryType = 'INSERT';
  const paymentQuery = 'INSERT INTO payments_made (payable_id, amount, payment_date) VALUES ($1, $2, $3)';
  const paymentQueryData = [
    paymentModalData.id,
    paymentModalData.amount, 
    new Date()
  ];

  const paymentInsertMessage = await window.electronAPI.sendQuery('general-query', paymentQueryType, paymentQuery, paymentQueryData);

  const insertMessage = JSON.parse(paymentInsertMessage);

  if(insertMessage.message !== 'Insert successful') {
    alert('payment data insertion was not successful');
    return;
  }


}

async function getPayableDataById(id) {
  const queryType = 'SELECT';
  const query = 'SELECT * FROM payables WHERE id = $1';
  const queryData = [id];
  const payablesRawData = await window.electronAPI.sendQuery('general-query', queryType, query, queryData);

  return JSON.parse(payablesRawData);
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