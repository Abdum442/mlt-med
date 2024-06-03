import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const transactionMgtMenu = document.getElementById('transactionMgt');
const salesMainBtn = document.getElementById('salesBtn');
const purchaseMainBtn = document.getElementById('purchaseBtn');



salesMainBtn.addEventListener('click', function () {
  const transactionContent = document.body.querySelector('.details .recentOrders');
  transactionContent.innerHTML = '';

  const tabContainer = inventoryContainer();
  const salesModal = createSalesModal();

  const salesContent = tabContainer.querySelector('#sales-content');
  const orderContent = tabContainer.querySelector('#order-content');

  transactionContent.appendChild(tabContainer);
  transactionContent.appendChild(salesModal);

  const newSalesBtn = document.createElement('div');
  newSalesBtn.className = 'add-new-sales';

  const salesBtn = document.createElement('button');
  salesBtn.textContent = 'Add New Order';

  newSalesBtn.appendChild(salesBtn);

  salesBtn.addEventListener('click', function () {
    const fileObject = { file: './admin/sales_page.html' };
    window.electronAPI.fetchData('open-sales-window', fileObject);
  });

  const tableContainer = document.createElement('div');
  tableContainer.id = 'sales-table-container';

  salesContent.innerHTML = '';
  salesContent.appendChild(newSalesBtn);
  salesContent.appendChild(tableContainer);

  const orderTableContainer = document.createElement('div');
  orderTableContainer.id = 'order-table-container';

  orderContent.innerHTML = '';
  orderContent.appendChild(orderTableContainer);

  manageTabEvents(tabContainer);

  salesDetails(tableContainer);
  orderDetails(orderTableContainer);


});
let rowData = {};
purchaseMainBtn.addEventListener('click', function () {
  const transactionContent = document.body.querySelector('.details .recentOrders');
  transactionContent.innerHTML = '';
  const tabContainer = purchaseTransactionContainer();
  const productModal = createSalesModal();

  const purchaseContent = tabContainer.querySelector('#purchase-content');
  const productContent = tabContainer.querySelector('#product-content');

  transactionContent.appendChild(tabContainer);
  transactionContent.appendChild(productModal);

  const newSalesBtn = document.createElement('div');
  newSalesBtn.className = 'add-new-sales';

  const salesBtn = document.createElement('button');
  salesBtn.textContent = 'Add New Purchase';

  newSalesBtn.appendChild(salesBtn);

  salesBtn.addEventListener('click', function () {
    const fileObject = { file: './admin/purchase_page.html' };
    window.electronAPI.fetchData('open-sales-window', fileObject);
  });

  const tableContainer = document.createElement('div');
  tableContainer.id = 'purchase-table-container';

  purchaseContent.innerHTML = '';
  purchaseContent.appendChild(newSalesBtn);
  purchaseContent.appendChild(tableContainer);

  const productTableContainer = document.createElement('div');
  productTableContainer.id = 'product-table-container';

  productContent.innerHTML = '';
  productContent.appendChild(productTableContainer);

  managePurchaseTabEvents(tabContainer);

  purchaseDetails(tableContainer);
  productDetails(productTableContainer, productModal);
  productModal.querySelector('.product-save').addEventListener('click', function () {
    saveProductDetails(productModal);
  });
});

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

function manageTabEvents(tab_cont) {
  const salesTab = tab_cont.querySelector('#sales');
  const orderTab = tab_cont.querySelector('#order');

  salesTab.addEventListener('click', function () {
    manageTabs('sales', 'sales-content')
  });
  orderTab.addEventListener('click', function () {
    manageTabs('order', 'order-content')
  });

  salesTab.click();
}
function managePurchaseTabEvents(tab_cont) {
  const purchaseTab = tab_cont.querySelector('#purchase');
  const productTab = tab_cont.querySelector('#purchase-product');

  purchaseTab.addEventListener('click', function () {
    manageTabs('purchase', 'purchase-content')
  });
  productTab.addEventListener('click', function () {
    manageTabs('purchase-product', 'product-content')
  });

  purchaseTab.click();
}

function inventoryContainer() {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.id = "transaction-container"

  tabContainer.innerHTML = `<div class="tab">
              <button class="tab-link" id="sales">Sales</button>
              <button class="tab-link" id="order">Order List</button>
            </div>
            <div class="tab-content" id="sales-content">
              <h2>Sales</h2>
            </div>
            <div class="tab-content" id="order-content">
              <h2>Order List</h2>
            </div>`;
  return tabContainer;
}
function purchaseTransactionContainer() {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.id = "purchase-transaction-container"

  tabContainer.innerHTML = `<div class="tab">
              <button class="tab-link" id="purchase">Purchase</button>
              <button class="tab-link" id="purchase-product">Products</button>
            </div>
            <div class="tab-content" id="purchase-content">
              <h2>Sales</h2>
            </div>
            <div class="tab-content" id="product-content">
              <h2>Products</h2>
            </div>`;
  return tabContainer;
}

function salesDetails(sales_tab) {
  sales_tab.innerHTML = '';
  const salesTableHeader = ['ID', 'Date', 'Customer', 'Order ID', 'Item Name', 'Unit Price', 'Quantity', 'Total Price', 'Remarks'];

  let commonData = {
    tableId: "sales-table-container",
    tableHeader: salesTableHeader,
    tableData: []
  };

  const salesRawData = localStorage.getItem('sales-data');
  const productRawData = localStorage.getItem('products-data');
  const retailerRawData = localStorage.getItem('retailers-data');


  const salesObjData = JSON.parse(salesRawData);
  const productObjData = JSON.parse(productRawData);
  const retailerObjData = JSON.parse(retailerRawData);


  const productMap = new Map(productObjData.map(item => 
    [parseInt(item.id), {name: item.name, sellingPrice: item.saling_price}]));

  

  const retailerMap = new Map(retailerObjData.map(retailer => 
    [parseInt(retailer.id), retailer.name]));
    let salesTableData = [];
    for ( const sales of salesObjData) {
      if (sales.checkout_status === 'sold') {
        const product_id = parseInt(sales.product_id);
        const item_name = productMap.get(product_id).name;
        const customer_name = retailerMap.get(parseInt(sales.retailer_id));
        const unit_price_number = parseFloat(productMap.get(product_id).sellingPrice);
        const unit_price_formatted = formatNumber(parseFloat(unit_price_number));
        const sales_date_formatted = formatDate(sales.sale_date);
        const quantity_sold = sales.quantity_sold;
        const quantity_sold_number = parseInt(quantity_sold);
        const total_price_number = unit_price_number * quantity_sold_number;
        const total_price_formatted = formatNumber(total_price_number);
        const salesData = [sales.id, sales_date_formatted, customer_name, sales.order_id, item_name, unit_price_formatted, quantity_sold,
          total_price_formatted, sales.remarks];
        salesTableData.push(salesData);
      }
    }

  commonData.tableData = salesTableData;

  const salesHTMLtable = new CreateTableFromData(commonData);

  salesHTMLtable.renderTable();
}

function purchaseDetails(purchase_tab) {
  purchase_tab.innerHTML = '';
  const purchaseTableHeader = ['ID', 'Date', 'Supplier Comp.', 'Item Description', 'Unit Price', 'Quantity', 'Total Price', 'Remarks'];

  let commonData = {
    tableId: "purchase-table-container",
    tableHeader: purchaseTableHeader,
    tableData: []
  };

  const purchaseRawData = localStorage.getItem('purchase-data');
  const productRawData = localStorage.getItem('products-data');
  const suppliersRawData = localStorage.getItem('suppliers-data');


  const purchaseObjData = JSON.parse(purchaseRawData);
  const productObjData = JSON.parse(productRawData);
  const supplierObjData = JSON.parse(suppliersRawData);


  const productMap = new Map(productObjData.map(item =>
    [parseInt(item.id), item.name ]));



  const supplierMap = new Map(supplierObjData.map(supplier =>
    [parseInt(supplier.id), supplier.name]));
  let purchaseTableData = [];
  for (const purchase of purchaseObjData) {
    const product_id = parseInt(purchase.product_id);
    const item_name = productMap.get(product_id);
    const customer_name = supplierMap.get(parseInt(purchase.supplier_id));
    const unit_price_number = parseFloat(purchase.unit_price);
    const unit_price_formatted = formatNumber(unit_price_number);
    const purchase_date_formatted = formatDate(purchase.purchase_date);
    const quantity = purchase.quantity;
    const quantity_number = parseInt(quantity);
    const total_price_number = unit_price_number * quantity_number;
    const total_price_formatted = formatNumber(total_price_number);
    const purchaseData = [purchase.id, purchase_date_formatted, customer_name,item_name, unit_price_formatted, quantity,
        total_price_formatted, purchase.remarks];
    purchaseTableData.push(purchaseData);
  }

  commonData.tableData = purchaseTableData;

  const purchaseHTMLtable = new CreateTableFromData(commonData);

  purchaseHTMLtable.renderTable();
}

function orderDetails(order_tab) {
  order_tab.innerHTML = '';
  const orderTableHeader = ['ID', 'Date', 'Customer Name', 'Total Amount', 'Tax Withheld', 'Amount Paid', 'Amount Remaining'];

  let commonData = {
    tableId: "order-table-container",
    tableHeader: orderTableHeader,
    tableData: []
  };

  const orderObjData = JSON.parse(localStorage.getItem('orders-data'));
  const retailerObjData = JSON.parse(localStorage.getItem('retailers-data'));

  const retailerMap = new Map(retailerObjData.map(retailer => {
    return [parseInt(retailer.id), retailer.name];
  }))

  let orderTableData = [];

  for ( const order of orderObjData ) {
    if (order.checkout_status === 'sold') {
      const customer_name = retailerMap.get(parseInt(order.customer_id));
      const order_date = formatDate(order.order_date);
      const total_amount = formatNumber(parseFloat(order.total_amount));
      const amount_paid = formatNumber(parseFloat(order.amount_paid));
      const amount_remaining = formatNumber(parseFloat(order.amount_remaining));
      const tax_withheld = formatNumber(parseFloat(order.tax_withheld));
      const orderData = [order.id, order_date, customer_name, total_amount, tax_withheld,
        amount_paid, amount_remaining];
      orderTableData.push(orderData);
    } 
  }
  commonData.tableData = orderTableData;

  const orderHTMLtable = new CreateTableFromData(commonData);

  orderHTMLtable.renderTable();
}

function productDetails(product_tab, product_modal) {
  product_tab.innerHTML = '';
  const productsTableHeader = ['ID', 'Item Description', 'Unit', 'Selling Price',
    'Expiry Date', 'Remarks'];

  let commonData = {
    tableId: "product-table-container",
    tableHeader: productsTableHeader,
    tableData: []
  };

  const productsRawData = localStorage.getItem('products-data');
  const purchaseData = JSON.parse(localStorage.getItem('purchase-data'));
  console.log('purchase Data :', purchaseData);

  const productsObjData = JSON.parse(productsRawData);

  const productMap = new Map(productsObjData.map(item => [parseInt(item.id), item.purchase_price]));

  const productsTableData = productsObjData.map(obj => [obj.id, obj.name, obj.description, formatNumber(parseFloat(obj.saling_price)),
  formatDate(obj.expiry_date), obj.remarks]);

  commonData.tableData = productsTableData;

  const productsHTMLtable = new CreateTableFromData(commonData);

  productsHTMLtable.renderTable();

  clickable_dropdown_btn(product_tab.querySelector('table'));

  product_tab.querySelectorAll('table tbody tr').forEach(function (tr) {
    // console.log(tr.cells[0].textContent, tr.cells[4].textContent);
    tr.querySelector("td .drop-btn").addEventListener('click', function (event) {
      event.stopPropagation();

      rowData['id'] = tr.cells[0].textContent;
      rowData['productName'] = tr.cells[1].textContent;
      rowData['productDescription'] = tr.cells[2].textContent;
      rowData['sellingPrice'] = reformatNumber(tr.cells[3].textContent);
      rowData['expiryDate'] = tr.cells[4].textContent;
      rowData['remark'] = tr.cells[5].textContent;
      // rowData['purchasePrice'] = productMap.get(parseInt(rowData.id));

      const dropContent = tr.cells[6].querySelector("td .dropdown-btn .drop-content");

      dropContent.classList.add('show');

      const modifyBtn = dropContent.querySelector(".modify");
      const deleteBtn = dropContent.querySelector('.delete');

      deleteBtn.style.display = 'none';

      modifyBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        product_modal.querySelector('[name="productName"]').value = rowData.productName;
        product_modal.querySelector('[name="productDescription"]').value = rowData.productDescription;
        // const purchasePrice = Number(rowData.purchasePrice);
        const purchasePrice = purchaseData.find(purchase =>
          parseInt(purchase.product_id) === parseInt(rowData.id)).unit_price;
        console.log('product id : ', rowData.id);
        console.log('purchase price : ', purchasePrice);
        product_modal.querySelector('[name="purchasePrice"]').value = formatNumber(purchasePrice);
        product_modal.querySelector('[name="sellingPrice"]').value = rowData.sellingPrice;
        product_modal.querySelector('[name="productRemark"]').value = rowData.remark;

        product_modal.querySelector('[name="purchasePrice"]').disabled = true;
        product_modal.style.display = 'block';
      });
    });
  });
}
function createSalesModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'product-modal'
  modal.innerHTML =
    `<div class="modal-content">
      <span onclick="document.getElementById('product-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
      <h2>Edit Item Info</h2>
      <div class="form-container">
        <div class="row">
          <div class="col-50">
            <h3>Item Details</h3>
            <label for="product-name">Name</label>
            <input type="text" id="product-name" name="productName">
            <label for="product-description">Description</label>
            <textarea name="productDescription" id="product-description" style="width:100%; height:50px;resize:vertical;"></textarea>
          </div>
          <div class="col-50">
            <h3>Unit Prices</h3>
            <label for="purchase-price">Purchasing Price</label>
            <input type="text" id="purchase-price" name="purchasePrice">
            <label for="selling-price">Selling Price</label>
            <input type="text" id="selling-price" name="sellingPrice">
          </div>
        </div>
        <label for="product-remark">Remarks</label>
        <textarea name="productRemark" id="product-remark" style="width:100%; height:100px"></textarea>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn product-save">Save</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('product-modal').style.display='none'" class="btn" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
  return modal;
}

async function saveProductDetails(product_modal) {

  const formData = {};

  formData['id'] = rowData.id;
  formData['productName'] = product_modal.querySelector('[name="productName"]').value;
  formData['productDescription'] = product_modal.querySelector('[name="productDescription"]').value;
  const selling_price = parseInt(product_modal.querySelector('[name="sellingPrice"]').value)
  formData['sellingPrice'] = selling_price;
  formData['productRemark'] = product_modal.querySelector('[name="productRemark"]').value;




  const id = await window.electronAPI.fetchData('modify-products-data', formData);

  product_modal.style.display = 'none';
  transactionMgtMenu.click();
  purchaseMainBtn.click();
  document.getElementById('purchase-product').click();
} 






function formatNumber(number) {
  return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionsDigits: 2 })
}
function reformatNumber(text) {
  const number = text.replace(/,/g, "");
  return parseFloat(number);
}

// //========================utility functions====================
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



