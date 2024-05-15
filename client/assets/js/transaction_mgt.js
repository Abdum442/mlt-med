import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";

const transactionMgtMenu = document.getElementById('transactionMgt');
const salesMainBtn = document.getElementById('salesBtn');

let rowData = {};

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
  orderDetails(orderTableContainer, salesModal);


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

function orderDetails(order_tab, sales_modal) {
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



















// import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";
// import { purchaseForm } from './purchaseForm.js';
// import { salesForm } from './salesForm.js';



// const transactionMgtMenu = document.getElementById('transactionMgt');

// // document.getElementById('recent_customers').style.display = 'none';

// const salesBtn = document.getElementById('salesBtn');
// const purchaseBtn = document.getElementById('purchaseBtn');

// const mainContainer = document.getElementById('mainContainer');
// const addNewBtn = document.getElementById('add_new');

// const pageTitle = document.querySelector('#recent_orders .cardHeader h2');

// const salesTableHeader = ['ID', 'Date', 'Item', 'Retailer',
//   'Quantity', 'Payment Method', 'Amount Received', 'Remarks'];

// const purchaseTableHeader = ['ID', 'Date', 'Item', 'Supplier',
//   'Quantity', 'Payment Method', 'Amount Paid', 'Tax Withheld', 'Remarks'];

// let commonData = {
//   tableId: "mainContainer",
//   tableHeader: [],
//   tableData: []
// };

// salesBtn.addEventListener('click', function () {

//   // ================ addition =============
//   const fileObject = {file: './admin/sales_page.html'};
//   window.electronAPI.fetchData('open-sales-window', fileObject);
//   // =======================================
//   const productsObjectData = JSON.parse(localStorage.getItem('products-data'));
//   const retailersObjectData = JSON.parse(localStorage.getItem('retailers-data'));



//   const salesObjectData = JSON.parse(localStorage.getItem('sales-data'));


//   const salesTableData = salesObjectData.map(sales => {
//     const iD = sales.id;
//     let itemName;
//     let retailerName;
//     for (const product of productsObjectData) {
//       if(sales.product_id == product.id){
//         itemName = product.name;
//       }
//     }

//     for (const retailer of retailersObjectData) {
//       if (sales.retailer_id == retailer.id) {
//         retailerName = retailer.name;
//       }
//     }
//     return [sales.id, formatDate(sales.sale_date), itemName, retailerName, 
//             sales.quantity_sold, sales.payment_method, sales.amount_received.toLocaleString(), sales.remarks]
//   });

//   addNewBtn.style.display = 'block';
//   pageTitle.innerHTML = 'Sales Report';

//   commonData.tableHeader = salesTableHeader;
//   commonData.tableData = salesTableData;

//   const salesHTMLtable = new CreateTableFromData(commonData);

//   salesHTMLtable.renderTable();

//   addNewBtn.addEventListener('click', function (event) {


//     addNewBtn.style.display = 'none';
//     const productObjData = JSON.parse(localStorage.getItem('products-data'));
//     const retailerObjData = JSON.parse(localStorage.getItem('retailers-data'));

//     const stockObjData = JSON.parse(localStorage.getItem('stock-data'));

//     const stockMap = new Map(stockObjData.map(stock => [stock.product_id, {
//       quantity: stock.quantity, purchase_id: stock.purchase_id,
//       supplier_id: stock.supplier_id, remarks: stock.remarks
//     }]));

//     // const productMap = new Map(productObjData.map(pro => [pro.id, pro.name]));

//     const retailerNames = retailerObjData.map(obj => ({ name: obj.name, id: obj.id  }));
//     const productNames = productObjData.map(obj => {
//       if (stockMap.get(parseInt(obj.id)) !== undefined) {
//         if (parseInt(stockMap.get(parseInt(obj.id)).quantity) > 0){
//           return { name: obj.name, description: obj.description, quantity: stockMap.get(parseInt(obj.id)).quantity, id: obj.id };
//         } else {
//           return { name: obj.name, description: obj.description, quantity: 'Out of Stock', id: obj.id };
//         }
//       } else {
//         return { name: obj.name, description: obj.description, quantity: 'Out of Stock', id: obj.id };
//       }
//     });


//     const data_lists = {
//       product: productNames,
//       retailer: retailerNames
//     }

//     salesForm.showSalesForm(data_lists);

//     let unit_price; let quantity; let amount_paid; let productId;

//     const salesHTMLForm = document.getElementById('salesForm');

//     pageTitle.innerHTML = 'Sales Registration Form';


//     function updateAmount() {
//       const proGroup = salesHTMLForm.querySelector('#productId_input').value.split(',');
//       productId = proGroup[proGroup.length - 1].trim();
//       for (const product of productObjData) {
//         if (product.id == productId) {
//           unit_price = parseFloat(product.saling_price);
//         }
//       }
//       quantity = parseInt(salesHTMLForm.querySelector('#quantity').value);

//       if (!isNaN(unit_price) && !isNaN(quantity)) {

//         amount_paid = unit_price * quantity;

//         // salesHTMLForm.querySelector('#fullAmount').value = (0.98 * amount_paid).toFixed(2);
//         salesHTMLForm.querySelector('#taxWithheld').value = (0.02 * amount_paid).toFixed(2);
//       } 
//     }

//     salesHTMLForm.querySelector('#productId_input').addEventListener('change', function() { 
//       updateAmount();
//       salesHTMLForm.querySelector('#unit').value = unit_price;  
//     });

//     salesHTMLForm.querySelector('#quantity').addEventListener('change', updateAmount);

//     salesHTMLForm.querySelector('#taxWithheld').addEventListener('change', function() {
//       const withheld = salesHTMLForm.querySelector('#taxWithheld').value;
//       if (!isNaN(withheld)){
//         salesHTMLForm.querySelector('#fullAmount').value = amount_paid - parseFloat(withheld);
//       }
//     });

//     salesHTMLForm.querySelector('#salesDate').value = new Date().toISOString().slice(0, 10);

//     salesHTMLForm.querySelector('#amountReceived').addEventListener('change', function () {
//       const pay_amount = Number(salesHTMLForm.querySelector('#amountReceived').value);
//       const full_amount = Number(salesHTMLForm.querySelector('#fullAmount').value)
//       const less = (full_amount - pay_amount).toFixed(2);

//       salesHTMLForm.querySelector('#remark').value = (less < 5) ? 'Received in full' : `To Receive: ${less.toLocaleString()}`;
//     });



//     salesHTMLForm.parentNode.querySelector('#save_btn').addEventListener('click', async function (event) {
//       event.stopPropagation();

//       let retailerId; 

//       if (salesHTMLForm.querySelector('#retailerId_input').value == 'None') {

//         const retailerValues = {
//           retailerName: salesHTMLForm.querySelector('#newRetailer').value,
//           contactInfo: '',
//           address: '',
//           remark: ''
//         }
//         const retText = await window.electronAPI.fetchData('add-retailers-data', retailerValues);
//         retailerId = JSON.parse(retText)[0].id;
//       } else {
//         const retailerPair = salesHTMLForm.querySelector('#retailerId_input').value.split(',');
//         retailerId = retailerPair[retailerPair.length - 1];
//       }

      

//       const formValues = {
//         product_id: productId,
//         retailer_id: retailerId,
//         quantity_sold: salesHTMLForm.querySelector('#quantity').value,
//         sale_date: salesHTMLForm.querySelector('#salesDate').value,
//         payment_method: salesHTMLForm.querySelector('#paymentMtd').value,
//         amount_received: salesHTMLForm.querySelector('#amountReceived').value,
//         tax_withheld: salesHTMLForm.querySelector('#taxWithheld').value,
//         remarks: salesHTMLForm.querySelector('#remark').value,
//       };

//       const salesId = await window.electronAPI.fetchData('add-sales-data', formValues);

//       const stockObjData = JSON.parse(localStorage.getItem('stock-data'));

//       const stockMap = new Map(stockObjData.map(stock => [stock.product_id, {quantity: stock.quantity, purchase_id: stock.purchase_id, 
//                                                                            supplier_id: stock.supplier_id, remarks: stock.remarks }]));
//       const id = parseInt(productId); 

//       const stockData = {
//         id: id,
//         product_id: id,
//         supplier_id: stockMap.get(id).supplier_id,
//         quantity: stockMap.get(id).quantity - formValues.quantity_sold,
//         purchase_id: stockMap.get(id).purchase_id,
//         remarks: stockMap.get(id).remarks
//       }

//       const product_id = await window.electronAPI.fetchData('modify-stock-data', stockData);

//       mainContainer.innerHTML = '';
//       transactionMgtMenu.click();
//       setTimeout(() => {
//         salesBtn.click();
//       }, 1000);
//     });
//   });
// });

// purchaseBtn.addEventListener('click', function () {
//   const productsObjectData = JSON.parse(localStorage.getItem('products-data'));
//   const suppliersObjectData = JSON.parse(localStorage.getItem('suppliers-data'));
//   const purchaseObjectData = JSON.parse(localStorage.getItem('purchase-data'));


//   const purchaseTableData = purchaseObjectData.map(purchase => {
//     const iD = purchase.id;
//     let itemName;
//     let supplierName;
//     for (const product of productsObjectData) {
//       if (purchase.product_id == product.id) {
//         itemName = product.name;
//       }
//     }
//     for (const supplier of suppliersObjectData) {
//       if (purchase.supplier_id == supplier.id) {
//         supplierName = supplier.name;
//       }
//     }
//     return [purchase.id, formatDate(purchase.purchase_date), itemName, supplierName,
//       purchase.quantity, purchase.payment_method, purchase.amount_paid.toLocaleString(), purchase.tax_withheld.toLocaleString(), purchase.remarks];
//   });

//   addNewBtn.style.display = 'block';
//   pageTitle.innerHTML = 'Purchase Report';

//   commonData.tableHeader = purchaseTableHeader;
//   commonData.tableData = purchaseTableData;

//   const purchaseHTMLtable = new CreateTableFromData(commonData);

//   purchaseHTMLtable.renderTable();

//   addNewBtn.addEventListener('click', function (event) {
//     event.stopPropagation();
//     addNewBtn.style.display = 'none';
//     pageTitle.innerHTML = 'Purchase Registration Form';
//     // const productObjData = JSON.parse(localStorage.getItem('products-data'));
//     // const supplierObjData = JSON.parse(localStorage.getItem('suppliers-data'));


//     const supplierNames = suppliersObjectData.map(obj => ({ id: obj.id, name: obj.name }));
//     const productNames = productsObjectData.map(obj => ({ id: obj.id, name: obj.name }));

//     const data_lists = {
//       product: productNames,
//       supplier: supplierNames
//     }

//     purchaseForm.showPurchaseForm(data_lists);


//     let unit_price; let quantity; let amount_paid;

//     const purchaseHTMLForm = document.getElementById('purchaseForm');

//     function updateAmount() {

//       unit_price = parseFloat(purchaseHTMLForm.querySelector('#unit').value);

//       quantity = parseInt(purchaseHTMLForm.querySelector('#quantity').value);


//       if (!isNaN(unit_price) && !isNaN(quantity)) {

//         amount_paid = unit_price * quantity;

//         purchaseHTMLForm.querySelector('#fullAmount').value = (0.98 * amount_paid).toFixed(2);
//         purchaseHTMLForm.querySelector('#taxWithheld').value = (0.02 * amount_paid).toFixed(2);
//       }
//     }

//     purchaseHTMLForm.querySelector('#unit').addEventListener('change', updateAmount);
//     purchaseHTMLForm.querySelector('#quantity').addEventListener('change', updateAmount);

//     purchaseHTMLForm.querySelector('#amountPaid').addEventListener('change', function () {
//       const payment_amount = Number(purchaseHTMLForm.querySelector('#amountPaid').value);
//       const less = (0.98 * amount_paid - payment_amount).toFixed(2)
//       purchaseHTMLForm.querySelector('#remark').value = (less < 5) ? 'Paid in full' : `To be paid: ${less}`; 
//     });

    



//     purchaseHTMLForm.parentNode.querySelector('#save_btn').addEventListener('click', async function (event) {
//       event.stopPropagation();

//       let supplierId;

//       if (purchaseHTMLForm.querySelector('#supplierId_input').value == 'None') {

//         const supplierValues = {
//           supplierName: purchaseHTMLForm.querySelector('#newSupplier').value,
//           contactInfo: '',
//           address: '',
//           taxInfo: '',
//           LicenceNumber: '',
//           remark: ''
//         }
//         const supText = await window.electronAPI.fetchData('add-suppliers-data', supplierValues);
//         supplierId = JSON.parse(supText)[0].id;
//       } else {
//           const supplierPair = purchaseHTMLForm.querySelector('#supplierId_input').value.split(/\s+/);
//           supplierId = supplierPair[supplierPair.length - 1];
//        }


//       const productValues = {
//         name: purchaseHTMLForm.querySelector('#productId').value,
//         description: purchaseHTMLForm.querySelector('#description').value,
//         supplier_id: supplierId,
//         purchase_price: purchaseHTMLForm.querySelector('#unit').value,
//         saling_price: NaN,
//         expiry_date: purchaseHTMLForm.querySelector('#expiryDate').value,
//         remarks: purchaseHTMLForm.querySelector('#remark').value,
//       };

//       const productText = await window.electronAPI.fetchData('add-products-data', productValues);


//       const productId = JSON.parse(productText)

//       console.log('productId : ', productId);

//       const formValues = {
//         product_id: productId[0].id,
//         supplier_id: supplierId,
//         quantity: Number(purchaseHTMLForm.querySelector('#quantity').value),
//         purchase_date: purchaseHTMLForm.querySelector('#purchaseDate').value,
//         payment_method: purchaseHTMLForm.querySelector('#paymentMtd').value,
//         amount_paid: Number(purchaseHTMLForm.querySelector('#amountPaid').value),
//         tax_withheld: Number(purchaseHTMLForm.querySelector('#taxWithheld').value),
//         remarks: purchaseHTMLForm.querySelector('#remark').value,
//       };

      

//       const purchaseObj = await window.electronAPI.fetchData('add-purchase-data', formValues);

//       const purchaseId = JSON.parse(purchaseObj)[0].id;

//       const stockData = {
//         product_id: formValues.product_id,
//         supplier_id: formValues.supplier_id,
//         quantity: formValues.quantity,
//         purchase_id: purchaseId,
//         remarks: ''
//       };

//       // const productText = await window.electronAPI.fetchData('add-products-data', productValues);

//       const stockObj = await window.electronAPI.fetchData('add-stock-data', stockData);


    

//       mainContainer.innerHTML = '';

//       setTimeout(() => {
//         transactionMgtMenu.click();
//         purchaseBtn.click();
//       }, 1000);
//     });
//   });
// });

// function updateSales() {
//   addNewBtn.style.display = 'block';
//   pageTitle.innerHTML = 'Sales Report';

//   const productsObjectData = JSON.parse(localStorage.getItem('products-data'));
//   const retailersObjectData = JSON.parse(localStorage.getItem('retailers-data'));
//   const salesObjectData = JSON.parse(localStorage.getItem('sales-data'));


//   const salesTableData = salesObjectData.map(sales => {
//     const iD = sales.id;
//     let itemName;
//     let retailerName;
//     for (const product of productsObjectData) {
//       if (sales.product_id == product.id) {
//         itemName = product.name;
//       }
//     }

//     for (const retailer of retailersObjectData) {
//       if (sales.retailer_id == retailer.id) {
//         retailerName = retailer.name;
//       }
//     }
//     return [sales.id, formatDate(sales.sale_date), itemName, retailerName,
//     sales.quantity_sold, sales.payment_method, sales.amount_received.toLocaleString(), sales.remarks]
//   });
//   commonData.tableHeader = salesTableHeader;
//   commonData.tableData = salesTableData;

//   const salesHTMLtable = new CreateTableFromData(commonData);

//   salesHTMLtable.renderTable(); 
// }

// async function registerSales() {
//   addNewBtn.style.display = 'none';

//   const productObjData = JSON.parse(localStorage.getItem('products-data'));
//   const retailerObjData = JSON.parse(localStorage.getItem('retailers-data'));

//   const stockObjData = JSON.parse(localStorage.getItem('stock-data'));

//   const stockMap = new Map(stockObjData.map(stock => [stock.product_id, {
//     quantity: stock.quantity, purchase_id: stock.purchase_id,
//     supplier_id: stock.supplier_id, remarks: stock.remarks
//   }]));

//   const productMap = new Map(productObjData.map(product => [product.id, {
//     quantity: stock.quantity, purchase_id: stock.purchase_id,
//     supplier_id: stock.supplier_id, remarks: stock.remarks
//   }]));

//   // const productMap = new Map(productObjData.map(pro => [pro.id, pro.name]));



//   const retailerNames = retailerObjData.map(obj => ({ name: obj.name, id: obj.id }));

//   const productNames = productObjData.map(obj => {
//     if (stockMap.get(parseInt(obj.id)) !== undefined) {
//       if (parseInt(stockMap.get(parseInt(obj.id)).quantity) > 0) {
//         return { name: obj.name, description: obj.description, quantity: stockMap.get(parseInt(obj.id)).quantity, id: obj.id };
//       } else {
//         return { name: obj.name, description: obj.description, quantity: 'Out of Stock', id: obj.id };
//       }
//     } else {
//       return { name: obj.name, description: obj.description, quantity: 'Out of Stock', id: obj.id };
//     }
//   });


//   const data_lists = {
//     product: productNames,
//     retailer: retailerNames
//   }

//   salesForm.showSalesForm(data_lists);

//   let unit_price; let quantity; let amount_paid; let productId;

//   const salesHTMLForm = document.getElementById('salesForm');

//   pageTitle.innerHTML = 'Sales Registration Form';


//   function updateAmount() {
//     const proGroup = salesHTMLForm.querySelector('#productId_input').value.split(',');
//     productId = proGroup[proGroup.length - 1].trim();
//     for (const product of productObjData) {
//       if (product.id == productId) {
//         unit_price = parseFloat(product.saling_price);
//       }
//     }
//     quantity = parseInt(salesHTMLForm.querySelector('#quantity').value);

//     if (!isNaN(unit_price) && !isNaN(quantity)) {

//       amount_paid = unit_price * quantity;

//       salesHTMLForm.querySelector('#taxWithheld').value = (0.02 * amount_paid).toFixed(2);
//       salesHTMLForm.querySelector('#unit').value = unit_price;
//     }
//   }

//   salesHTMLForm.querySelector('#productId_input').addEventListener('change', updateAmount);

//   salesHTMLForm.querySelector('#quantity').addEventListener('change', updateAmount);

//   salesHTMLForm.querySelector('#taxWithheld').addEventListener('change', function () {
//     const withheld = salesHTMLForm.querySelector('#taxWithheld').value;
//     if (!isNaN(withheld)) {
//       salesHTMLForm.querySelector('#fullAmount').value = amount_paid - parseFloat(withheld);
//     }
//   });

//   salesHTMLForm.querySelector('#salesDate').value = new Date().toISOString().slice(0, 10);

//   salesHTMLForm.querySelector('#amountReceived').addEventListener('change', function () {
//     const pay_amount = Number(salesHTMLForm.querySelector('#amountReceived').value);
//     const full_amount = Number(salesHTMLForm.querySelector('#fullAmount').value)
//     const less = (full_amount - pay_amount).toFixed(2);

//     salesHTMLForm.querySelector('#remark').value = (less < 5) ? 'Received in full' : `To Receive: ${less.toLocaleString()}`;
//   });

//   const saveBtn = salesHTMLForm.parentNode.querySelector('#save_btn');

//   saveBtn.addEventListener('click', async function (event) {
//     event.stopPropagation();

//     let retailerId; let retailerName;

//     if (salesHTMLForm.querySelector('#retailerId_input').value == 'None') {
//       newRetailer = salesHTMLForm.querySelector('#newRetailer').value;
//       const retailerValues = {
//         retailerName: newRetailer,
//         contactInfo: '',
//         address: '',
//         remark: ''
//       }
//       const retText = await window.electronAPI.fetchData('add-retailers-data', retailerValues);
//       retailerId = JSON.parse(retText)[0].id;
//     } else {
//       const retailerPair = salesHTMLForm.querySelector('#retailerId_input').value.split(',');
//       retailerId = retailerPair[retailerPair.length - 1];
//     }



//     const formValues = {
//       product_id: productId,
//       retailer_id: retailerId,
//       quantity_sold: salesHTMLForm.querySelector('#quantity').value,
//       sale_date: salesHTMLForm.querySelector('#salesDate').value,
//       payment_method: salesHTMLForm.querySelector('#paymentMtd').value,
//       amount_received: salesHTMLForm.querySelector('#amountReceived').value,
//       tax_withheld: salesHTMLForm.querySelector('#taxWithheld').value,
//       remarks: salesHTMLForm.querySelector('#remark').value,
//     };

//     const salesId = await window.electronAPI.fetchData('add-sales-data', formValues);

//     const stockObjData = JSON.parse(localStorage.getItem('stock-data'));

//     const stockMap = new Map(stockObjData.map(stock => [stock.product_id, {
//       quantity: stock.quantity, purchase_id: stock.purchase_id,
//       supplier_id: stock.supplier_id, remarks: stock.remarks
//     }]));
//     const id = parseInt(productId);

//     const stockData = {
//       id: id,
//       product_id: id,
//       supplier_id: stockMap.get(id).supplier_id,
//       quantity: parseInt(stockMap.get(id).quantity) - parseInt(formValues.quantity_sold),
//       purchase_id: parseInt(stockMap.get(id).purchase_id),
//       remarks: stockMap.get(id).remarks
//     }

//     const product_id = await window.electronAPI.fetchData('modify-stock-data', stockData);

//     mainContainer.innerHTML = '';
//     transactionMgtMenu.click();
//     setTimeout(() => {
//       salesBtn.click();
//     }, 1000);
//   });
// }

// //========================utility functions====================
// function formatDate(dateString) {
//   // Parse the date string using Date.parse() for better compatibility
//   const dateObject = new Date(dateString);

//   // Define default formatting options
//   const options = {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour12: false
//   };

//   const formatter = new Intl.DateTimeFormat(navigator.language, options);
//   const formattedDate = formatter.format(dateObject);

//   return formattedDate;
// }