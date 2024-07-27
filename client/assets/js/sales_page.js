const mainContainer = document.getElementById('sales-main-container');

const modalContainer = document.getElementById('sales-modal');



function makeSalesPage(product_data, customer_data) {
  mainContainer.innerHTML = '';
  modalContainer.innerHTML = '';

  const salesPage = makeGrid(modalContainer);
  mainContainer.appendChild(salesPage);

  holdOrdersTable(product_data);


  salesPage.querySelector('#sales-order-tab').click();

  document.getElementById('sales-item-name').addEventListener('input', function () {
    manageProductInfo(product_data);
  })
  populateProductNameOptions(product_data);

  document.getElementById('sales-customer-name').addEventListener('input', manageCustomerInfo);
  populateCustomerNameOptions(customer_data);
  managePaymentMode();

  document.getElementById('sales-add-order').addEventListener('click', function () {
    orderTable(product_data);
  });

  
}

async function getProductData() {
  

  const queryProduct = `SELECT * FROM products`;

  const queryStock = `SELECT * FROM company_stock`;

  const productsRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', queryProduct);
  const stockRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', queryStock);

  const productsObjectData = JSON.parse(productsRawData);
  const stockObjectData = JSON.parse(stockRawData);

  const productData = [];

  for ( const prodObj of productsObjectData ) {
    

    const matchStockObj = stockObjectData.find(obj => obj.product_id === prodObj.id);
    const combProdObj = {
      id: prodObj.id,
      name: prodObj.name,
      stockLevel: matchStockObj.quantity,
      price: prodObj.saling_price,
      expiryDate: formatDate(prodObj.expiry_date) 
    };
    
    productData.push(combProdObj);
  }
  return productData;
}

async function getCustomerData () {
  

  const query = `SELECT * FROM retailers`;
  const customerRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', query);
  const customerObjectData = JSON.parse(customerRawData);

  const customerData = [];

  for (const customerObj of customerObjectData) {
    const custObj = {
      id: customerObj.id,
      name: customerObj.name,
      tin_number: customerObj.tinnumber
    };

    customerData.push(custObj);
  }
  return customerData;
}



function makeGrid(modal) {
  const gridContainer = document.createElement('div');

  gridContainer.className = 'sales-row-arrange sales-first-row';

  const firstColumn = document.createElement('div');
  firstColumn.className = 'sales-column sales-first-col';

  const productCard = makeProductCard();
  const customerCard = makeCustomerCard();

  firstColumn.appendChild(productCard);
  firstColumn.appendChild(customerCard);

  const secondColumn = document.createElement('div');
  secondColumn.className = 'sales-column sales-second-col';

  const tabsCard = makeTabsCard();

  const orderTab = makeOrderTab();
  tabsCard.appendChild(orderTab);

  const holdOrderTab = makeOrderHold();
  tabsCard.appendChild(holdOrderTab);

  const buttonsCard = makeButtonsCard(modal);

  secondColumn.appendChild(tabsCard);
  secondColumn.appendChild(buttonsCard);

  gridContainer.appendChild(firstColumn);
  gridContainer.appendChild(secondColumn);

  return gridContainer;
}

function makeProductCard() {
  const productCard = document.createElement('div');
  productCard.className = 'sales-card';
  productCard.id = 'sales-product-card';
  const productCardHeader = document.createElement('div');
  productCardHeader.className = 'sales-card-header';
  productCardHeader.innerHTML = `Product Info`;
  productCard.appendChild(productCardHeader);

  const productInput = productInfo();
  productCard.appendChild(productInput);

  return productCard;
}



function makeCustomerCard() {
  const customerCard = document.createElement('div');
  customerCard.className = 'sales-card';
  customerCard.id = 'sales-customer-card';
  const customerCardHeader = document.createElement('div');
  customerCardHeader.className = 'sales-card-header';
  customerCardHeader.innerHTML = `Customer Info`;

  customerCard.appendChild(customerCardHeader);

  const customerInput = customerInfo();

  customerCard.appendChild(customerInput);

  return customerCard;
}

function makeTabsCard() {
  const tabsCard = document.createElement('div');
  tabsCard.className = 'sales-card';
  tabsCard.id = 'order-hold-container';
  


  const tab = document.createElement('div');
  tab.className = 'sales-tab';
  

  const orderBtn = document.createElement('button');
  orderBtn.className = 'sales-tablinks';
  orderBtn.id = 'sales-order-tab';
  orderBtn.textContent = 'Order';
  tab.appendChild(orderBtn);

  const holdBtn = document.createElement('button');
  holdBtn.className = 'sales-tablinks';
  holdBtn.id = 'sales-hold-tab';
  holdBtn.textContent = 'Hold';
  tab.appendChild(holdBtn);

  tabsCard.appendChild(tab);

  // const orderHoldContent = document.createElement('div');
  // orderHoldContent.id = 'sales-hold-order';

  // tabsCard.appendChild(orderHoldContent);

  orderBtn.addEventListener('click', function () {
    manageTabs('sales-order-tab');
  });

  holdBtn.addEventListener('click', function () {
    manageTabs('sales-hold-tab')
  })


  return tabsCard;
}

function makeButtonsCard(modal) {
  const buttonsCard = document.createElement('div');
  buttonsCard.className = 'sales-card';
  buttonsCard.id = 'sales-button-card';

  const container = document.createElement('div');
  container.className = 'sales-container';

  buttonsCard.appendChild(container);

  const row = document.createElement('div');
  row.className = 'sales-row';

  container.appendChild(row);

  const leftCol50 = document.createElement('div');
  leftCol50.className = 'sales-col-50';

  const rightCol50 = document.createElement('div');
  rightCol50.className = 'sales-col-50';

  row.appendChild(leftCol50);
  row.appendChild(rightCol50);

  const leftRow = document.createElement('div');
  leftRow.className = 'sales-row';
  leftCol50.appendChild(leftRow);

  const rightRow = document.createElement('div');
  rightRow.className = 'sales-row';
  rightCol50.appendChild(rightRow);

  const leftCol1 = document.createElement('div');
  leftCol1.className = 'sales-col-50';

  const leftCol2 = document.createElement('div');
  leftCol2.className = 'sales-col-50';

  leftRow.appendChild(leftCol1);
  leftRow.appendChild(leftCol2);

  const rightCol1 = document.createElement('div');
  rightCol1.className = 'sales-col-50';
  const rightCol2 = document.createElement('div');
  rightCol2.className = 'sales-col-50';

  rightRow.appendChild(rightCol1);
  rightRow.appendChild(rightCol2);

  const checkoutBtn = document.createElement('input');
  checkoutBtn.value = 'Checkout';
  checkoutBtn.type = 'submit';
  checkoutBtn.id = 'sales-checkout-btn';
  checkoutBtn.className = 'sales-btn';

  const saveBtn = document.createElement('input');
  saveBtn.value = 'Save';
  saveBtn.type = 'submit';
  saveBtn.id = 'sales-save-order-btn';
  saveBtn.className = 'sales-btn';

  const printBtn = document.createElement('input');
  printBtn.value = 'Print';
  printBtn.type = 'submit';
  printBtn.id = 'sales-print-btn';
  printBtn.className = 'sales-btn';

  printBtn.addEventListener('click', function () {
    openModal(modal);
  })

  const exitBtn = document.createElement('input');
  exitBtn.value = 'Reset';
  exitBtn.type = 'submit';
  exitBtn.id = 'sales-exit-btn';
  exitBtn.className = 'sales-btn';

  leftCol1.appendChild(checkoutBtn);
  leftCol2.appendChild(saveBtn);
  rightCol1.appendChild(printBtn);
  rightCol2.appendChild(exitBtn);


  return buttonsCard;
}

function makeOrderHold() {
  const holdOrderTab = document.createElement('div');
  holdOrderTab.id = 'sales-hold-order';

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

  holdOrderTab.appendChild(holdContent);

  return holdOrderTab;
}

function makeOrderTab() {
  const orderTab = document.createElement('div');
  orderTab.id = 'sales-current-order';

  const container = document.createElement('div');
  container.className = 'sales-container';


  const row = document.createElement('div');
  row.className = 'sales-row';

  container.appendChild(row);

  const col50 = document.createElement('div');
  col50.className = 'sales-col-50';


  const tableContainer = document.createElement('div');
  tableContainer.className = 'sales-table-container';

  col50.appendChild(tableContainer);

  const table = document.createElement('table');
  tableContainer.appendChild(table);

  row.appendChild(col50);

  const thead = document.createElement('thead');

  thead.innerHTML = `<tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Expiry Date</td>
                        <td>Quantity</td>
                        <td>Unit Price</td>
                        <td class='sales-text-right'>Total Price</td>
                        <td class="action">Action</td>
                      </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  table.appendChild(tbody);

  const tfoot = document.createElement('thead');
  tfoot.className = 'total-sales';
  tfoot.innerHTML = `<tr class="summary">
                        <td class="sales-text-right" colspan="5" style="color:white">Sub Total</td>
                        <td class="sales-text-right" id="sales-sub-total"></td>
                        <td></td>
                      </tr>
                      <tr class="summary">
                        <td class="sales-text-right" colspan="5" style="color:white">Withheld</td>
                        <td class="sales-text-right" id="sales-withhold-foot"></td>
                        <td></td>
                      </tr>
                      <tr class="summary">
                        <td class="sales-text-right" colspan="5" style="color:white">Grand Total</td>
                        <td class="sales-text-right" id="sales-grand-total"></td>
                        <td></td>
                      </tr>`;
  table.appendChild(tfoot);
  // tfoot.style.color = white;
  orderTab.appendChild(container);

  return orderTab;
}

function makeHoldTab() {

}

function customerInfo() {
  const container = document.createElement('div');
  container.className = 'sales-container';

  const rowOuter = document.createElement('div');
  rowOuter.className = 'sales-row';

  const rowPayment = document.createElement('div');
  rowPayment.id = 'sales-payment';
  rowPayment.className = 'sales-row';
  // rowPayment.style.display = 'none';


  const rule = document.createElement('div');
  rule.innerHTML = `<hr> 
                    <h2>Payment Mode</h2>
                    <label>
                      <input type="checkbox" id="sales-payment-mode" name="sales-payment-mode"> Partial Payment</input>
                    </label> <br>`;

  container.appendChild(rowOuter);
  container.appendChild(rule);
  container.appendChild(rowPayment);

  const leftCol50 = document.createElement('div');
  leftCol50.className = 'sales-col-50';
  leftCol50.style.display = 'none';

  const amountPaidLabel = document.createElement('label');
  amountPaidLabel.setAttribute('for', 'sales-amount-paid');
  amountPaidLabel.textContent = 'Amount Paid';

  const amountPaidInput = document.createElement('input');
  amountPaidInput.id = 'sales-amount-paid';
  amountPaidInput.type = 'text';

  const remainingAmountLabel = document.createElement('label');
  remainingAmountLabel.setAttribute('for', 'sales-remaining-amount');
  remainingAmountLabel.textContent = 'Remaining Amount';

  const remainingAmountInput = document.createElement('input');
  remainingAmountInput.id = 'sales-remaining-amount';
  remainingAmountInput.type = 'text';

  leftCol50.appendChild(amountPaidLabel);
  leftCol50.appendChild(amountPaidInput);
  

  const rightCol50 = document.createElement('div');
  rightCol50.className = 'sales-col-50';
  rightCol50.style.display = 'none';

  rightCol50.appendChild(remainingAmountLabel);
  rightCol50.appendChild(remainingAmountInput);

  rowPayment.appendChild(leftCol50);
  rowPayment.appendChild(rightCol50);


  const col75 = document.createElement('div');
  col75.className = 'sales-col-75';

  const customerLabel = document.createElement('label');
  customerLabel.setAttribute('for', 'sales-customer-name');
  customerLabel.textContent = 'Name';

  const customerInput = document.createElement('input');
  customerInput.id = 'sales-customer-name';
  customerInput.type = 'text';
  customerInput.setAttribute('list', 'sales-customer-list');
  customerInput.setAttribute('placeholder', 'Search..');

  const customerNameDataList = document.createElement('datalist');
  customerNameDataList.name = 'sales-customer-name';
  customerNameDataList.id = 'sales-customer-list';

  

  const hiddenInputId = document.createElement('input');
  hiddenInputId.type = 'hidden';
  hiddenInputId.id = 'sales-customer-id';


  const tinNumberLabel = document.createElement('label');
  tinNumberLabel.setAttribute('for', 'sales-tin-number');
  tinNumberLabel.textContent = 'TIN Number';

  const tinNumberInput = document.createElement('input');
  tinNumberInput.type = 'text';
  tinNumberInput.id = 'sales-tin-number';
  tinNumberInput.name = 'sales-tin-number';
  tinNumberInput.disabled = true;

  col75.appendChild(customerLabel);
  col75.appendChild(customerInput);
  col75.appendChild(customerNameDataList);
  col75.appendChild(hiddenInputId);

  col75.appendChild(tinNumberLabel);
  col75.appendChild(tinNumberInput);

  rowOuter.appendChild(col75);

  const col25 = document.createElement('div');
  col25.className = 'sales-col-25';

  const iconContent = document.createElement('div');
  iconContent.className = 'sales-icon-container'

  iconContent.innerHTML = `<label>
                            <input type="checkbox" id="sales-withhold-check" name="sales-withhold-check"> Withholding
                           </label>`;

  col25.appendChild(iconContent);
  rowOuter.appendChild(col25);

  return container;

}

function productInfo() {
  const container = document.createElement('div');
  container.className = 'sales-container';

  const outerRow = document.createElement('div');
  outerRow.className = 'sales-row';

  container.appendChild(outerRow);

  const col75 = document.createElement('div');
  col75.className = 'sales-col-75';

  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'sales-item-name');
  nameLabel.textContent = 'Item';

  col75.appendChild(nameLabel);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'sales-item-name';
  nameInput.setAttribute('list', 'sales-item-list');
  nameInput.setAttribute('placeholder', 'Search..');

  col75.appendChild(nameInput);

  const nameDataList = document.createElement('datalist');
  nameDataList.name = 'sales-item-name';
  nameDataList.id = 'sales-item-list';

  col75.appendChild(nameDataList);

  outerRow.appendChild(col75);

  const quantityLabel = document.createElement('label');
  quantityLabel.setAttribute('for', 'sales-product-quantity');
  quantityLabel.textContent = 'Quantity';

  col75.appendChild(quantityLabel);


  const quantityInput = document.createElement('input');
  quantityInput.type = 'text';
  quantityInput.id = 'sales-product-quantity';

  col75.appendChild(quantityInput);


  //===========col-25=========
  const col25 = document.createElement('div');
  col25.className = 'sales-col-25';

  const stockLabel = document.createElement('label');
  stockLabel.setAttribute('for', 'sales-stock-level');
  stockLabel.textContent = 'Stock Level';

  col25.appendChild(stockLabel);

  
  const stockInput = document.createElement('input');
  stockInput.type = 'text';
  // stockInput.setAttribute('placeholder', 'Choose..');
  stockInput.id = 'sales-stock-level';
  stockInput.name = 'sales-stock-level';


  col25.appendChild(stockInput);


  outerRow.appendChild(col25);

  const submitBtn = document.createElement('input');
  submitBtn.value = 'Add to order';
  submitBtn.type = 'submit';
  submitBtn.id = 'sales-add-order';
  submitBtn.className = 'sales-btn';

  container.appendChild(submitBtn);

  return container;
}

async function holdOrdersTable(product_data) {

  const holdTableBody = document.getElementById('sales-hold-order').querySelector('table tbody');
  holdTableBody.innerHTML = '';

  const productNameInput = document.getElementById('sales-item-name');
  const customerNameInput = document.getElementById('sales-customer-name');
  const quantityOrderedInput = document.getElementById('sales-product-quantity');
  const stockLevelInput = document.getElementById('sales-stock-level');
  const salesAddOrderBtn = document.getElementById('sales-add-order');


  const orderTableBody = document.getElementById('sales-current-order').querySelector('table tbody');

  const query = `SELECT 
                    so.id AS id,
                    r.name AS customer_name,
                    so.customer_id AS customer_id,
                    so.order_date AS date,
                    so.amount_remaining AS unpaid_amount
                  FROM sales_order so
                  JOIN retailers r on r.id = so.customer_id
                  WHERE checkout_status = 'hold'
                  ORDER BY so.order_date DESC`;
  const holdOrderRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', query);

  const holdOrderObjData = JSON.parse(holdOrderRawData);

  const holdOrderData = holdOrderObjData.map(hold => [
    hold.id, hold.customer_name, hold.customer_id,
    formatDate(hold.date), formatNumber(parseFloat(hold.unpaid_amount))
  ]);

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

    holdTableBody.appendChild(trow);
    const expandBtn = tdBtn.querySelector('a.modify');
    const removeBtn = tdBtn.querySelector('a.delete');
    const orderId = parseInt(hold[0]);

    expandBtn.addEventListener('click', async function () {
      const orderTab = document.getElementById('sales-order-tab');
      orderTab.click();
      orderTableBody.innerHTML = '';

      const query = `SELECT p.id AS product_id, 
                            p.name AS product_name, 
                            s.quantity_sold AS quantity, 
                            r.name AS customer_name,
                            s.id
                      FROM sales s
                      JOIN products p ON p.id = s.product_id
                      JOIN retailers r ON r.id = s.retailer_id
                      WHERE s.order_id = $1 AND s.checkout_status = 'hold'`;
      
      const salesRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', query, [orderId]);

      const salesData = JSON.parse(salesRawData);

      console.log(`Sales in the hold order with Id = ${orderId}, `, salesData);

      

      salesData.forEach(async sales => {
        const salesId = parseInt(sales.id);
        // delete the sales row with id = salesId
        const query = `DELETE FROM sales WHERE id = $1`;
        const deleteSalesRes = await window.electronAPI.sendQuery('general-query', 'DELETE', query, [salesId]);

        console.log(`Sales with id = ${salesId} is deleted with message: ${JSON.parse(deleteSalesRes).message}`);

        
        // get the current stock quantity in company_stock with product_id = sales.product_id
        let currentStock = await window.electronAPI.sendQuery('general-query', 'SELECT',
         `SELECT quantity FROM company_stock WHERE product_id = $1`, 
          [parseInt(sales.product_id)]
        )
        currentStock = parseInt(JSON.parse(currentStock)[0].quantity);

        console.log(`current stock of item ${sales.product_name} is obtained to be: ${currentStock}`);

        // update the stock with currentStock + sales.quantity where product_id = sales.product_id
        const stockUpdateQuery = `UPDATE company_stock SET quantity = $1 WHERE product_id = $2`;
        const updateStockRes = await window.electronAPI.sendQuery('general-query', 'UPDATE', stockUpdateQuery, 
          [currentStock + parseInt(sales.quantity), parseInt(sales.product_id)]);
        
        console.log(`${sales.product_name} stock has been updated to ${currentStock + parseInt(sales.quantity)}, 
          with message: ${JSON.parse(updateStockRes).message}`);
        //update product data to update stockLevel in the sales system
        product_data = getProductData();
        
        productNameInput.value = sales.product_name;
        simulateChangeEvent(productNameInput);
        const stockLevel = stockLevelInput.value;
        let quantity = parseInt(sales.quantity);
        if(parseInt(stockLevel) < parseInt(sales.quantity)){
          alert(`${sales.product_name} stock is low. Please review the order carefully.`);
          quantity = parseInt(stockLevel);
        }
        quantityOrderedInput.value = quantity;
        salesAddOrderBtn.click();
      })

      const deleteOrderQuery = `DELETE FROM sales_order WHERE id = $1`;

      const deleteRes = await window.electronAPI.sendQuery('general-query', 'DELETE', deleteOrderQuery, [orderId]);

      console.log(`Order with id = ${orderId} is deleted with message: ${JSON.parse(deleteRes).message}`);
      customerNameInput.value = hold[1];
      simulateChangeEvent(customerNameInput);

    });
    removeBtn.addEventListener('click', async function () {
      // salesObjectData.map(async sales => {
      //   if (sales.order_id === hold[0]) {
      //     const dataID = { id: sales.id };
      //     const id = await window.electronAPI.fetchData('delete-sales-data', dataID);
      //   }
      // });
      // const dataID = { id: hold[0] };
      // const id = await window.electronAPI.fetchData('delete-orders-data', dataID);
      // holdTableBody.removeChild(trow);
    })
  });
}

function orderTable(product_data) {
  const productNameInput = document.getElementById('sales-item-name');
  const stockLevelInput = document.getElementById('sales-stock-level');
  // const stockLevelDataList = document.getElementById('sales-stock-list');
  const withholdCheck = document.getElementById('sales-withhold-check');

  const tinNumberInput = document.getElementById('sales-tin-number');

  const productQuantity = document.getElementById('sales-product-quantity');
  const currentOrderDiv = document.getElementById('sales-current-order');
  const itemName = productNameInput.value;
  const product_map = createProductMap(product_data);
  const productList = product_map.get(itemName);

  for (const product of productList) {
    if(product.price === null){
      alert(`Selling Price of ${product.name} need to be set first.`)
      return
    }
  }

  const totalStock = productList.reduce((sum, product) => sum + parseInt(product.stockLevel), 0);

  stockLevelInput.value = totalStock;

  const quantity = document.getElementById("sales-product-quantity").value;
  if (quantity > totalStock) {
    alert(`Insufficient stock for "${itemName}". Only ${totalStock} available.`);
  } else {
    let orderList = [];
    let remainingOrder = quantity;

    const selectedItem = {};

    let subTot = 0; let grandTot; let withhold;

    const salesPayModCheck = document.getElementById('sales-payment-mode')
    const salesPaidAmountInput = document.getElementById('sales-amount-paid');
    const salesRemainingAmount = document.getElementById('sales-remaining-amount');

    for (const product of productList.sort(compareExpiry)) {
      if (remainingOrder === 0) {
        break;
      }
      const quantityToTake = Math.min(remainingOrder, product.stockLevel);
      if (quantityToTake <= 0) {
        continue;
      }
      const selectedItem = {};
      selectedItem['name'] = itemName;
      remainingOrder -= quantityToTake;
      selectedItem['quantity'] = quantityToTake + '';
      product.stockLevel = (parseInt(product.stockLevel) - quantityToTake) + '';
      selectedItem['expiryDate'] = product.expiryDate;
      selectedItem['iD'] = product.id;
      selectedItem['price'] = product.price;
      selectedItem['total'] = (Number(product.price) * Number(quantityToTake)) + '';
      orderList.push(selectedItem);
    }

    productNameInput.value = '';
    productQuantity.value = '';
    stockLevelInput.value = '';
    const tbody = currentOrderDiv.querySelector('table tbody');
    const subTotalCell = document.getElementById('sales-sub-total');
    const withholdCell = document.getElementById('sales-withhold-foot');
    const grandTotalCell = document.getElementById('sales-grand-total');

    for ( const orderItem of orderList ) {
      const data = [orderItem.iD, orderItem.name,
        orderItem.expiryDate, orderItem.quantity,
        formatNumber(Number(orderItem.price))] 
        const tot = formatNumber(Number(orderItem.total));

      const row = document.createElement('tr');
      data.forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        row.appendChild(td);
      });
      const td = document.createElement('td');
      td.className = 'sales-text-right';
      td.textContent = tot;
      row.appendChild(td);
      const tdBtn = document.createElement('td');
      tdBtn.className = 'action'
      const actionBtn = dropDownBtn();
      
      tdBtn.appendChild(actionBtn);
      row.appendChild(tdBtn);

      

      tbody.appendChild(row);
      getGrandTotal();
    }
    tbody.querySelectorAll('tr').forEach(tr => {
      const dropDownBtn = tr.querySelector('td .dropdown-btn');
      const dropContent = dropDownBtn.querySelector('.drop-content');
      const modifyBtn = dropContent.querySelector('a.modify');
      const deleteBtn = dropContent.querySelector('a.delete');

      modifyBtn.addEventListener('click', function () {
        for (const product of productList) {
          if (product.id === tr.cells[0].textContent) {
            product.stockLevel = (parseInt(product.stockLevel) + parseInt(tr.cells[3].textContent)) + '';
          }
        }
        productNameInput.value = tr.cells[1].textContent;
        tbody.removeChild(tr);
        getGrandTotal();
        simulateChangeEvent(productNameInput);
      });

      deleteBtn.addEventListener('click', function () {
        for (const product of productList) {
          if (product.id === tr.cells[0].textContent) {
            product.stockLevel = (parseInt(product.stockLevel) + parseInt(tr.cells[3].textContent)) + '';
          }
        }
        tbody.removeChild(tr);
        getGrandTotal();
      });

    });

    withholdCheck.addEventListener('change', function() {
      if (withholdCheck.checked && tinNumberInput.value === ''){
        alert('Choose customer name with TIN NUMBER');
        withholdCheck.checked = false;
      } else {
        getGrandTotal();
      }
    });

    salesPaidAmountInput.addEventListener('input', function () {
      const amountPaidValue = parseFloat(salesPaidAmountInput.value.trim());
      salesRemainingAmount.value = formatNumber(grandTot - amountPaidValue);
      salesRemainingAmount.disabled = true;
    })

    function getGrandTotal() {
      subTot = 0;
      tbody.querySelectorAll('tr').forEach(tr => {
        subTot += reformatNumber(tr.cells[5].textContent);
      });

      if(withholdCheck.checked){
        grandTot = 0.98 * subTot;
        withhold = 0.02 * subTot;
      } else {
        grandTot = subTot;
        withhold = 0
      }

      if (salesPayModCheck.checked){
        const amountPaidValue = parseFloat(salesPaidAmountInput.value.trim());
        salesRemainingAmount.value = formatNumber(grandTot - amountPaidValue);
        salesRemainingAmount.disabled = true;
      }

      grandTotalCell.textContent = formatNumber(grandTot);
      subTotalCell.textContent = formatNumber(subTot);
      withholdCell.textContent = formatNumber(withhold);
      if(tbody.querySelectorAll('tr').length) {
        grandTotalCell.parentNode.querySelectorAll('td').forEach(td => {
          td.style.color = 'black';
        });
        subTotalCell.parentNode.querySelectorAll('td').forEach(td => {
          td.style.color = 'black';
        });
        withholdCell.parentNode.querySelectorAll('td').forEach(td => {
          td.style.color = 'black';
        });
      } else {  
        grandTotalCell.parentNode.querySelectorAll('td').forEach(td => {
          td.style.color = 'white';
        });
        subTotalCell.parentNode.querySelectorAll('td').forEach(td => {
          td.style.color = 'white';
        });
        withholdCell.parentNode.querySelectorAll('td').forEach(td => {
          td.style.color = 'white';
        });
      }
    }
  }

  


  function simulateChangeEvent (element) {
    const changeEvent = new Event('input', { bubbles: true});
    element.dispatchEvent(changeEvent);
  }


  // function dropDownBtn (){
  //   const dropContainer = document.createElement('div');
  //   dropContainer.className  = 'dropdown-btn';
  //   const dropBtn = document.createElement('button');
  //   dropBtn.type = 'button';
  //   dropBtn.className = 'drop-btn';
  //   dropBtn.innerHTML = `Edit <ion-icon name="chevron-down-outline"></ion-icon>`
  //   const dropdownContent = document.createElement('div');
  //   dropdownContent.className = 'drop-content';

    
    
  //   dropdownContent.innerHTML = `<a href="#" class="modify">Modify</a>
  //                                <a href="#" class="delete">Remove</a>`;
  //   dropContainer.appendChild(dropBtn);
  //   dropContainer.appendChild(dropdownContent);

  //   return dropContainer;
  // }
}


function printSalesReport() {

  const modal = document.createElement('div');

  modal.className = 'sales-modal-container';

  const receipt = document.createElement('div');
  receipt.className = 'sales-receipt';

  const header = document.createElement('div');
  header.className = 'sales-header';

  header.innerHTML = `<span onclick="document.querySelector('.sales-modal').style.display='none'"
                         class="sales-close" title="Close Receipt">&times;</span>
                      <h1>MLT Trading PLC</h1>
                      <p>Kebele 06, Bahir Dar</p>
                      <p>Phone: +251 (0) 911 8677 | Email: info@mlttradingltd.com</p>`

  const storeInfo = document.createElement('div');
  storeInfo.className = 'sales-store-info';

  storeInfo.innerHTML = `<p>Invoice #: <span id="sales-invoice-number">10001</span></p>
                         <p>Date: <span id="sales-date">2024-04-15</span></p>`

  const customerInfo = document.createElement('div');
  const customerName = document.getElementById('sales-customer-name').value;
  const customerTIN = document.getElementById('sales-tin-number').value;
  const isWithhold = document.getElementById('sales-withhold-check').checked;
  customerInfo.className = 'sales-customer-info';

  customerInfo.innerHTML = `<p>Customer Name: <span id="sales-customerName">${customerName}</span></p>
                            <p>TIN Number: <span id="sales-customer-tin">${customerTIN}</span></p>`

  const table = document.createElement('table');
  table.className = 'sales-table';


  const tableHeader = document.querySelector('#sales-current-order table thead:first-child').cloneNode(true);

  tableHeader.querySelectorAll('td.action').forEach(td => {
    td.style.display = 'none';
  });

  const tableBody = document.querySelector('#sales-current-order table tbody').cloneNode(true);

  tableBody.querySelectorAll('td.action').forEach(td => {
    td.style.display = 'none';
  });

  const tfoot = document.createElement('tfoot');

  const trGrandTotal = document.createElement('tr');
  const trWithhold = document.createElement('tr');
  const trSubtotal = document.createElement('tr');

  const rows = tableBody.getElementsByTagName('tr');
  const hrow = tableHeader.getElementsByTagName('tr')[0].getElementsByTagName('td');

  hrow[hrow.length - 2].className = 'sales-text-right';
  let Gtotal = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].getElementsByTagName('td');
    row[row.length - 2].className = 'sales-text-right';
    Gtotal += reformatNumber(row[row.length - 2].innerText);
  }
  const withhold = isWithhold ? Gtotal * 0.02 : 0.00;
  const subtotal = isWithhold ? Gtotal * 0.98 : Gtotal;
  trGrandTotal.innerHTML = `<td class="sales-text-right" style="font-weight: bold" colspan="5">Grand Total</td>
                            <td class="sales-text-right">${formatNumber(subtotal)}</td>
                            <td></td>`;
  trWithhold.innerHTML = `<td class="sales-text-right" style="font-weight: bold" colspan="5">Withhold Amount</td>
                          <td class="sales-text-right">${formatNumber(withhold)}</td>
                          <td></td>`;
  trSubtotal.innerHTML = `<td class="sales-text-right" style="font-weight: bold" colspan="5">Sub Total</td>
                          <td class="sales-text-right">${formatNumber(Gtotal)}</td>
                          <td></td>`;
  tfoot.appendChild(trSubtotal);
  tfoot.appendChild(trWithhold);
  tfoot.appendChild(trGrandTotal); 


  const paymentModalityContainer = document.createElement('div');
  paymentModalityContainer.id = 'receipt-modality-status'
  paymentModalityContainer.style.width = '100%';


  const printBtn = document.createElement('div');

  printBtn.className = 'sales-print-btn';

  const theBtn = document.createElement('button');
  theBtn.innerText = 'Print Receipt';
  printBtn.appendChild(theBtn);

  theBtn.addEventListener('click', function () {
    window.print();
    document.querySelector('.sales-modal').style.display = 'none';
  })




  table.appendChild(tableHeader);
  table.appendChild(tableBody);

  const trEmpty = document.createElement('tr');
  trEmpty.className = 'sales-empty-tr';
  table.appendChild(trEmpty);
  table.appendChild(tfoot);

  receipt.appendChild(header);
  receipt.appendChild(storeInfo);
  receipt.appendChild(customerInfo);
  receipt.appendChild(table);
  receipt.appendChild(paymentModalityContainer);
  receipt.appendChild(printBtn);
  modal.appendChild(receipt);

  modal.querySelector('#sales-date').innerHTML = formatDate(new Date());
  
  return modal;
}

function managePaymentMode() {
  const salesPaymentModeCheck = document.getElementById('sales-payment-mode');
  const salesPaidAmountInput = document.getElementById('sales-amount-paid');
  const salesRemainingAmount = document.getElementById('sales-remaining-amount');

  salesPaymentModeCheck.addEventListener('change', function () {
    if (salesPaymentModeCheck.checked) {
      salesPaidAmountInput.parentNode.style.display = 'block';
      salesRemainingAmount.parentNode.style.display = 'block';
    } else {
      salesPaidAmountInput.parentNode.style.display = 'none';
      salesRemainingAmount.parentNode.style.display = 'none';
    }
  });


}

function manageCustomerInfo() {
  const customerDataList = document.getElementById('sales-customer-list');
  const customerNameInput = document.getElementById('sales-customer-name');
  const customerTinNumberInput = document.getElementById('sales-tin-number');
  const customerIdInput = document.getElementById('sales-customer-id');

  

  const options = customerDataList.options;
  const selectedCustomerName = customerNameInput.value.trim();
  customerTinNumberInput.disable = false;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === selectedCustomerName) {
      customerIdInput.value = options[i].dataset.id;
      const tin = options[i].dataset.tin === "null" ? '' : options[i].dataset.tin;
      customerTinNumberInput.value = tin;
      customerTinNumberInput.disable = true;
      break;
    } else if (selectedCustomerName === '') {
      customerTinNumberInput.value = '';
      customerTinNumberInput.disable = true;
      break;
    }
  }
  

}

function manageProductInfo(product_data) {
  const stockLevelInput = document.getElementById('sales-stock-level');
  // const stockLevelDataList = document.getElementById('sales-stock-list');
  let productStocks = [];
  const productNameInput = document.getElementById('sales-item-name');
  const selectedProductName = productNameInput.value;
  const product_map = createProductMap(product_data);
  const productList = product_map.get(selectedProductName);
  if ( productList ){
    const totalStock = productList.reduce((sum, product) => 
      sum + parseInt(product.stockLevel), 0);
    if (totalStock <= 0) {
      stockLevelInput.value = 'Out of Stock';
    } else {
      stockLevelInput.value = totalStock + "";
    }
  } else {
    stockLevelInput.value = '';
  }
  stockLevelInput.disabled = true;  
}

function manageTabs(tabId) {
  const currentOrder = document.getElementById('sales-current-order');
  const holdOrderContent = document.getElementById('sales-hold-order');
  const buttonCard = document.getElementById('sales-button-card').querySelector('.sales-container');

  // const tabBtn = document.getElementById(tabId);
  // tabBtn.style.backgroundColor = '#ddd';

  document.getElementById('sales-order-tab').classList.remove('sales-active');
  document.getElementById('sales-hold-tab').classList.remove('sales-active');
  if (tabId === 'sales-order-tab') {

    document.getElementById('sales-order-tab').classList.add('sales-active');
    currentOrder.style.display = 'block';
    buttonCard.style.display = 'block';
    holdOrderContent.style.display = 'none';

  } else if (tabId === 'sales-hold-tab') {
    
    document.getElementById('sales-hold-tab').classList.add('sales-active');
    currentOrder.style.display = 'none';
    buttonCard.style.display = 'none';
    holdOrderContent.style.display = 'block';
  }
}

function populateProductNameOptions(product_data) {
  const nameDataList = document.getElementById('sales-item-list');
  nameDataList.innerHTML = '';

  const product_map = createProductMap(product_data);

  const productNames = Array.from(product_map.keys()); // Get all unique medicine names

  for (const name of productNames) {
    const optionElement = document.createElement("option");
    optionElement.value = name;
    optionElement.textContent = name;
    nameDataList.appendChild(optionElement);
  }
}

function populateCustomerNameOptions(customer_data) {
  const customerNameDataList = document.getElementById('sales-customer-list');
  customerNameDataList.innerHTML = '';
  customer_data.forEach(customer => {
    const option = document.createElement('option');
    option.text = customer.name;
    option.value = customer.name;
    option.setAttribute('data-id', customer.id);
    option.setAttribute('data-tin', customer.tin_number);

    customerNameDataList.appendChild(option);
  });
}

function openModal(modal) {
  const reportModal = printSalesReport();
  modal.innerHTML = '';
  modal.appendChild(reportModal);
  modal.style.display = 'block';
}

function compareExpiry(a, b) {
  const dateA = new Date(a.expiryDate);
  const dateB = new Date(b.expiryDate);
  return dateA - dateB; // Earlier dates come first
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

function createProductMap(products) {
  const productMap = new Map();

  for (const item of products) {
    const itemName = item.name;
    const existingList = productMap.get(itemName);

    if (existingList) {
  
      existingList.push(item);
    } else {

      productMap.set(itemName, [item]);
    }
  }

  return productMap;
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

const salesPage = {
  makeSalesPage,
  getProductData,
  getCustomerData,
  createProductMap
}

export { salesPage }