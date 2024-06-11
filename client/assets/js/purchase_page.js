const mainContainer = document.getElementById('sales-main-container');

const modalContainer = document.getElementById('invoice-modal');
const productModalContainer = document.getElementById('product-modal-container');

const productModal = createProductModal();
productModalContainer.appendChild(productModal);


const customerDetails = [
  { id: "0", name: 'Walking', tin_number: '' },
  { id: "1", name: 'Dischem Ltd', tin_number: '1234gt3' },
  { id: '2', name: 'Beovac Trading PLC', tin_number: '' },
  { id: '3', name: 'Kare Pharmaceuticals PLC', tin_number: '9087UY' },
  { id: '4', name: 'GD Importr PLC', tin_number: '4675YHF' },
  { id: '5', name: 'Ashenafi Alle Import Trading', tin_number: '6473WFRDY' },
  { id: '6', name: 'VALDES PLC', tin_number: '345309YHTF' },
  { id: '7', name: 'BDU', tin_number: 'KJ987645' },
  { id: "8", name: 'ADDIS PHARMACEUTICAL FACTORY PLC', tin_number: '' },
];

const medicinalProducts = [
  { id: "1001", name: "Paracetamol 500mg Tablets", stockLevel: '100', expiryDate: "2025-01-31", price: '45', description: "A common painkiller used to treat aches and pains. It can also be used to reduce a high temperature." },
  { id: "1011", name: "Paracetamol 500mg Tablets", stockLevel: '67', expiryDate: "2024-01-31", price: '45', description: "A common painkiller used to treat aches and pains. It can also be used to reduce a high temperature." },
  { id: "1002", name: "Aspirin 300mg Tablets", stockLevel: '50', expiryDate: "2024-08-14", price: '45', description: "Used to reduce pain, fever, or inflammation. It is also used as an anti-inflammatory or a blood thinner." },
  { id: "1003", name: "Ibuprofen 200mg Tablets", stockLevel: '75', expiryDate: "2024-11-21", price: '45', description: "A nonsteroidal anti-inflammatory drug (NSAID) that is used for treating pain, fever, and inflammation." },
  { id: "1004", name: "Diphenhydramine 25mg Capsules", stockLevel: '20', expiryDate: "2025-04-12", price: '45', description: "An antihistamine used to relieve symptoms of allergy, hay fever, and the common cold." },
  { id: "1005", name: "Loperamide 2mg Capsules", stockLevel: '45', expiryDate: "2024-09-27", price: '45', description: "Used to treat sudden diarrhea (including traveler's diarrhea). It works by slowing down the movement of the gut." },
  { id: "1012", name: "Loperamide 2mg Capsules", stockLevel: '90', expiryDate: "2025-09-27", price: '45', description: "Used to treat sudden diarrhea (including traveler's diarrhea). It works by slowing down the movement of the gut." },
  { id: "1013", name: "Loperamide 2mg Capsules", stockLevel: '60', expiryDate: "2024-11-27", price: '45', description: "Used to treat sudden diarrhea (including traveler's diarrhea). It works by slowing down the movement of the gut." },
  { id: "1006", name: "Clotrimazole 1% Cream", stockLevel: '30', expiryDate: "2025-03-08", price: '45', description: "An antifungal cream used to treat fungal skin infections such as athlete's foot, jock itch, ringworm, and yeast infections." },
  { id: "1007", name: "Salbutamol Inhaler (100mcg)", stockLevel: '25', expiryDate: "2024-10-10", price: '45', description: "A bronchodilator used to relieve symptoms of asthma and chronic obstructive pulmonary disease (COPD)." },
  { id: "1008", name: "Miconazole 2% Cream", stockLevel: '15', expiryDate: "2024-07-19", price: '45', description: "An antifungal cream used to treat fungal infections of the skin such as athlete's foot, jock itch, and ringworm." },
  { id: "1009", name: "Prednisolone 5mg Tablets", stockLevel: '80', expiryDate: "2025-02-17", price: '45', description: "A corticosteroid drug that prevents the release of substances in the body that cause inflammation. It is used to treat a variety of conditions." },
  { id: "1010", name: "Amoxicillin 500mg Capsules", stockLevel: '60', expiryDate: "2024-12-06", price: '45', description: "An antibiotic used to treat a wide variety of bacterial infections. It works by stopping the growth of bacteria." }
];

const productData = getProductData();
const supplierData = getCustomerData();


makeSalesPage(productData, supplierData);



function makeSalesPage(product_data, customer_data) {
  mainContainer.innerHTML = '';
  modalContainer.innerHTML = '';



  const salesPage = makeGrid(modalContainer);
  mainContainer.appendChild(salesPage);

  const addNewProductBtn = document.getElementById('purchase-add-new-product');

  addNewProductBtn.addEventListener('click', () => {
    console.log('add product btn is click')
    productModalContainer.style.display = 'block';
});

  salesPage.querySelector('#sales-order-tab').click();
  populateProductNameOptions(product_data);
  productModalContainer.querySelector('.product-save').addEventListener('click', function () {
    appendOption();
    productModalContainer.style.display = 'none';
  });

  // document.getElementById('sales-item-name').addEventListener('input', function () {
  //   manageProductInfo(product_data);
  // })
  // populateProductNameOptions(product_data);

  document.getElementById('sales-customer-name').addEventListener('input', manageCustomerInfo);
  populateCustomerNameOptions(customer_data);

  document.getElementById('purchase-add-order').addEventListener('click', function () {
    orderTable(product_data);
    eraseProductInfo();
  });

  document.getElementById('sales-exit-btn').addEventListener('click', function () {
    eraseProductInfo();
    eraseCustomerInfo();
    wipeOutOrderTable();
    populateCustomerNameOptions(customer_data);
    populateProductNameOptions(product_data);
  })

  document.getElementById('sales-save-order-btn').addEventListener('click', async function () {
    await registerPurchase();
  });
}

function getProductData() {
  const productsObjectData = JSON.parse(localStorage.getItem('products-data'));
  const stockObjectData = JSON.parse(localStorage.getItem('stock-data'));

  const productData = [];

  for (const prodObj of productsObjectData) {


    const matchStockObj = stockObjectData.find(obj => obj.product_id === prodObj.id);
    const combProdObj = {
      id: prodObj.id,
      name: prodObj.name,
      description: prodObj.description
    };

    productData.push(combProdObj);
  }
  return productData;
}

function getCustomerData() {
  const customerObjectData = JSON.parse(localStorage.getItem('suppliers-data'));
  const customerData = [];

  for (const customerObj of customerObjectData) {
    const custObj = {
      id: customerObj.id,
      name: customerObj.name,
      tin_number: customerObj.taxinfo
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
  productCard.id = 'purchase-product-card';
  const productCardHeader = document.createElement('div');
  productCardHeader.className = 'sales-card-header';
  productCardHeader.innerHTML = `Product Details`;
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
  customerCardHeader.innerHTML = `Supplier Info`;

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
  // tab.appendChild(holdBtn);

  tabsCard.appendChild(tab);

  const orderHoldContent = document.createElement('div');
  orderHoldContent.id = 'sales-hold-order';

  tabsCard.appendChild(orderHoldContent);

  // orderBtn.addEventListener('click', function () {
  //   manageTabs('sales-order-tab');
  // });

  // holdBtn.addEventListener('click', function () {
  //   manageTabs('sales-hold-tab')
  // })


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

  // leftCol1.appendChild(checkoutBtn);
  leftCol1.appendChild(saveBtn);
  leftCol2.appendChild(printBtn);
  // rightCol1.appendChild(printBtn);
  rightCol2.appendChild(exitBtn);


  return buttonsCard;
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
                        <td>Item Description</td>
                        <td>Expiry Date</td>
                        <td>Unit</td>
                        <td>Price</td>
                        <td>Quantity</td>
                        <td class='sales-text-right'>Total Price</td>
                        <td class="action">Action</td>
                      </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  table.appendChild(tbody);

  const tfoot = document.createElement('thead');
  tfoot.className = 'total-sales';
  tfoot.innerHTML = `<tr class="summary">
                        <td class="sales-text-right" colspan="5" style="color:white">Grand Total</td>
                        <td class="sales-text-right" id="sales-grad-total"></td>
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



  container.appendChild(rowOuter);

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

  // col75.appendChild(tinNumberLabel);
  // col75.appendChild(tinNumberInput);

  rowOuter.appendChild(col75);

  const col25 = document.createElement('div');
  col25.className = 'sales-col-25';

  const iconContent = document.createElement('div');
  iconContent.className = 'sales-icon-container'

  iconContent.innerHTML = `<label>
                            <input type="checkbox" id="sales-withhold" name="sales-withhold"> Withholding
                           </label>`;

  col25.appendChild(iconContent);
  rowOuter.appendChild(col25);

  return container;

}

function productInfo() {
  const container = document.createElement('div');
  container.className = 'sales-container';

  const productNameRow = document.createElement('div');
  productNameRow.className = 'sales-row';

  container.appendChild(productNameRow);

  const productNameCol75 = document.createElement('div');
  productNameCol75.className = 'sales-col-75';

  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'purchase-item-name');
  nameLabel.textContent = 'Item Name';
  

  productNameCol75.appendChild(nameLabel);

  const productNameInput = document.createElement('input');
  productNameInput.type = 'text';
  productNameInput.id = 'purchase-item-name';
  productNameInput.setAttribute('list', 'purchase-item-list');
  productNameInput.setAttribute('placeholder', 'Search..');

  productNameCol75.appendChild(productNameInput);

  const productNameDataList = document.createElement('datalist');
  productNameDataList.name = 'purchase-item-list';
  productNameDataList.id = 'purchase-item-list';

  const hiddenDescription = document.createElement('input');
  hiddenDescription.type = 'hidden';
  hiddenDescription.id = 'purchase-hidden-description';

  productNameCol75.appendChild(productNameDataList);
  productNameCol75.appendChild(hiddenDescription);

  productNameRow.appendChild(productNameCol75);

  // const quantityLabel = document.createElement('label');
  // quantityLabel.setAttribute('for', 'sales-product-quantity');
  // quantityLabel.textContent = 'Quantity';

  // col75.appendChild(quantityLabel);


  // const quantityInput = document.createElement('input');
  // quantityInput.type = 'text';
  // quantityInput.id = 'sales-product-quantity';

  // col75.appendChild(quantityInput);


  //===========col-25=========
  const productNameCol25 = document.createElement('div');
  productNameCol25.className = 'sales-col-25';

  

  const stockLabel = document.createElement('label');
  stockLabel.setAttribute('for', 'sales-stock-level');
  stockLabel.textContent = 'Add New';
  stockLabel.style.color = 'white';

  productNameCol25.appendChild(stockLabel);



  const AddNewProductBtn = document.createElement('input');
  AddNewProductBtn.value = 'Add New';
  AddNewProductBtn.type = 'button';
  AddNewProductBtn.id = 'purchase-add-new-product';
  AddNewProductBtn.className = 'sales-btn add-new';
  AddNewProductBtn.style.backgroundColor = '#2a2185';

  productNameCol25.appendChild(AddNewProductBtn);

  productNameRow.appendChild(productNameCol25);

  
  const productDescriptionLabel = document.createElement('label');
  productDescriptionLabel.setAttribute('for', 'purchase-product-description');
  productDescriptionLabel.textContent = 'Description  |  Unit';

  productDescriptionLabel.style.display = 'none';

  container.appendChild(productDescriptionLabel);


  const productDescriptionInput = document.createElement('textarea');
  productDescriptionInput.name = 'purchase-product-description';
  productDescriptionInput.id = 'purchase-product-description';
  productDescriptionInput.style.height = '80px';
  productDescriptionInput.style.width = '100%';
  productDescriptionInput.style.resize = 'vertical';
  productDescriptionInput.style.marginBottom = '20px';
  productDescriptionInput.style.padding = '10px';
  productDescriptionInput.style.lineHeight = '1.5';

  productDescriptionInput.style.display = 'none';

  container.appendChild(productDescriptionInput);

  


  const productQuantitiesRow = document.createElement('div');
  productQuantitiesRow.className = 'sales-row';

  container.appendChild(productQuantitiesRow);

  const expiryDateCol50 = document.createElement('div');
  expiryDateCol50.className = 'sales-col-25';

  const expiryDateLabel = document.createElement('label');
  expiryDateLabel.setAttribute('for', 'purchase-item-expiry');
  expiryDateLabel.textContent = 'Expiry Date';

  expiryDateCol50.appendChild(expiryDateLabel);

  const expiryDateInput = document.createElement('input');
  expiryDateInput.type = 'date';
  expiryDateInput.id = 'purchase-item-expiry';

  expiryDateCol50.appendChild(expiryDateInput);

  productQuantitiesRow.appendChild(expiryDateCol50);

  const quantityCol25 = document.createElement('div');
  quantityCol25.className = 'sales-col-25';

  const productQuantityLabel = document.createElement('label');
  productQuantityLabel.setAttribute('for', 'purchase-item-quantity');
  productQuantityLabel.textContent = 'Quantity';

  quantityCol25.appendChild(productQuantityLabel);

  const productQuantityInput = document.createElement('input');
  productQuantityInput.type = 'text';
  productQuantityInput.id = 'purchase-item-quantity';

  quantityCol25.appendChild(productQuantityInput);

  productQuantitiesRow.appendChild(quantityCol25);

  const priceCol25 = document.createElement('div');
  priceCol25.className = 'sales-col-25';

  const productPriceLabel = document.createElement('label');
  productPriceLabel.setAttribute('for', 'purchase-item-price');
  productPriceLabel.textContent = 'Unit Price';

  priceCol25.appendChild(productPriceLabel);

  const productPriceInput = document.createElement('input');
  productPriceInput.type = 'text';
  productPriceInput.id = 'purchase-item-price';

  priceCol25.appendChild(productPriceInput);

  productQuantitiesRow.appendChild(priceCol25);



  // const stockInput = document.createElement('input');
  // stockInput.type = 'text';
  // // stockInput.setAttribute('placeholder', 'Choose..');
  // stockInput.id = 'sales-stock-level';
  // stockInput.name = 'sales-stock-level';


  // col25.appendChild(stockInput);

  


  

  const submitBtn = document.createElement('input');
  submitBtn.value = 'Add to order';
  submitBtn.type = 'submit';
  submitBtn.id = 'purchase-add-order';
  submitBtn.className = 'sales-btn';

  container.appendChild(submitBtn);

  return container;
}

function orderTable(product_data) {
  const productNameInput = document.getElementById('purchase-item-name');
  const productQuantityInput = document.getElementById('purchase-item-quantity');
  const productUnitPriceInput = document.getElementById('purchase-item-price');
  const productExpiryDateInput = document.getElementById('purchase-item-expiry');

  const currentOrderDiv = document.getElementById('sales-current-order');

  const itemName = productNameInput.value.trim();
  const itemQuantity = productQuantityInput.value.trim();
  const itemUnitPrice = productUnitPriceInput.value.trim();
  const itemExpiryDate = productExpiryDateInput.value;

  if (itemName === "") {
    alert(`Choose a valid Item Description`);
    return;
  } 

  if(itemQuantity === "") {
    alert('Enter a valid positive integer for quantity');
    return;
  }

  if (itemUnitPrice === '') {
    alert('Enter a valid Unit Price');
    return;
  }
  if(itemExpiryDate === '') {
    alert('Date input field cannot be empty');
    return;
  }

  const descriptionInput = document.getElementById('purchase-product-description');
  const unitDescription = descriptionInput.value;

  const tbody = currentOrderDiv.querySelector('table tbody');

  const gradTotalCell = document.getElementById('sales-grad-total');

  const itemTotal = parseFloat(itemUnitPrice) * parseInt(itemQuantity); 

  const data = [itemName, formatDate(itemExpiryDate),
    unitDescription, formatNumber(parseFloat(itemUnitPrice)), parseInt(itemQuantity)]
  const tot = formatNumber(Number(itemTotal));

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

  tbody.querySelectorAll('tr').forEach(tr => {const dropDownBtn = row.querySelector('td .dropdown-btn');
    const dropContent = dropDownBtn.querySelector('.drop-content');
    const modifyBtn = dropContent.querySelector('a.modify');
    const deleteBtn = dropContent.querySelector('a.delete');

    modifyBtn.addEventListener('click', function () {
      productNameInput.value = tr.cells[0].textContent;
      productExpiryDateInput.value = formatDate(itemExpiryDate);
      productQuantityInput.value = itemQuantity;
      productUnitPriceInput.value = itemUnitPrice;
      tbody.removeChild(tr);
      getGrandTotal();
      simulateChangeEvent(productNameInput);
    });

    deleteBtn.addEventListener('click', function () {
      tbody.removeChild(tr);
      productNameInput.value = '';
      productExpiryDateInput.value = '';
      productQuantityInput.value = '';
      productUnitPriceInput.value = '';
      getGrandTotal();
    });
  });

  function getGrandTotal() {
    let tot = 0;
    tbody.querySelectorAll('tr').forEach(tr => {
      tot += reformatNumber(tr.cells[5].textContent);
    });
    gradTotalCell.textContent = formatNumber(tot);
  }

  if (tbody.querySelectorAll('tr').length) {
    gradTotalCell.parentNode.querySelectorAll('td').forEach(td => {
      td.style.color = 'black';
    });
  } else {
    gradTotalCell.parentNode.querySelectorAll('td').forEach(td => {
      td.style.color = 'white';
    });
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



    dropdownContent.innerHTML = `<a href="#" class="modify">Modify</a>
                                 <a href="#" class="delete">Remove</a>`;
    dropContainer.appendChild(dropBtn);
    dropContainer.appendChild(dropdownContent);

    return dropContainer;
  }
}

function onHoldOrders() {

}

function viewSalesReport() {

}
function printSalesReport() {

  const modal = document.createElement('div');

  modal.className = 'sales-modal-container';

  const receipt = document.createElement('div');
  receipt.className = 'sales-receipt';

  const header = document.createElement('div');
  header.className = 'sales-header';

  header.innerHTML = `<span onclick="document.getElementById('invoice-modal').style.display='none'"
                         class="sales-close" title="Close Receipt">&times;</span>
                      <h1>MLT Trading PLC</h1>
                      <p>Kebele 06, Bahir Dar</p>
                      <p>Phone: +251 (0) 911 8677 | Email: info@mlttradingltd.com</p>`

  const storeInfo = document.createElement('div');
  storeInfo.className = 'sales-store-info';

  storeInfo.innerHTML = `<p>Invoice #: <span id="sales-invoice-number">10001</span></p>
                         <p>Date: <span id="sales-date"></span></p>`

  const customerInfo = document.createElement('div');
  const customerName = document.getElementById('sales-customer-name').value;
  // const customerTIN = document.getElementById('sales-tin-number').value;
  const isWithhold = document.getElementById('sales-withhold').checked;
  customerInfo.className = 'sales-customer-info';

  customerInfo.innerHTML = `<p>Customer Name: <span id="sales-customerName">${customerName}</span></p>`

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
                            <td class="sales-text-right">${formatNumber(Gtotal)}</td>
                            <td></td>`;
  trWithhold.innerHTML = `<td class="sales-text-right" style="font-weight: bold" colspan="5">Withhold Amount</td>
                          <td class="sales-text-right">${formatNumber(withhold)}</td>
                          <td></td>`;
  trSubtotal.innerHTML = `<td class="sales-text-right" style="font-weight: bold" colspan="5">Sub Total</td>
                          <td class="sales-text-right">${formatNumber(subtotal)}</td>
                          <td></td>`;
  tfoot.appendChild(trGrandTotal);
  tfoot.appendChild(trWithhold);
  tfoot.appendChild(trSubtotal);


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
  receipt.appendChild(printBtn);
  modal.appendChild(receipt);

  modal.querySelector('#sales-date').innerHTML = formatDate(new Date());

  return modal;
}

function manageCustomerInfo() {
  const customerDataList = document.getElementById('sales-customer-list');
  const customerNameInput = document.getElementById('sales-customer-name');
  // const customerTinNumberInput = document.getElementById('sales-tin-number');
  const customerIdInput = document.getElementById('sales-customer-id');
  const options = customerDataList.options;
  const selectedCustomerName = customerNameInput.value.trim();
  // customerTinNumberInput.disable = false;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === selectedCustomerName) {
      customerIdInput.value = options[i].dataset.id;
      // customerTinNumberInput.value = options[i].dataset.tin;
      // customerTinNumberInput.disable = true;
      break;
    } else if (selectedCustomerName === '') {
      // customerTinNumberInput.value = '';
      // customerTinNumberInput.disable = true;
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
  if (productList) {
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
  const productNameInput = document.getElementById('purchase-item-name');
  const nameDataList = document.getElementById('purchase-item-list');
  const descriptionInput = document.getElementById('purchase-product-description');

  nameDataList.innerHTML = '';

  const product_map = createProductMap(product_data);

  const productNames = Array.from(product_map.keys()); // Get all unique medicine names

  for (const name of productNames) {
    const products = product_map.get(name);
    const optionElement = document.createElement("option");
    optionElement.value = name;
    optionElement.textContent = name;
    optionElement.setAttribute('data-description', products[0].description);
    nameDataList.appendChild(optionElement);
  }

  productNameInput.addEventListener('input', function () {
    const product = this.value.trim();
    const options = nameDataList.options;

    for (let i = 0; i < options.length; i++) {
      if (options[i].value === product) {
        descriptionInput.value = options[i].dataset.description;
        descriptionInput.disabled = true;
        break;
      } else {
        descriptionInput.value = '';
      }
    }
    
  })


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

function createProductModal() {
  const modal = document.createElement('div');
  modal.className = 'product-modal-container';
  modal.id = 'product-modal';
  modal.innerHTML =
    `<div class="product-modal-content">
      <span onclick="document.getElementById('product-modal-container').style.display='none'" class="sales-close" title="Close Modal">&times;</span> 
      <div class="sales-container">
        <h2>New Product</h2>
        <br>
        <div class="sales-row">
          <div class="sales-col-50">
            <label for="product-name">Name <span style="color:red; font-size:20px;">*</span> </label>
            <input type="text" id="product-name" name="productName">
          </div>
        
        </div>
        <label for="product-description">Description | Unit</label>
        <textarea name="productDescription" id="product-description" style="width:100%; height:60px"></textarea>
        <div class="sales-row" style="margin-top:20px">
          <div class="sales-col-50">
            <button class="sales-btn product-save">Add</button>
          </div>
          <div class="sales-col-50">
            <button onclick="document.getElementById('product-modal-container').style.display='none'" class="sales-btn" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
  return modal;
}

function appendOption () {
  const modalProductNameInput = document.getElementById('product-modal').querySelector('#product-name');
  const modalProductDescInput = document.getElementById('product-modal').querySelector("#product-description");

  const productNameInput = document.getElementById('purchase-item-name');
  const nameDataList = document.getElementById('purchase-item-list');

  if(modalProductNameInput.value.trim()) {
    const option = document.createElement('option');
    option.id = modalProductNameInput.value.trim();
    option.value = modalProductNameInput.value.trim();
    option.setAttribute('data-description', modalProductDescInput.value.trim());  

    nameDataList.appendChild(option);
    productNameInput.value = option.value;
    simulateChangeEvent(productNameInput);
  }
}


function simulateChangeEvent(element) {
  const changeEvent = new Event('input', { bubbles: true });
  element.dispatchEvent(changeEvent);
}

function parseDate(formattedDate) {
  // Split the formatted date string into parts (assuming US format MM/DD/YYYY)
  const parts = formattedDate.split('/');

  // Check if the format seems valid (length of 3 and parts are numbers)
  if (parts.length !== 3 || !parts.every(part => !isNaN(part))) {
    throw new Error("Invalid date format. Expected DD/MM/YYYY");
  }

  // Extract month, day, and year as numbers (adjust month for zero-based indexing)
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const year = parseInt(parts[2]);

  // Create a new Date object and return it
  return new Date(year, month, day);
}

function eraseProductInfo() {
  const productNameInput = document.getElementById('purchase-item-name');
  const productQuantityInput = document.getElementById('purchase-item-quantity');
  const productUnitPriceInput = document.getElementById('purchase-item-price');
  const productExpiryDateInput = document.getElementById('purchase-item-expiry');

  productExpiryDateInput.value = '';
  productNameInput.value = '';
  productQuantityInput.value = '';
  productUnitPriceInput.value = '';
}

function eraseCustomerInfo() {
  document.getElementById('sales-customer-name').checked = false;
  document.getElementById('sales-customer-name').value = '';
}

function wipeOutOrderTable(){
  document.querySelector('.sales-table-container table tbody').innerHTML = '';
  document.querySelector('.sales-table-container table thead.total-sales').style.display = 'none';
}

function getPurchasedProductFromTable() {
  const table_body = document.getElementById('sales-current-order').querySelector('tbody');
  let purchasedProducts = []; 
  table_body.querySelectorAll('tr').forEach(row => {
    const productName = row.cells[0].textContent;
    const expiryDate = row.cells[1].textContent;
    const unitDescription = row.cells[2].textContent;
    const unitPrice = parseFloat(row.cells[3].textContent);
    const quantity = parseInt(row.cells[4].textContent.trim());
    const data = {
      name: productName, 
      expiry_date: parseDate(expiryDate),
      unit_description: unitDescription,
      purchase_price: unitPrice,
      quantity: quantity
    };
    // console.log('purchase: ', data)
    purchasedProducts.push(data);
  });
  return purchasedProducts;
} 

function getPurchaseSupplierData(){
  const supplierName = document.getElementById('sales-customer-name').value.trim();
  const supplierId = document.getElementById('sales-customer-id').value.trim();
  const withholdStatus = document.getElementById('sales-withhold').checked;

  const data = {
    supplier_name: supplierName,
    supplier_id: parseInt(supplierId),
    withhold_status: withholdStatus
  }
  return data;
}


async function registerPurchase() {
  const purchasedProducts = getPurchasedProductFromTable();
  const purchaseSupplier = getPurchaseSupplierData();
  if (purchaseSupplier.supplier_name === ''){
    alert('Supplier is Required');
    return;
  }

  for (const product of purchasedProducts){
    const ProductData = {
      name: product.name,
      description: product.unit_description,
      purchase_price: product.purchase_price,
      saling_price: null,
      expiry_date: product.expiry_date,
      supplier_id: purchaseSupplier.supplier_id,
      remarks: ''
    };
    console.log('product: ', ProductData)
    const productIdText = await window.electronAPI.fetchData('add-products-data', ProductData);
    let productId = parseInt(JSON.parse(productIdText)[0].id);

    const totalPrice = product.purchase_price * product.quantity;
    let amountPaid; let withheldAmount;
    if (purchaseSupplier.withhold_status) {
      amountPaid = 0.98 * totalPrice;
      withheldAmount = 0.02 * totalPrice;
    } else {
      amountPaid = totalPrice;
      withheldAmount = 0;
    }
    const purchaseData = {
      product_id: productId,
      quantity: product.quantity,
      purchase_date: new Date(),
      payment_method: '',
      amount_paid: amountPaid,
      tax_withheld: withheldAmount,
      remarks: '',
      supplier_id: ProductData.supplier_id,
      unit_price: ProductData.purchase_price
    }
    // console.log('purchase data : ', purchaseData)

    const purchaseIdText = await window.electronAPI.fetchData('add-purchase-data', purchaseData);
    const purchaseId = parseInt(JSON.parse(purchaseIdText)[0].id);

    const productStock = {
      product_id: productId,
      quantity: product.quantity,
      purchase_id: purchaseId,
      supplier_id: purchaseSupplier.supplier_id,
      remarks: '' 
    } 

    console.log('stock data: ', productStock);

    const productStockIdText = await window.electronAPI.fetchData('add-stock-data', productStock);
    const productStockId = parseInt(JSON.parse(productStockIdText)[0].id);
    
    if (productId === productStockId){
      console.log('Product name = ',productData.name, 'with id = ', productId, 'is successfully added');
    }
  }
  document.getElementById('sales-exit-btn').click();

}

const salesPage = {
  makeSalesPage,
  getProductData,
  getCustomerData,
  createProductMap
}

export { salesPage }