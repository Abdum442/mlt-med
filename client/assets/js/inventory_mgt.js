import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const inventoryMgtMenu = document.getElementById('inventoryMgt');
const customerMgtMenu = document.getElementById('customerMgt');

let rowData = {}; 

inventoryMgtMenu.addEventListener('click', function () {
  const inventoryContent = document.body.querySelector('.details .recentOrders');
  inventoryContent.innerHTML = '';

  const tabContainer = inventoryContainer();
  const productModal = createProductModal();

  const productContent = tabContainer.querySelector('#product-content');
  const stockContent = tabContainer.querySelector('#stock-content');
  const expiryContent = tabContainer.querySelector('#expiry-content');

  inventoryContent.appendChild(tabContainer);
  inventoryContent.appendChild(productModal);

  manageTabEvents(tabContainer);

  productDetails(productContent, productModal);
  stockDetails(stockContent);
  expiryDateDetails(expiryContent);
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
  const productTab = tab_cont.querySelector('#product');
  const stockTab = tab_cont.querySelector('#stock');
  const expiryTab = tab_cont.querySelector('#expiry');

  productTab.addEventListener('click', function () {
    manageTabs('product', 'product-content')
  });
  stockTab.addEventListener('click', function () {
    manageTabs('stock', 'stock-content')
  });
  expiryTab.addEventListener('click', function () {
    manageTabs('expiry', 'expiry-content')
  });

  productTab.click();
}

function inventoryContainer() {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.id = "inventory-container"

  tabContainer.innerHTML = `<div class="tab">
              <button class="tab-link" id="product">Products</button>
              <button class="tab-link" id="stock">Stock Level</button>
              <button class="tab-link" id="expiry"> Expiry Date Tracker</button>
            </div>
            <div class="tab-content" id="product-content">
              <h2>Product</h2>
            </div>
            <div class="tab-content" id="stock-content">
              <h2>Stock Level</h2>
            </div>
            <div class="tab-content" id="expiry-content">
              <h2>Expiry Date Tracker</h2>
            </div>`;
  return tabContainer;
}

function productDetails(product_tab, product_modal) {
  product_tab.innerHTML = '';
  const productsTableHeader = ['ID', 'Name', 'Description/Unit', 'Selling Price',
    'Expiry Date', 'Remarks'];

  let commonData = {
    tableId: "product-content",
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
      // deleteBtn.addEventListener('click', async function (event) {
      //   event.stopPropagation();

      //   const dataID = { id: rowData.id };
      //   const id = await window.electronAPI.fetchData('delete-suppliers-data', dataID);
      //   alert(`Supplier with id: ${id} is deleted`);
      //   viewTab.click();
      //   setTimeout(() => {
      //     customerMgt.click();
      //     viewSupplierBtn.click();
      //   }, 1000);
      // });

      // dropContent.classList.remove('show');
    });
  });

}

function stockDetails(stock_tab) {
  stock_tab.innerHTML = '';
  const stockTableHeader = ['Item Name', 'Quantity', 'Purchase ID', 'Supplier', 'Remarks'];

  let commonData = {
    tableId: "stock-content",
    tableHeader: stockTableHeader,
    tableData: []
  };

  const stockObjData = JSON.parse(localStorage.getItem('stock-data'));
  const productObjData = JSON.parse(localStorage.getItem('products-data'));

  const productMap = new Map(productObjData.map(prod => [parseInt(prod.id), prod.name]));

  const stockTableData = stockObjData.map(obj => {
    const prodName = productMap.get(parseInt(obj.product_id));
    return [prodName, obj.quantity, obj.purchase_id, obj.supplier_id, obj.remarks];
  });


  commonData.tableHeader = stockTableHeader;
  commonData.tableData = stockTableData;

  const stockHTMLtable = new CreateTableFromData(commonData);

  stockHTMLtable.renderTable();
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

function createProductModal() {
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

