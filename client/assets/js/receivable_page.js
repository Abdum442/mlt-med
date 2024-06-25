import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const financialMgt = document.getElementById('financialReportMgt');
const receivableBtn = document.getElementById('receivable-btn');
const detailsContainer = document.body.querySelector('.details .recentOrders');

receivableBtn.addEventListener('click', function () {

  detailsContainer.innerHTML = '';
  const receivableContainer = receivableTabContainer();

  detailsContainer.appendChild(receivableContainer);

  const receivableContent = document.getElementById('receivable-content');
  const recPaymentContent = document.getElementById('receivable-payment-content');

  const newReceivableArea = document.createElement('div');
  newReceivableArea.className = 'add-new-sales';

  const newReceivableBtn = document.createElement('button');
  newReceivableBtn.textContent = 'Add New Receivable';

  newReceivableArea.appendChild(newReceivableBtn);

  receivableContent.appendChild(newReceivableArea);

  const receivableTableContainer = document.createElement('div');
  receivableTableContainer.id = 'receivable-table';

  const recMadeTableContainer = document.createElement('div');
  recMadeTableContainer.id = 'payment-received-table';

  receivableContent.appendChild(receivableTableContainer);

  const receivableModal = createAddReceivableModal();
  receivableContent.appendChild(receivableModal);
  receivableModal.style.display = 'none';

  const recPaymentModal = createPaymentModal();
  recPaymentContent.appendChild(recPaymentModal);
  recPaymentModal.style.display = 'none';

  recPaymentContent.appendChild(recMadeTableContainer);

  newReceivableBtn.addEventListener('click', function () {
    receivableModal.style.display = 'block';
  })

  manageTabEvents();

  receivableTable();
  paymentMade();

  receivableModal.querySelector('.receivable-save').addEventListener('click', async function () {
    await addNewReceivableData();
  });

  recPaymentModal.querySelector('.receivable-save').addEventListener('click', async function () {
    await addPaymentData();
    receivableBtn.click();
    recPaymentModal.style.display = 'none';
    document.getElementById('receivable-payment-tab').click();

  })
})

function receivableTabContainer() {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.id = "receivable-container"

  tabContainer.innerHTML = `<div class="tab">
                              <button class="tab-link" id="receivable-tab" style="width:auto; padding: 20px 30px;">Receivables</button>
                              <button class="tab-link" id="receivable-payment-tab" style="width:auto; padding: 20px 30px;">Payments Received</button>
                            </div>
                            <div class="tab-content" id="receivable-content">
    
                            </div>
                           <div class="tab-content" id="receivable-payment-content">
                             <h2>Table of Payments received</h2>
                           </div>`;
  return tabContainer;
}

function manageTabEvents() {
  const salesTab = document.getElementById('receivable-tab');
  const orderTab = document.getElementById('receivable-payment-tab');

  salesTab.addEventListener('click', function () {
    manageTabs('receivable-tab', 'receivable-content')
  });
  orderTab.addEventListener('click', function () {
    manageTabs('receivable-payment-tab', 'receivable-payment-content')
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

async function receivableTable() {
  const tableContainer = document.getElementById('receivable-table');
  const tableHead = ['ID', 'Amount', 'Description', 'Due Date', 'Status', 'Amount Left'];

  let commonData = {
    tableId: "receivable-table",
    tableHeader: tableHead,
    tableData: []
  };

  const queryType = 'SELECT';
  const query = 'SELECT * FROM receivables';
  const receivableRawData = await window.electronAPI.sendQuery('general-query', queryType, query);

  const receivableObjData = JSON.parse(receivableRawData);

  const receivableData = receivableObjData.map(pay => [
    pay.id,
    formatNumber(parseFloat(pay.amount)),
    pay.description,
    formatDate(pay.due_date),
    pay.status,
    formatNumber(parseFloat(pay.amount_left)),
  ]);

  commonData.tableData = receivableData;

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
      modifyBtn.textContent = 'Receive';
    })

    modifyBtn.addEventListener('click', async function (event) {
      event.stopPropagation();
    
      const receivableId = getIDfromReceivableRow(tr);

      const receivableData = await getReceivableDataById(receivableId);
      // console.log('receivable data: ', receivableData);

      partialFillPaymentModal(receivableData);

      document.getElementById('receivable-payment-tab').click();
      document.getElementById('payment-modal').style.display = 'block';




    })
  })
}

async function paymentMade() {
  // const tableContainer = document.getElementById('payable-table');
  const tableHead = ['ID', 'Receivable ID', 'Amount', 'Payment Date'];

  let commonData = {
    tableId: "payment-received-table",
    tableHeader: tableHead,
    tableData: []
  };

  const queryType = 'SELECT';
  const query = 'SELECT * FROM payments_received';
  const paymentsRawData = await window.electronAPI.sendQuery('general-query', queryType, query);

  const paymentsObjData = JSON.parse(paymentsRawData);

  const paymentsData = paymentsObjData.map(pay => [
    pay.id,
    pay.receivable_id,
    formatNumber(parseFloat(pay.amount)),
    formatDate(pay.payment_date),
  ]);

  commonData.tableData = paymentsData;

  const tableObjFunc = new CreateTableFromData(commonData);

  tableObjFunc.renderTable();



}

function createAddReceivableModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'receivable-modal'
  modal.innerHTML =
    `<div class="modal-content">
      <span onclick="document.getElementById('receivable-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
      <h2>Add Receivable Details</h2>
      <div class="form-container">
          <label for="receivable-description">Description</label>
          <textarea name="receivableDescription" id="receivable-description" style="width:100%; height:50px;resize:vertical;"></textarea>
        <div class="row">
          <div class="col-50">
            <label for="receivable-amount">Amount</label>
            <input type="text" id="receivable-amount" name="receivableAmount">
          </div>
          <div class="col-50">
            <label for="receivable-due-date">Due Date</label>
            <input type="date" id="receivable-due-date">
          </div>
        </div>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn receivable-save">Save</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('receivable-modal').style.display='none'" class="btn" style="background-color:red">Exit</button>
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
          <input type='hidden' id='receivable-id'>
        </div>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn receivable-save">Save</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('payment-modal').style.display='none'" class="btn" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
  return modal;
}

function extractReceivableModalData() {
  const payableModal = document.getElementById('receivable-modal');

  const receivableDescriptionInput = payableModal.querySelector('#receivable-description');
  const receivableAmountInput = payableModal.querySelector('#receivable-amount');
  const receivableDueDateInput = payableModal.querySelector('#receivable-due-date');
  let message = 'pass';
  if (receivableDescriptionInput.value === '') {
    message = 'Payable Description is required.';
  }
  if (receivableAmountInput.value === '') {
    message = 'Payable Amount is required.';
  }
  if (receivableDueDateInput.value === '') {
    message = 'Payment Due Date is required';
  }

  const data = {
    message: message,
    description: receivableDescriptionInput.value.trim(),
    amount: parseFloat(receivableAmountInput.value.trim()),
    due_date: receivableDueDateInput.value
  }
  return data;
}

function extractPaymentModalData() {
  const paymentModal = document.getElementById('payment-modal');

  const paymentAmountInput = paymentModal.querySelector('#payment-amount');
  const payableId = parseInt(paymentModal.querySelector('#receivable-id').value);
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

async function addNewReceivableData() {
  const receivableModal = document.getElementById('receivable-modal');
  const data = extractReceivableModalData();
  if (data.message !== 'pass') {
    alert(`${data.message}`);
    return;
  }
  const queryType = 'INSERT';
  const query = 'INSERT INTO receivables (description, amount, due_date, amount_left, status) VALUES ($1, $2, $3, $4, $5)';
  const queryData = [data.description, data.amount, data.due_date, data.amount, 'pending'];
  const responseMessage = await window.electronAPI.sendQuery('general-query', queryType, query, queryData);

  const resMes = JSON.parse(responseMessage);


  receivableModal.style.display = 'none';

}

function getIDfromReceivableRow(tr) {
  return parseInt(tr.cells[0].textContent);
}

async function partialFillPaymentModal(payableData) {
  const paymentModal = document.getElementById('payment-modal');

  // console.log('due date: ', payableData[0].id) 

  paymentModal.querySelector('#receivable-id').value = payableData[0].id;
  paymentModal.querySelector('#payment-description').value = payableData[0].description;
  paymentModal.querySelector('#payment-amount-left').value = formatNumber(parseFloat(payableData[0].amount_left));
  paymentModal.querySelector('#payment-due-date').value = formatDate(payableData[0].due_date);

  paymentModal.querySelector('#payment-description').disabled = true;
  paymentModal.querySelector('#payment-amount-left').disabled = true;
  paymentModal.querySelector('#payment-due-date').disabled = true;
}

async function addPaymentData() {

  const paymentModalData = extractPaymentModalData();
  // console.log('id on addPaymentData: ', paymentModalData.id);
  const payableData = await getReceivableDataById(paymentModalData.id);

  // console.log('payableData on addPaymentData: ', payableData);

  if (paymentModalData.message !== 'pass') {
    alert(`${paymentModalData.message}`)
  }

  const leftAmount = payableData[0].amount_left - paymentModalData.amount;

  const payableQueryType = 'UPDATE';
  const payableQuery = 'UPDATE receivables SET amount_left = $1, status = $2 WHERE id = $3';
  const payableQueryData = [
    leftAmount,
    leftAmount <= 0 ? 'received' : 'pending',
    paymentModalData.id
  ];

  const payableUpdateMessage = await window.electronAPI.sendQuery('general-query', payableQueryType, payableQuery, payableQueryData);

  const updateMessage = JSON.parse(payableUpdateMessage);

  if (updateMessage.message !== 'Update successful') {
    alert('Updating of Receivable is not successful!');
    return;
  }

  const paymentQueryType = 'INSERT';
  const paymentQuery = 'INSERT INTO payments_received (receivable_id, amount, payment_date) VALUES ($1, $2, $3)';
  const paymentQueryData = [
    paymentModalData.id,
    paymentModalData.amount,
    new Date()
  ];

  const paymentInsertMessage = await window.electronAPI.sendQuery('general-query', paymentQueryType, paymentQuery, paymentQueryData);

  const insertMessage = JSON.parse(paymentInsertMessage);

  if (insertMessage.message !== 'Insert successful') {
    alert('payment data insertion was not successful');
    return;
  }


}

async function getReceivableDataById(id) {
  const queryType = 'SELECT';
  const query = 'SELECT * FROM receivables WHERE id = $1';
  const queryData = [id];
  const payablesRawData = await window.electronAPI.sendQuery('general-query', queryType, query, queryData);

  return JSON.parse(payablesRawData);
}

function formatStatus(tr) {
 const statusElement = tr.cells[4];
 console.log(statusElement);
 if(statusElement.textContent === 'pending'){
  statusElement.innerHTML = `<span class="status pending">Pending</span>`;
 }
 
 if(statusElement.textContent === 'received'){
   statusElement.innerHTML = `<span class="status delivered">Received</span>`;

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