import { salesPage } from './sales_page.js';

const modalLoader = document.getElementById('modal-loader');

let productData = await salesPage.getProductData();
let customerData = await salesPage.getCustomerData();
await reloadData();


async function reloadData () {
  modalLoader.style.display = 'block';
  productData = await salesPage.getProductData();
  customerData = await salesPage.getCustomerData();

  salesPage.makeSalesPage(productData, customerData);

  const salesReloadBtn = document.getElementById('sales-exit-btn');
  const salesSaveOrderBtn = document.getElementById('sales-save-order-btn');
  const salesCheckoutBtn = document.getElementById('sales-checkout-btn');
  

  salesReloadBtn.addEventListener('click', async function () {
    await reloadData();
  });

  salesSaveOrderBtn.addEventListener('click', async function () {
    await performOrderSold('hold');
  })

  salesCheckoutBtn.addEventListener('click', async function () {
    console.log('Checkout Button is Clicked!')
    await performOrderSold('sold');
  })
  
  modalLoader.style.display = 'none';
}

// async function printHoldOrders (product_data, customer_data) {
//   const holdContent = makeOrderHold();
//   salesHoldTabContent.appendChild(holdContent);
//   const hold_table_body = holdContent.querySelector('table tbody');
//   hold_table_body.innerHTML = '';
//   const productNameInput = document.getElementById('sales-item-name');
//   const customerNameInput = document.getElementById('sales-customer-name');
//   const quantityOrderedInput = document.getElementById('sales-product-quantity');
//   const stockLevelInput = document.getElementById('sales-stock-level');
//   const salesAddOrderBtn = document.getElementById('sales-add-order');

//   const ordersObjectData = JSON.parse(localStorage.getItem('orders-data'));
//   const customerObjData = customer_data;

//   const salesObjectData = JSON.parse(localStorage.getItem('sales-data'));
//   const productObjectData = product_data;

//   const orderTableBody = document.getElementById('sales-current-order').querySelector('table tbody');

//   const query = `SELECT 
//                     so.id AS id,
//                     r.name AS customer_name,
//                     so.customer_id AS customer_id,
//                     so.order_date AS date,
//                     so.amount_remaining AS unpaid_amount
//                   FROM sales_order so
//                   JOIN retailers r on r.id = so.customer_id
//                   WHERE checkout_status = 'hold'
//                   ORDER BY so.order_date DESC`;
//   const holdOrderRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', query);

//   const holdOrderObjData = JSON.parse(holdOrderRawData);

//   const holdOrderData = holdOrderObjData.map(hold => [
//     hold.id, hold.customer_name, hold.customer_id,
//     formatDate(hold.date), formatNumber(parseFloat(hold.unpaid_amount))
//   ]);

//   holdOrderData.forEach(hold => {
//     const trow = document.createElement('tr');
//     hold.forEach(entry => {
//       const tdata = document.createElement('td');
//       tdata.textContent = entry;
//       trow.appendChild(tdata);
//     })

//     const tdBtn = document.createElement('td');
//     tdBtn.className = 'action'
//     const actionBtn = dropDownBtn();

//     tdBtn.appendChild(actionBtn);
//     trow.appendChild(tdBtn);

//     hold_table_body.appendChild(trow);
//     const expandBtn = tdBtn.querySelector('a.modify');
//     const removeBtn = tdBtn.querySelector('a.delete');

//     expandBtn.addEventListener('click', async function () {
//       const orderTab = document.getElementById('sales-order-tab');
//       orderTab.click();
//       orderTableBody.innerHTML = '';

//       salesObjectData.map(async sales => {
//         if ( sales.order_id === hold[0] ) {
//           const matchProductObj = productObjectData.find(prodObj => 
//             sales.product_id === prodObj.id);
//           productNameInput.value = matchProductObj.name;
           
//           simulateChangeEvent(productNameInput);
//           const stockLevel = stockLevelInput.value;
//           if (stockLevel === 'Out of Stock') {
//             quantityOrderedInput.value = 0;
//           } else if ( parseInt(stockLevel) < parseInt(sales.quantity_sold) ) {
//             quantityOrderedInput.value = parseInt(stockLevel);
//           } else {
//             quantityOrderedInput.value = sales.quantity_sold;
//           }
//           salesAddOrderBtn.click();
//           // const dataID = { id: sales.id };
//           // const id = await window.electronAPI.fetchData('delete-sales-data', dataID);
//         }
//       });
//       customerNameInput.value = hold[1].trim();
//       simulateChangeEvent(customerNameInput);
//       // const dataID = { id: hold[0] };
//       // const id = await window.electronAPI.fetchData('delete-orders-data', dataID);

//     });
//     removeBtn.addEventListener('click', async function () {
//       salesObjectData.map(async sales => {
//         if (sales.order_id === hold[0]) {
//           const dataID = { id: sales.id };
//           const id = await window.electronAPI.fetchData('delete-sales-data', dataID);
//         }
//       });
//       const dataID = { id: hold[0] };
//       const id = await window.electronAPI.fetchData('delete-orders-data', dataID);
//       hold_table_body.removeChild(trow);
//     })
//   });
// }

















function makeOrderHold () {
  const holdContent = document.createElement('div');
  holdContent.className = 'sales-container';


  holdContent.innerHTML = `<div class="sales-row">
                                    <div class="sales-col-50">
                                      <div class="sales-table-">
                                        <table>
                                          <thead>
                                            <tr>
                                              <td>Order ID</td>
                                              <td>Customer Name</td>
                                              <td>Customer ID</td>
                                              <td>Order Date</td>
                                              <td>Unpaid Amount</td>
                                              <td>Action</td>
                                            </tr>
                                          </thead>
                                          <tbody></tbody> 
                                        </table>
                                      </div>
                                    </div>
                                  </div>`;
  return holdContent;
}

function formatNumber(number) {
  return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionsDigits: 2 })
}
function reformatNumber(text) {
  const number = text.replace(/,/g, "");
  return parseFloat(number);
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



// Function to create a deep copy of the data object
function deepCopyData(data) {
  return JSON.parse(JSON.stringify(data)); // Deep copy
}


function getCustomerInfo() {
  const salesCustomerNameInput = document.getElementById('sales-customer-name');
  const salesCustomerIdInput = document.getElementById('sales-customer-id');
  const salesCustomerTinInput = document.getElementById('sales-tin-number');
  const salesWithholdingCheck = document.getElementById('sales-withhold-check');

  const salesAmountPaidInput = document.getElementById('sales-amount-paid');
  const salesRemainingAmountInput = document.getElementById('sales-remaining-amount');
  const salesPaymentModeCheck = document.getElementById('sales-payment-mode');

  if (salesCustomerNameInput.value === '') {
    alert('Choose Customer Name');
    return false;
  }

  const data = {
    name: salesCustomerNameInput.value.trim(),
    id: parseInt(salesCustomerIdInput.value.trim()),
    tinNumber: salesCustomerTinInput.value.trim(),
    withholdCheck: salesWithholdingCheck.checked,
    
    amountPaid: parseFloat(salesAmountPaidInput.value.trim()),
    remainingAmount: parseFloat(reformatNumber(salesRemainingAmountInput.value.trim())),
    paymentModeCheck: salesPaymentModeCheck.checked
  }
  console.log('Customer Info is successfully acquired: ', data);
  return data;
}

function getDataFromOrderTable() {
  const tableRows = document.querySelectorAll('.sales-table-container tbody tr');

  if(tableRows.length === 0){
    alert('Place order first.');
    return false;
  }
  const salesData = [];
  tableRows.forEach(tr => {
    const amount = reformatNumber(tr.cells[5].textContent);
    const data = {
      product_id: parseInt(tr.cells[0].textContent),
      quantity_sold: parseInt(tr.cells[3].textContent), 
      amount_received: parseFloat(amount) 
    };
    salesData.push(data);
  });
  console.log('Order Table is extracted!, ', salesData);
  return salesData;
} 

async function performOrderSold(checkoutStatus) {
  const salesPrintBtn = document.getElementById('sales-print-btn');
  const customerData = getCustomerInfo();
  const salesData = getDataFromOrderTable();

  if(!customerData){return;}
  if(!salesData){return;}

  const payment =  getPaymentModality(salesData, customerData, checkoutStatus);

  const orderId = await insertSalesOrderIntoDB(payment, checkoutStatus);
  
  if (payment.tax_withheld > 0 && checkoutStatus === 'sold'){ 
    const taxRes = await insertReceivableFromWithheldIntoDB(payment, orderId);
  }

  if(payment.amount_remaining > 0 && checkoutStatus === 'sold'){
    const payRes = await insertReceivableFromRemainingAmountIntoDB(payment, orderId);
  }

  salesData.forEach(async data => {
    const salesRes = await insertItemSalesIntoDB(data, payment, orderId, checkoutStatus)

    if (salesRes.message === 'Insert successful') {
      const stockRes = await updateStockAtDB(data, salesRes.current_stock);
    }
  });
  salesPrintBtn.click();  
  const paymentModalityContainer = document.getElementById('receipt-modality-status');

  if(checkoutStatus === 'sold'){
    paymentModalityContainer.innerHTML = customerData.paymentModeCheck ? `
  <p>Amount Paid: ETB <span>${customerData.amountPaid}</span></p>
  <p>Amount Remaining: ETB <span>${customerData.remainingAmount}</span></p>` :
      `<p>Fully Paid</p>`;
  }

  if(checkoutStatus === 'hold') {
    paymentModalityContainer.innerHTML = `<p>Order Status: Hold</p>`
  }

  

  // document.querySelectorAll('.sales-table-container tbody').innerHTML = '';
  
}

async function insertSalesOrderIntoDB(payment_modality, check_status) {
  const order_data = {
    customer_id: payment_modality.customer_id,
    order_date: new Date(),
    total_amount: payment_modality.sub_total,
    amount_paid: payment_modality.grand_total,
    amount_remaining: payment_modality.amount_remaining,
    tax_withheld: payment_modality.tax_withheld
  }
  const orderQuery = `INSERT INTO sales_order (customer_id, order_date, total_amount,
                                              amount_paid, amount_remaining, tax_withheld,
                                              checkout_status) 
                      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
  const orderData = [order_data.customer_id, order_data.order_date, order_data.total_amount,
  order_data.amount_paid, order_data.amount_remaining, order_data.tax_withheld, check_status];

  const response = await window.electronAPI.sendQuery('general-query', 'INSERT', orderQuery, orderData);

  console.log('Sales Order Data is inserted, with id: ', parseInt(JSON.parse(response).id));
  return parseInt(JSON.parse(response).id);
}

function getPaymentModality(sales_data, customer_data, check_status) {
  let subTotal = 0;

  sales_data.forEach(data => {
    subTotal += data.amount_received;
  })

  let grandTotal; let remainingAmount; let taxWithheld;
  if (customer_data.withholdCheck) {
    grandTotal = 0.98 * subTotal;
    taxWithheld = 0.02 * subTotal;
  } else {
    grandTotal = subTotal;
    taxWithheld = 0;
  }

  if (!customer_data.paymentModeCheck && check_status === 'sold') {
    remainingAmount = 0;
  }
  if (customer_data.paymentModeCheck && check_status === 'sold') {
    remainingAmount = grandTotal - customer_data.amountPaid;
  }

  if (check_status === 'hold') {
    remainingAmount = grandTotal;
  }

  const data = {
    customer_id: customer_data.id,
    customer_name: customer_data.name,
    sub_total: subTotal,
    tax_withheld: taxWithheld,
    grand_total: grandTotal,
    amount_remaining: remainingAmount 
  }
  console.log('Payment Modality data is calculated, ', data);

  return data;

}

function getNextCalendarMonthDate() {
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let nextMonth = currentMonth + 1;

  if (nextMonth > 11) {
    nextMonth = 0;  // Reset to January
    currentYear += 1; // Increment the year
  }
  return new Date(currentYear, nextMonth, 1);
}

async function insertReceivableFromRemainingAmountIntoDB (pd, order_id) {
  const query = `INSERT INTO receivables (description, amount, 
                                            due_date, amount_left, 
                                            status) 
                    VALUES ($1, $2, $3, $4, $5) RETURNING id`;

  const queryData = [
    `Remaining amount: Customer ' + ${pd.customer_name} , 'Sales Order: ID ${order_id}` ,
    pd.amount_remaining,
    getNextCalendarMonthDate(),
    pd.amount_remaining,
    'pending'];
  const res = await window.electronAPI.sendQuery('general-query', 'INSERT', query, queryData);

  console.log('Remaining amount is inserted. id: ', JSON.parse(res).id);

  return JSON.parse(res);
}

async function insertItemSalesIntoDB(sData, payment_mode, order_id, check_status) {
  const sales = [
    sData.product_id,
    payment_mode.customer_id,
    sData.quantity_sold,
    new Date(),
    sData.amount_received,
    order_id,
    check_status
  ];
  const salesQuery = `INSERT INTO sales (product_id, retailer_id, quantity_sold, sale_date,
                                          amount_received,  order_id, checkout_status)
                          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;

  const res = await window.electronAPI.sendQuery('general-query', 'INSERT', salesQuery, sales);

  const stockRes = await window.electronAPI.sendQuery('general-query', 'SELECT',
    'SELECT quantity FROM company_stock WHERE product_id = $1', [sData.product_id]);

  const stockLevel = parseInt(JSON.parse(stockRes)[0].quantity);

  const data = {
    current_stock: stockLevel,
    message: JSON.parse(res).message 
  }

  console.log(`Item sale is performed with id: ${JSON.parse(res).id} with current stock ${stockLevel}`);
  return data;
}

async function updateStockAtDB(sData, current_stock) {
  const query = 'UPDATE company_stock SET quantity = $1 WHERE product_id = $2';
  const queryData = [current_stock - sData.quantity_sold, sData.product_id];
  const resp = await window.electronAPI.sendQuery('general-query', 'UPDATE', query, queryData);
  console.log(`Current stock is updated!`)
  return resp;
}

async function insertReceivableFromWithheldIntoDB(payment, order_id) {
  const query = `INSERT INTO receivables (description, amount, 
                                            due_date, amount_left, 
                                            status) 
                    VALUES ($1, $2, $3, $4, $5) RETURNING id`;

  const queryData = [
    `Tax Withheld: Sales Order ID = ${order_id}`, 
    payment.tax_withheld,
    getNextCalendarMonthDate(),
    payment.tax_withheld,
    'pending'];
  const res = await window.electronAPI.sendQuery('general-query', 'INSERT', query, queryData);
  console.log('Tax Withheld is inserted, with id: ', JSON.parse(res).id)
  return res;
}

window.onclick = function (event) {
  if (!event.target.matches(".drop-btn")) {
    let dropdowns = document.getElementsByClassName("drop-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}