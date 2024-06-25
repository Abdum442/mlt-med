import { salesPage } from './sales_page.js';

const productData = salesPage.getProductData();
const customerData = salesPage.getCustomerData();

const productDataCopy = deepCopyData(productData);
const customerDataCopy = deepCopyData(customerData);

salesPage.makeSalesPage(productDataCopy, customerDataCopy);



const salesHoldTabContent = document.getElementById('sales-hold-order');
const salesOrderTabContent = document.getElementById('sales-current-order');
const salesBtnCard = document.getElementById('sales-button-card');
const salesReloadBtn = document.getElementById('sales-exit-btn');
const salesSaveOrderBtn = document.getElementById('sales-save-order-btn');
const salesCheckoutBtn = document.getElementById('sales-checkout-btn');
const salesPrintBtn = document.getElementById('sales-print-btn');



const holdContent = makeOrderHold();
const holdTable = holdContent.querySelector('table tbody');

salesHoldTabContent.appendChild(holdContent);

printHoldOrders(holdTable, productDataCopy, customerDataCopy);

salesReloadBtn.addEventListener('click', async function (){
  await reloadData(productDataCopy, customerDataCopy);
});

salesSaveOrderBtn.addEventListener('click', async function () {
  const salesOrderTbody = salesOrderTabContent.querySelector('table tbody');
  await addSalesOrderFromHold(salesOrderTbody);
})

salesCheckoutBtn.addEventListener('click', async function () {
  const salesOrderTbody = salesOrderTabContent.querySelector('table tbody');
  await checkoutOrder(salesOrderTbody);
})

async function fetchData() {
  const raw_products_data = await window.electronAPI.fetchData('fetch-products-data');
  localStorage.setItem('products-data', raw_products_data);

  const raw_stock_data = await window.electronAPI.fetchData('fetch-stock-data');
  localStorage.setItem('stock-data', raw_stock_data);

  const raw_order_data = await window.electronAPI.fetchData('fetch-orders-data');
  localStorage.setItem('orders-data', raw_order_data);

  const raw_sales_data = await window.electronAPI.fetchData('fetch-sales-data');
  localStorage.setItem('sales-data', raw_sales_data);

  const raw_purchase_data = await window.electronAPI.fetchData('fetch-purchase-data');
  localStorage.setItem('purchase-data', raw_sales_data);
}



async function reloadData (product_data, customer_data) {
  document.getElementById('modal-loader').style.display = 'block';
  
  await fetchData();

  const product_data_tmp = salesPage.getProductData();
  const customer_data_tmp = salesPage.getCustomerData();

  Object.assign(product_data, product_data_tmp);

  Object.assign(customer_data, customer_data_tmp);

  document.getElementById('sales-current-order')
  .querySelector('table tbody').innerHTML = '';

  document.getElementById('sales-grad-total')
    .parentNode.querySelectorAll('td').forEach(td => {
      td.style.color = 'white';
    });

  // printHoldOrders(holdTable, productDataCopy, customerDataCopy);

  document.getElementById('modal-loader').style.display = 'none';
}

async function addSalesOrderFromHold (order_table_body) {
  const customerNameInput = document.getElementById('sales-customer-name');
  let customerId;
  const customerName = customerNameInput.value.trim();
  if ( customerName === '' ) {
    alert('Select a customer in Customer Section');
    return;
  }
  const customerDatalistElement = document.getElementById('sales-customer-list');

  const selectedOption = customerDatalistElement.querySelector(`option[value="${customerName}"]`);
  customerId = selectedOption.dataset.id;
 
  const taxWithheldStatus = document.getElementById('sales-withhold').checked;
  const customerTinNumber = document.getElementById('sales-tin-number').value;
 
  const totalGrossAmount = reformatNumber(document.getElementById('sales-grad-total').textContent);
  const orderData = {
    customer_id: customerId ? parseInt(customerId) : parseInt(''),
    order_date: new Date(),
    total_amount: totalGrossAmount,
    checkout_status: 'hold',
    amount_paid: 0,
    tax_withheld: taxWithheldStatus ? 0.2 * totalGrossAmount : 0,
    amount_remaining: totalGrossAmount
  }
  const orderIdText = await window.electronAPI.fetchData('add-orders-data', orderData);

  const orderId = JSON.parse(orderIdText)[0].id;

  order_table_body.querySelectorAll('tr').forEach(async tr => {
    const holdProductData = {
      product_id: parseInt(tr.cells[0].textContent),
      retailer_id: customerId ? parseInt(customerId) : parseInt(""),
      quantity_sold: parseInt(tr.cells[3].textContent),
      sale_date: new Date(),
      payment_method: '',
      amount_received: 0,
      remarks: '',
      tax_withheld: 0,
      order_id: parseInt(orderId),
      checkout_status: 'hold'
    }
    const salesIdText = await window.electronAPI.fetchData('add-sales-data', holdProductData);
    const salesId = JSON.parse(salesIdText)[0].id;
  });
  salesReloadBtn.click();
  const holdTab = document.getElementById('sales-hold-tab');
  holdTab.click();
}



async function printHoldOrders (hold_table_body, product_data, customer_data) {
  hold_table_body.innerHTML = '';
  const productNameInput = document.getElementById('sales-item-name');
  const customerNameInput = document.getElementById('sales-customer-name');
  const quantityOrderedInput = document.getElementById('sales-product-quantity');
  const stockLevelInput = document.getElementById('sales-stock-level');
  const salesAddOrderBtn = document.getElementById('sales-add-order');

  const ordersObjectData = JSON.parse(localStorage.getItem('orders-data'));
  const customerObjData = customer_data;

  const salesObjectData = JSON.parse(localStorage.getItem('sales-data'));
  const productObjectData = product_data;

  const orderTableBody = document.getElementById('sales-current-order').querySelector('table tbody');

  
  // const holdOrderData = ordersObjectData.map(obj => {
  //   if ( obj.checkout_status === 'hold' ) {
  //     const matchCustomerObj = customerObjData.find(customerObj => customerObj.id === obj.customer_id);
  //     return [obj.id, matchCustomerObj.name, obj.customer_id, formatDate(obj.order_date), formatNumber(parseFloat(obj.total_amount))]
  //   }
  // });
  let holdOrderData = [];
  const fullData = [];
  for (const obj of ordersObjectData) {
    if (obj.checkout_status === 'hold') {
      const matchCustomerObj = customerObjData.find(customerObj => customerObj.id === obj.customer_id);
      const data = [obj.id, matchCustomerObj.name, obj.customer_id, formatDate(obj.order_date), formatNumber(parseFloat(obj.total_amount))];
      holdOrderData.push(data);
      fullData.push(obj);
    }
  }
  console.log('hold orders : ', fullData);
  holdOrderData.forEach(hold => {
    const trow = document.createElement('tr');
    hold.forEach(entry => {
      const tdata = document.createElement('td');
      tdata.textContent = entry;
      trow.appendChild(tdata);
    })
    const tdBtn = document.createElement('td');
    tdBtn.className = 'action'
    const actionBtn = dropDownBtn();

    tdBtn.appendChild(actionBtn);
    trow.appendChild(tdBtn);

    hold_table_body.appendChild(trow);
    const expandBtn = tdBtn.querySelector('a.modify');
    const removeBtn = tdBtn.querySelector('a.delete');

    expandBtn.addEventListener('click', async function () {
      const orderTab = document.getElementById('sales-order-tab');
      orderTab.click();
      orderTableBody.innerHTML = '';

      salesObjectData.map(async sales => {
        if ( sales.order_id === hold[0] ) {
          const matchProductObj = productObjectData.find(prodObj => 
            sales.product_id === prodObj.id);
          productNameInput.value = matchProductObj.name;
           
          simulateChangeEvent(productNameInput);
          const stockLevel = stockLevelInput.value;
          if (stockLevel === 'Out of Stock') {
            quantityOrderedInput.value = 0;
          } else if ( parseInt(stockLevel) < parseInt(sales.quantity_sold) ) {
            quantityOrderedInput.value = parseInt(stockLevel);
          } else {
            quantityOrderedInput.value = sales.quantity_sold;
          }
          salesAddOrderBtn.click();
          // const dataID = { id: sales.id };
          // const id = await window.electronAPI.fetchData('delete-sales-data', dataID);
        }
      });
      customerNameInput.value = hold[1].trim();
      simulateChangeEvent(customerNameInput);
      // const dataID = { id: hold[0] };
      // const id = await window.electronAPI.fetchData('delete-orders-data', dataID);

    });
    removeBtn.addEventListener('click', async function () {
      salesObjectData.map(async sales => {
        if (sales.order_id === hold[0]) {
          const dataID = { id: sales.id };
          const id = await window.electronAPI.fetchData('delete-sales-data', dataID);
        }
      });
      const dataID = { id: hold[0] };
      const id = await window.electronAPI.fetchData('delete-orders-data', dataID);
      hold_table_body.removeChild(trow);
    })
  });
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
                                              <td>Total Amount</td>
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

function compareExpiry(a, b) {
  const dateA = new Date(a.expiryDate);
  const dateB = new Date(b.expiryDate);
  return dateB - dateA; // Earlier dates come first
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

function dropDownBtn() {
  const dropContainer = document.createElement('div');
  dropContainer.className = 'dropdown-btn';
  const dropBtn = document.createElement('button');
  dropBtn.type = 'button';
  dropBtn.className = 'drop-btn';
  dropBtn.innerHTML = `Edit <ion-icon name="chevron-down-outline"></ion-icon>`
  const dropdownContent = document.createElement('div');
  dropdownContent.className = 'drop-content';



  dropdownContent.innerHTML = `<a href="#" class="modify">Expand</a>
                               <a href="#" class="delete">Remove</a>`;
  dropContainer.appendChild(dropBtn);
  dropContainer.appendChild(dropdownContent);

  return dropContainer;
}

function simulateChangeEvent(element) {
  const changeEvent = new Event('input', { bubbles: true });
  element.dispatchEvent(changeEvent);
}

// Function to create a deep copy of the data object
function deepCopyData(data) {
  return JSON.parse(JSON.stringify(data)); // Deep copy
}

async function checkoutOrder(order_table_body) {
  const customerNameInput = document.getElementById('sales-customer-name');
  let customerId;
  const customerName = customerNameInput.value.trim();
  const trows = order_table_body.querySelectorAll('tr');
  if (customerName === '') {
    alert('Select a customer in Customer Info');
    return;
  }

  const customerDatalistElement = document.getElementById('sales-customer-list');

  const selectedOption = customerDatalistElement.querySelector(`option[value="${customerName}"]`);
  customerId = selectedOption.dataset.id;

  const taxWithheldStatus = document.getElementById('sales-withhold').checked;
  const customerTinNumber = document.getElementById('sales-tin-number').value;

  const totalGrossAmount = reformatNumber(document.getElementById('sales-grad-total').textContent);
  const orderData = {
    customer_id: customerId ? parseInt(customerId) : parseInt(''),
    order_date: new Date(),
    total_amount: totalGrossAmount,
    checkout_status: 'sold',
    amount_paid: taxWithheldStatus ? 0.98 * totalGrossAmount : totalGrossAmount,
    tax_withheld: taxWithheldStatus ? 0.2 * totalGrossAmount : 0,
    amount_remaining: 0
  }
  const orderIdText = await window.electronAPI.fetchData('add-orders-data', orderData);

  const orderId = JSON.parse(orderIdText)[0].id;

  const productDataInfo = salesPage.getProductData();
  const stockData = JSON.parse(localStorage.getItem('stock-data'));

  order_table_body.querySelectorAll('tr').forEach(async tr => {
    const unitPrice = reformatNumber(tr.cells[4].textContent);
    const quantitySold = parseInt(tr.cells[3].textContent);
    const productId = parseInt(tr.cells[0].textContent); 
    const stockLevel = productDataInfo.find(prod => prod.id === productId).stockLevel;
    const totalPrice = reformatNumber(tr.cells[5].textContent.trim());
    if (stockLevel < quantitySold){
      alert(`Insufficient Stock for ${tr.cells[1].textContent} with id ${tr.cells[0].textContent}. Amend your order`);
      return;
    }
    const soldProductData = {
      product_id: productId,
      retailer_id: customerId ? parseInt(customerId) : parseInt(""),
      quantity_sold: parseInt(tr.cells[3].textContent),
      sale_date: new Date(),
      payment_method: '',
      amount_received: taxWithheldStatus ? 0.98 * totalPrice : totalPrice,
      remarks: '',
      tax_withheld: taxWithheldStatus ? 0.02 * totalPrice : 0,
      order_id: parseInt(orderId),
      checkout_status: 'sold'
    }
    const salesIdText = await window.electronAPI.fetchData('add-sales-data', soldProductData);
    const matchedProductStockData = stockData.find(stock => stock.product_id === productId);
    matchedProductStockData.quantity -= quantitySold;

    const prodIdText = await window.electronAPI.fetchData('modify-stock-data', matchedProductStockData);
    await fetchData();
  });
  salesPrintBtn.click();

  salesReloadBtn.click();

  // salesReloadBtn.click();
  // const holdTab = document.getElementById('sales-hold-tab');
  // holdTab.click();
}