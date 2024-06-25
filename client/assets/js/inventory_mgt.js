import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const inventoryMgtMenu = document.getElementById('inventoryMgt');
const customerMgtMenu = document.getElementById('customerMgt');

inventoryMgtMenu.addEventListener('click', function () {
  const inventoryContent = document.body.querySelector('.details .recentOrders');
  inventoryContent.innerHTML = '';

  const tabContainer = inventoryContainer();

  const productContent = tabContainer.querySelector('#voids-content');
  const stockContent = tabContainer.querySelector('#stock-content');
  const expiryContent = tabContainer.querySelector('#expiry-content');

  inventoryContent.appendChild(tabContainer);

  const voidsTableContainer = document.createElement('div');
  voidsTableContainer.id = 'voids-table';

  const voidsModal = createVoidsModal();


  productContent.appendChild(voidsTableContainer);
  productContent.appendChild(voidsModal);

  voidsModal.querySelector('.void-save').addEventListener('click', async function () {
    saveVoidDetails(voidsModal);
  })

  manageTabEvents(tabContainer);

  stockDetails(stockContent);
  expiryDateDetails(expiryContent);
  voidsDetails();
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
  const productTab = tab_cont.querySelector('#voids');
  const stockTab = tab_cont.querySelector('#stock');
  const expiryTab = tab_cont.querySelector('#expiry');

  productTab.addEventListener('click', function () {
    manageTabs('voids', 'voids-content')
  });
  stockTab.addEventListener('click', function () {
    manageTabs('stock', 'stock-content')
  });
  expiryTab.addEventListener('click', function () {
    manageTabs('expiry', 'expiry-content')
  });

  stockTab.click();
}

function inventoryContainer() {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.id = "inventory-container"

  tabContainer.innerHTML = `<div class="tab">
              <button class="tab-link" id="stock">Stock Level</button>
              <button class="tab-link" id="expiry">Expiry Date Tracker</button>
              <button class="tab-link" id="voids">Voided Items</button>
            </div>
            <div class="tab-content" id="stock-content">
              <h2>Stock Level</h2>
            </div>
            <div class="tab-content" id="expiry-content">
              <h2>Expiry Date Tracker</h2>
            </div>
            <div class="tab-content" id="voids-content">
              <h2>Voided Products</h2>
            </div>`;
  return tabContainer;
}

// function productDetails(product_tab, product_modal) {
//   product_tab.innerHTML = '';
//   const productsTableHeader = ['ID', 'Name', 'Description/Unit', 'Selling Price',
//     'Expiry Date', 'Remarks'];

//   let commonData = {
//     tableId: "product-content",
//     tableHeader: productsTableHeader,
//     tableData: []
//   };

//   const productsRawData = localStorage.getItem('products-data');
//   const purchaseData = JSON.parse(localStorage.getItem('purchase-data'));

//   const productsObjData = JSON.parse(productsRawData);
  
//   const productMap = new Map(productsObjData.map(item => [parseInt(item.id), item.purchase_price]));

//   const productsTableData = productsObjData.map(obj => [obj.id, obj.name, obj.description, formatNumber(parseFloat(obj.saling_price)),
//   formatDate(obj.expiry_date), obj.remarks]);

//   commonData.tableData = productsTableData;

//   const productsHTMLtable = new CreateTableFromData(commonData);

//   productsHTMLtable.renderTable();

//   clickable_dropdown_btn(product_tab.querySelector('table'));
//   product_tab.querySelectorAll('table tbody tr').forEach(function (tr) {
//     // console.log(tr.cells[0].textContent, tr.cells[4].textContent);
//     tr.querySelector("td .drop-btn").addEventListener('click', function (event) {
//       event.stopPropagation();

//       rowData['id'] = tr.cells[0].textContent;
//       rowData['productName'] = tr.cells[1].textContent;
//       rowData['productDescription'] = tr.cells[2].textContent;
//       rowData['sellingPrice'] = reformatNumber(tr.cells[3].textContent);
//       rowData['expiryDate'] = tr.cells[4].textContent;
//       rowData['remark'] = tr.cells[5].textContent;
//       // rowData['purchasePrice'] = productMap.get(parseInt(rowData.id));

//       const dropContent = tr.cells[6].querySelector("td .dropdown-btn .drop-content");

//       dropContent.classList.add('show');

//       const modifyBtn = dropContent.querySelector(".modify");
//       const deleteBtn = dropContent.querySelector('.delete');

//       deleteBtn.style.display = 'none';

//       modifyBtn.addEventListener('click', function (event) {
//         event.stopPropagation();
//         product_modal.querySelector('[name="productName"]').value = rowData.productName;
//         product_modal.querySelector('[name="productDescription"]').value = rowData.productDescription;
//         // const purchasePrice = Number(rowData.purchasePrice);
//         const purchasePrice = purchaseData.find(purchase =>
//           parseInt(purchase.product_id) === parseInt(rowData.id)).unit_price;
//         console.log('product id : ', rowData.id);
//         console.log('purchase price : ', purchasePrice);
//         product_modal.querySelector('[name="purchasePrice"]').value = formatNumber(purchasePrice);
//         product_modal.querySelector('[name="sellingPrice"]').value = rowData.sellingPrice;
//         product_modal.querySelector('[name="productRemark"]').value = rowData.remark;
        
//         product_modal.querySelector('[name="purchasePrice"]').disabled = true;
//         product_modal.style.display = 'block';
//       });
//     });
//   });

// }

async function stockDetails(stock_tab) {
  stock_tab.innerHTML = '';
  const stockTableHeader = ['Item Name', 'Quantity', 'Purchase ID', 'Expiry Date'];

  let commonData = {
    tableId: "stock-content",
    tableHeader: stockTableHeader,
    tableData: []
  };


  const queryType = 'SELECT';
  const query = `SELECT
                    p.name AS product_name,
                    s.quantity,
                    s.purchase_id,
                    p.expiry_date AS expiry_date
                  FROM  
                    company_stock s
                  JOIN 
                    products p ON s.product_id = p.id
                  ORDER BY
                    p.expiry_date ASC`;
  const stockRawData = await window.electronAPI.sendQuery('general-query', queryType, query);
  const stockObjData = JSON.parse(stockRawData);
  const stockTableData = stockObjData.map(stock => [
    stock.product_name,
    stock.quantity,
    stock.purchase_id,
    formatDate(stock.expiry_date)
  ]);

  commonData.tableHeader = stockTableHeader;
  commonData.tableData = stockTableData;

  const stockHTMLtable = new CreateTableFromData(commonData);

  stockHTMLtable.renderTable();

  clickable_dropdown_btn(stock_tab.querySelector('table'));

  const voidsModal = document.getElementById('voids-modal');

  // console.log('voids modal: ', voidsModal);

  stock_tab.querySelectorAll('table tbody tr').forEach(tr => {
    const modifyBtn = tr.querySelector('td .drop-content a.modify');
    const deleteBtn = tr.querySelector('td .drop-content a.delete');
    tr.querySelector('td .drop-btn').addEventListener('click', (event) => {
      event.stopPropagation();
      tr.querySelector('td .dropdown-btn .drop-content').classList.add('show');
      deleteBtn.style.display = 'none';
      modifyBtn.textContent = 'Manage';
    })

    modifyBtn.addEventListener('click', async function (event) {
      event.stopPropagation();
      const purchaseId = parseInt(tr.cells[2].textContent);

      const queryType = 'SELECT';
      const query = `SELECT p.name AS product_name, 
                            p.id AS product_id,
                            p.expiry_date AS expiry_date, 
                            s.quantity 
                      FROM company_stock s 
                      JOIN products p 
                          ON s.product_id = p.id 
                      WHERE s.purchase_id = $1`;
      const queryData = [purchaseId];

      const productRawData = await window.electronAPI.sendQuery('general-query', queryType, query, queryData);

      const productData = JSON.parse(productRawData);
      // console.log('product data: ', productData);

      voidsModal.querySelector('#product-name').value = productData[0].product_name;
      voidsModal.querySelector('#product-stock').value = productData[0].quantity;
      voidsModal.querySelector('#product-expiry').value = formatDate(productData[0].expiry_date);
      voidsModal.querySelector('#void-id').value = productData[0].product_id;

      voidsModal.querySelector('#product-name').disabled = true;
      voidsModal.querySelector('#product-stock').disabled = true;
      voidsModal.querySelector('#product-expiry').disabled = true;

      document.getElementById('voids').click();
      voidsModal.style.display = 'block';




    })
  })
}

function expiryDateDetails (expiry_tab) {
  expiry_tab.innerHTML = '';

  let commonData = {
    tableId: "expiry-content",
    tableHeader: '',
    tableData: []
  };

    const expiryDateTableHeader = ['ID', 'Item', 'Expiry Date', 'Status'];

    const productObjData = JSON.parse(localStorage.getItem('products-data'));

    const expiryDateTableData = productObjData.map(product => {
      return [product.id, product.name, formatDate(product.expiry_date), ""];
    });

    commonData.tableHeader = expiryDateTableHeader;
    commonData.tableData = expiryDateTableData;

    const expiryDateTable = new CreateTableFromData(commonData);

    expiryDateTable.renderTable();

    expiry_tab.querySelectorAll('table tbody tr').forEach(function (tr) {
      const expiry_date = new Date(tr.cells[2].textContent);

      // console.log(tr.cells[0].textContent, tr.cells[2].textContent);
      const today = new Date();
      const timeRemaining = Math.floor((expiry_date - today) / (1000 * 60 * 60 * 24));

      if (timeRemaining < 30) {
        tr.cells[3].innerHTML = `<span class="status return">Expired / Expiring Soon</span>`;
      } else if (timeRemaining < 60) {
        tr.cells[3].innerHTML = `<span class="status pending">Near Expiry</span>`;
      } else {
        tr.cells[3].innerHTML = `<span class="status delivered">Full Shelf Life</span>`;
      }
    });
} 

function createVoidsModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'voids-modal'
  modal.innerHTML =
    `<div class="modal-content">
      <span onclick="document.getElementById('voids-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
      <h2>Edit Item Info</h2>
      <div class="form-container">
        <div class="row">
          <div class="col-50">
            <h3>Item Details</h3>
            <label for="product-name">Name</label>
            <input type="text" id="product-name" name="productName">
            <label for="product-stock">Stock Level</label>
            <input type="text" id="product-stock" name="productStock">
            <label for="product-expiry">Expiry Date</label>
            <input type="text" id="product-expiry" name="productExpiry">
          </div>
          <div class="col-50">
            <h3>Void Info</h3>
            <input type='hidden' id="void-id" name="voidId">
            <label for="void-quantity">Void Quantity</label>
            <input type="text" id="void-quantity" name="voidQuantity">
            <label for="void-reason">Reason for Void</label>
            <input type="text" id="void-reason" name="voidReason">
          </div>
        </div>
        <div class="row" style="margin-top:20px">
          <div class="col-50">
            <button class="btn void-save">Save</button>
          </div>
          <div class="col-50">
            <button onclick="document.getElementById('voids-modal').style.display='none'" class="btn" style="background-color:red">Exit</button>
          </div>
        </div>
      </div>
    </div>`;
  return modal;
}

async function saveVoidDetails(void_modal) {

  const formData = {};

  formData['product_id'] = parseInt(void_modal.querySelector('[name="voidId"]').value);
  formData['void_quantity'] = parseInt(void_modal.querySelector('[name="voidQuantity"]').value);
  formData['void_reason'] = void_modal.querySelector('[name="voidReason"]').value;

  const today = new Date();

  console.log('void data: ', formData);
  
  const queryType = 'INSERT';
  const query = 'INSERT INTO voided_products (product_id, void_date, void_reason, void_quantity) VALUES ($1, $2, $3, $4)';
  const queryData = [formData.product_id, today, formData.void_reason, formData.void_quantity];

  const responseMessage = await window.electronAPI.sendQuery('general-query', queryType, query, queryData);

  const resMes = JSON.parse(responseMessage);

  const updateStockQueryType = 'UPDATE'
  const updateStockQuery = `UPDATE company_stock
                              SET quantity = CASE
                                WHEN quantity - $1 > 0 THEN quantity - $1
                                ELSE quantity
                              END
                              WHERE product_id = $2`

  const updateStockQueryData = [
    formData.void_quantity,
    formData.product_id
  ];
  console.log('update stock: ', updateStockQueryData)

  const updateResMes = await window.electronAPI.sendQuery('general-query', updateStockQueryType, updateStockQuery, updateStockQueryData);

  void_modal.style.display = 'none';
  customerMgtMenu.click();
  inventoryMgtMenu.click();
} 

function formatNumber(number) {
  return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionsDigits: 2 })
}
function reformatNumber(text) {
  const number = text.replace(/,/g, "");
  return parseFloat(number);
}

async function voidsDetails() {
  
  const tableHeader = ['ID', 'Item Description', 'Void Date', 'Void Reason', 'Void Quantity'];
  let commonData = {
    tableId: "voids-table",
    tableHeader: tableHeader,
    tableData: []
  };

  const queryType = 'SELECT';
  const query = `SELECT 
                      v.id,
                      p.name AS product_name,
                      v.void_date,
                      v.void_reason,
                      v.void_quantity
                  FROM 
                      voided_products v
                  JOIN 
                      products p ON v.product_id = p.id
                  ORDER BY 
                      v.void_date DESC`;
                      
  const voidRawData = await window.electronAPI.sendQuery('general-query', queryType, query);

  const voidObjData = JSON.parse(voidRawData);

  const tableVoidData = voidObjData.map(voidItem => [
    voidItem.id,
    voidItem.product_name,
    formatDate(voidItem.void_date),
    voidItem.void_reason,
    voidItem.void_quantity
  ]);

  commonData.tableData = tableVoidData;
  const voidHTMLtable = new CreateTableFromData(commonData);

  voidHTMLtable.renderTable();
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

