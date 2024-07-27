import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const transactionMgtMenu = document.getElementById('transactionMgt');
const salesMainBtn = document.getElementById('salesBtn');
const purchaseMainBtn = document.getElementById('purchaseBtn');



salesMainBtn.addEventListener('click', async function () {
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

  await salesDetails(tableContainer);
  await orderDetails(orderTableContainer);


});
let rowData = {};
purchaseMainBtn.addEventListener('click', async function () {
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

  await purchaseDetails(tableContainer);
  await productDetails(productTableContainer, productModal);
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

async function salesDetails(sales_tab) {
  sales_tab.innerHTML = '';
  const salesTableHeader = ['ID', 'Date', 'Customer', 'Order ID', 'Item Name', 'Unit Price', 'Quantity', 'Total Price'];

  let commonData = {
    tableId: "sales-table-container",
    tableHeader: salesTableHeader,
    tableData: []
  };

  // const salesRawData = localStorage.getItem('sales-data');
  // const productRawData = localStorage.getItem('products-data');
  // const retailerRawData = localStorage.getItem('retailers-data');


  // const salesObjData = JSON.parse(salesRawData);
  // const productObjData = JSON.parse(productRawData);
  // const retailerObjData = JSON.parse(retailerRawData);

  const queryType = 'SELECT';
  const query = `SELECT
                    s.id AS id,
                    s.sale_date AS date,
                    r.name AS customer,
                    s.order_id AS order_id,
                    p.name AS product_name,
                    p.saling_price AS selling_price,
                    s.quantity_sold AS quantity,
                    s.amount_received AS total_price
                  FROM sales s
                  JOIN products p ON s.product_id = p.id
                  JOIN retailers r ON s.retailer_id = r.id
                  WHERE s.checkout_status = 'sold' ORDER BY s.sale_date DESC`;

  const salesRawData = await window.electronAPI.sendQuery('general-query', queryType, query);

  const salesObjData = JSON.parse(salesRawData);
  
  const salesTableData = salesObjData.map(sales => [
    sales.id, 
    formatDate(sales.date), 
    sales.customer, 
    sales.order_id, 
    sales.product_name, 
    formatNumber(parseFloat(sales.selling_price)), 
    sales.quantity, 
    formatNumber(parseFloat(sales.total_price)) 
  ])

  // const productMap = new Map(productObjData.map(item => 
  //   [parseInt(item.id), {name: item.name, sellingPrice: item.saling_price}]));

  
  

  // const retailerMap = new Map(retailerObjData.map(retailer => 
  //   [parseInt(retailer.id), retailer.name]));
  //   let salesTableData = [];
  //   for ( const sales of salesObjData) {
  //     if (sales.checkout_status === 'sold') {
  //       const product_id = parseInt(sales.product_id);
  //       const item_name = productMap.get(product_id).name;
  //       const customer_name = retailerMap.get(parseInt(sales.retailer_id));
  //       const unit_price_number = parseFloat(productMap.get(product_id).sellingPrice);
  //       const unit_price_formatted = formatNumber(parseFloat(unit_price_number));
  //       const sales_date_formatted = formatDate(sales.sale_date);
  //       const quantity_sold = sales.quantity_sold;
  //       const quantity_sold_number = parseInt(quantity_sold);
  //       const total_price_number = unit_price_number * quantity_sold_number;
  //       const total_price_formatted = formatNumber(total_price_number);
  //       const salesData = [sales.id, sales_date_formatted, customer_name, sales.order_id, item_name, unit_price_formatted, quantity_sold,
  //         total_price_formatted, sales.remarks];
  //       salesTableData.push(salesData);
  //     }
  //   }

  commonData.tableData = salesTableData;

  const salesHTMLtable = new CreateTableFromData(commonData);

  salesHTMLtable.renderTable();
}

async function purchaseDetails(purchase_tab) {
  purchase_tab.innerHTML = '';
  const purchaseTableHeader = ['ID', 'Date', 'Supplier Comp.', 'Item Description', 'Unit Price', 'Quantity', 'Total Price'];

  let commonData = {
    tableId: "purchase-table-container",
    tableHeader: purchaseTableHeader,
    tableData: []
  };

  const query = `SELECT 
                    pch.id AS id,
                    pch.purchase_date AS purchase_date,
                    sup.name AS supplier_name,
                    p.name AS product_description,
                    pch.unit_price As unit_price,
                    pch.quantity AS quantity,
                    pch.amount_paid AS total_amount
                  FROM purchase pch 
                  JOIN products p ON pch.product_id = p.id
                  JOIN suppliers sup ON pch.supplier_id = sup.id
                  ORDER BY pch.purchase_date DESC`
  const purchaseRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', query);
  const purchaseData = JSON.parse(purchaseRawData);
  const purchaseTableData = purchaseData.map(p => [
    p.id, 
    formatDate(p.purchase_date), 
    p.supplier_name, p.product_description, 
    formatNumber(parseFloat(p.unit_price)),
    p.quantity, 
    formatNumber(parseFloat(p.total_amount))
  ]);

  commonData.tableData = purchaseTableData;

  const purchaseHTMLtable = new CreateTableFromData(commonData);

  purchaseHTMLtable.renderTable();
}

async function orderDetails(order_tab) {
  order_tab.innerHTML = '';
  const orderTableHeader = ['ID', 'Date', 'Customer Name', 'Total Amount', 'Tax Withheld', 'Amount Paid', 'Amount Remaining'];

  let commonData = {
    tableId: "order-table-container",
    tableHeader: orderTableHeader,
    tableData: []
  };

  const query = `SELECT 
                    so.id AS id,
                    so.order_date AS date,
                    r.name AS customer,
                    so.total_amount AS total,
                    so.tax_withheld AS tax,
                    so.amount_paid AS paid,
                    so.amount_remaining AS remaining,
                    so.checkout_status AS checkout_status  
                  FROM sales_order so
                  JOIN retailers r ON so.customer_id = r.id
                  WHERE so.checkout_status = 'sold'
                  ORDER BY so.order_date DESC`;
  
  const orderRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', query);

  const orderObjData = JSON.parse(orderRawData);

  const orderTableData = orderObjData.map(or => [
    or.id, formatDate(or.date), 
    or.customer, 
    formatNumber(parseFloat(or.total)), 
    formatNumber(parseFloat(or.tax)),
    formatNumber(parseFloat(or.paid)),
    formatNumber(parseFloat(or.remaining))
  ]);

  commonData.tableData = orderTableData;

  const orderHTMLtable = new CreateTableFromData(commonData);

  orderHTMLtable.renderTable();
}

async function productDetails(product_tab, product_modal) {
  product_tab.innerHTML = '';
  const productsTableHeader = ['ID', 'Item Description', 'Unit', 'Selling Price',
    'Expiry Date', 'Remarks'];

  let commonData = {
    tableId: "product-table-container",
    tableHeader: productsTableHeader,
    tableData: []
  };

  const query = `SELECT * FROM products ORDER BY name ASC`;


  const productsRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', query);
  

  const productsObjData = JSON.parse(productsRawData);


  const productsTableData = productsObjData.map(obj => [obj.id, obj.name, obj.description, formatNumber(parseFloat(obj.saling_price)),
  formatDate(obj.expiry_date), obj.remarks]);

  commonData.tableData = productsTableData;

  const productsHTMLtable = new CreateTableFromData(commonData);

  productsHTMLtable.renderTable();

  clickable_dropdown_btn(product_tab.querySelector('table'));

  const purchaseRawData = await window.electronAPI.sendQuery('general-query', 'SELECT', 
    'SELECT * FROM purchase'
  )

  const purchaseData = JSON.parse(purchaseRawData);

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



