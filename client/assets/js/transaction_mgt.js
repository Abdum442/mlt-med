import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";
import { purchaseForm } from './purchaseForm.js';
import { salesForm } from './salesForm.js';

const transactionMgtMenu = document.getElementById('transactionMgt');

// document.getElementById('recent_customers').style.display = 'none';

const salesBtn = document.getElementById('salesBtn');
const purchaseBtn = document.getElementById('purchaseBtn');

const mainContainer = document.getElementById('mainContainer');
const addNewBtn = document.getElementById('add_new');

const pageTitle = document.querySelector('#recent_orders .cardHeader h2');

const salesTableHeader = ['ID', 'Date', 'Item', 'Retailer',
  'Quantity', 'Payment Method', 'Amount Received', 'Remarks'];

const purchaseTableHeader = ['ID', 'Date', 'Item', 'Supplier',
  'Quantity', 'Payment Method', 'Amount Paid', 'Tax Withheld', 'Remarks'];

let commonData = {
  tableId: "mainContainer",
  tableHeader: [],
  tableData: []
};

salesBtn.addEventListener('click', function () {
  const productsObjectData = JSON.parse(localStorage.getItem('products-data'));
  const retailersObjectData = JSON.parse(localStorage.getItem('retailers-data'));



  const salesObjectData = JSON.parse(localStorage.getItem('sales-data'));


  const salesTableData = salesObjectData.map(sales => {
    const iD = sales.id;
    let itemName;
    let retailerName;
    for (const product of productsObjectData) {
      if(sales.product_id == product.id){
        itemName = product.name;
      }
    }

    for (const retailer of retailersObjectData) {
      if (sales.retailer_id == retailer.id) {
        retailerName = retailer.name;
      }
    }
    return [sales.id, formatDate(sales.sale_date), itemName, retailerName, 
            sales.quantity_sold, sales.payment_method, sales.amount_received.toLocaleString(), sales.remarks]
  });

  addNewBtn.style.display = 'block';
  pageTitle.innerHTML = 'Sales Report';

  commonData.tableHeader = salesTableHeader;
  commonData.tableData = salesTableData;

  const salesHTMLtable = new CreateTableFromData(commonData);

  salesHTMLtable.renderTable();

  addNewBtn.addEventListener('click', function (event) {


    addNewBtn.style.display = 'none';
    const productObjData = JSON.parse(localStorage.getItem('products-data'));
    const retailerObjData = JSON.parse(localStorage.getItem('retailers-data'));

    const stockObjData = JSON.parse(localStorage.getItem('stock-data'));

    const stockMap = new Map(stockObjData.map(stock => [stock.product_id, {
      quantity: stock.quantity, purchase_id: stock.purchase_id,
      supplier_id: stock.supplier_id, remarks: stock.remarks
    }]));

    // const productMap = new Map(productObjData.map(pro => [pro.id, pro.name]));



    const retailerNames = retailerObjData.map(obj => ({ name: obj.name, id: obj.id  }));
    const productNames = productObjData.map(obj => {
      if (stockMap.get(parseInt(obj.id)) !== undefined) {
        if (parseInt(stockMap.get(parseInt(obj.id)).quantity) > 0){
          return { name: obj.name, description: obj.description, quantity: stockMap.get(parseInt(obj.id)).quantity, id: obj.id };
        } else {
          return { name: obj.name, description: obj.description, quantity: 'Out of Stock', id: obj.id };
        }
      } else {
        return { name: obj.name, description: obj.description, quantity: 'Out of Stock', id: obj.id };
      }
    });


    const data_lists = {
      product: productNames,
      retailer: retailerNames
    }

    salesForm.showSalesForm(data_lists);

    let unit_price; let quantity; let amount_paid; let productId;

    const salesHTMLForm = document.getElementById('salesForm');

    pageTitle.innerHTML = 'Sales Registration Form';


    function updateAmount() {
      const proGroup = salesHTMLForm.querySelector('#productId_input').value.split(',');
      productId = proGroup[proGroup.length - 1].trim();
      for (const product of productObjData) {
        if (product.id == productId) {
          unit_price = parseFloat(product.saling_price);
        }
      }
      quantity = parseInt(salesHTMLForm.querySelector('#quantity').value);

      if (!isNaN(unit_price) && !isNaN(quantity)) {

        amount_paid = unit_price * quantity;

        // salesHTMLForm.querySelector('#fullAmount').value = (0.98 * amount_paid).toFixed(2);
        salesHTMLForm.querySelector('#taxWithheld').value = (0.02 * amount_paid).toFixed(2);
      } 
    }

    salesHTMLForm.querySelector('#productId_input').addEventListener('change', function() { 
      updateAmount();
      salesHTMLForm.querySelector('#unit').value = unit_price;  
    });

    salesHTMLForm.querySelector('#quantity').addEventListener('change', updateAmount);

    salesHTMLForm.querySelector('#taxWithheld').addEventListener('change', function() {
      const withheld = salesHTMLForm.querySelector('#taxWithheld').value;
      if (!isNaN(withheld)){
        salesHTMLForm.querySelector('#fullAmount').value = amount_paid - parseFloat(withheld);
      }
    });

    salesHTMLForm.querySelector('#salesDate').value = new Date().toISOString().slice(0, 10);

    salesHTMLForm.querySelector('#amountReceived').addEventListener('change', function () {
      const pay_amount = Number(salesHTMLForm.querySelector('#amountReceived').value);
      const full_amount = Number(salesHTMLForm.querySelector('#fullAmount').value)
      const less = (full_amount - pay_amount).toFixed(2);

      salesHTMLForm.querySelector('#remark').value = (less < 5) ? 'Received in full' : `To Receive: ${less.toLocaleString()}`;
    });



    salesHTMLForm.parentNode.querySelector('#save_btn').addEventListener('click', async function (event) {
      event.stopPropagation();

      let retailerId; 

      if (salesHTMLForm.querySelector('#retailerId_input').value == 'None') {

        const retailerValues = {
          retailerName: salesHTMLForm.querySelector('#newRetailer').value,
          contactInfo: '',
          address: '',
          remark: ''
        }
        const retText = await window.electronAPI.fetchData('add-retailers-data', retailerValues);
        retailerId = JSON.parse(retText)[0].id;
      } else {
        const retailerPair = salesHTMLForm.querySelector('#retailerId_input').value.split(',');
        retailerId = retailerPair[retailerPair.length - 1];
      }

      

      const formValues = {
        product_id: productId,
        retailer_id: retailerId,
        quantity_sold: salesHTMLForm.querySelector('#quantity').value,
        sale_date: salesHTMLForm.querySelector('#salesDate').value,
        payment_method: salesHTMLForm.querySelector('#paymentMtd').value,
        amount_received: salesHTMLForm.querySelector('#amountReceived').value,
        tax_withheld: salesHTMLForm.querySelector('#taxWithheld').value,
        remarks: salesHTMLForm.querySelector('#remark').value,
      };

      const salesId = await window.electronAPI.fetchData('add-sales-data', formValues);

      const stockObjData = JSON.parse(localStorage.getItem('stock-data'));

      const stockMap = new Map(stockObjData.map(stock => [stock.product_id, {quantity: stock.quantity, purchase_id: stock.purchase_id, 
                                                                           supplier_id: stock.supplier_id, remarks: stock.remarks }]));
      const id = parseInt(productId); 

      const stockData = {
        id: id,
        product_id: id,
        supplier_id: stockMap.get(id).supplier_id,
        quantity: stockMap.get(id).quantity - formValues.quantity_sold,
        purchase_id: stockMap.get(id).purchase_id,
        remarks: stockMap.get(id).remarks
      }

      const product_id = await window.electronAPI.fetchData('modify-stock-data', stockData);

      mainContainer.innerHTML = '';
      transactionMgtMenu.click();
      setTimeout(() => {
        salesBtn.click();
      }, 1000);
    });
  });
});

purchaseBtn.addEventListener('click', function () {
  const productsObjectData = JSON.parse(localStorage.getItem('products-data'));
  const suppliersObjectData = JSON.parse(localStorage.getItem('suppliers-data'));
  const purchaseObjectData = JSON.parse(localStorage.getItem('purchase-data'));


  const purchaseTableData = purchaseObjectData.map(purchase => {
    const iD = purchase.id;
    let itemName;
    let supplierName;
    for (const product of productsObjectData) {
      if (purchase.product_id == product.id) {
        itemName = product.name;
      }
    }
    for (const supplier of suppliersObjectData) {
      if (purchase.supplier_id == supplier.id) {
        supplierName = supplier.name;
      }
    }
    return [purchase.id, formatDate(purchase.purchase_date), itemName, supplierName,
      purchase.quantity, purchase.payment_method, purchase.amount_paid.toLocaleString(), purchase.tax_withheld.toLocaleString(), purchase.remarks];
  });

  addNewBtn.style.display = 'block';
  pageTitle.innerHTML = 'Purchase Report';

  commonData.tableHeader = purchaseTableHeader;
  commonData.tableData = purchaseTableData;

  const purchaseHTMLtable = new CreateTableFromData(commonData);

  purchaseHTMLtable.renderTable();

  addNewBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    addNewBtn.style.display = 'none';
    pageTitle.innerHTML = 'Purchase Registration Form';
    // const productObjData = JSON.parse(localStorage.getItem('products-data'));
    // const supplierObjData = JSON.parse(localStorage.getItem('suppliers-data'));


    const supplierNames = suppliersObjectData.map(obj => ({ id: obj.id, name: obj.name }));
    const productNames = productsObjectData.map(obj => ({ id: obj.id, name: obj.name }));

    const data_lists = {
      product: productNames,
      supplier: supplierNames
    }

    purchaseForm.showPurchaseForm(data_lists);


    let unit_price; let quantity; let amount_paid;

    const purchaseHTMLForm = document.getElementById('purchaseForm');

    function updateAmount() {

      unit_price = parseFloat(purchaseHTMLForm.querySelector('#unit').value);

      quantity = parseInt(purchaseHTMLForm.querySelector('#quantity').value);


      if (!isNaN(unit_price) && !isNaN(quantity)) {

        amount_paid = unit_price * quantity;

        purchaseHTMLForm.querySelector('#fullAmount').value = (0.98 * amount_paid).toFixed(2);
        purchaseHTMLForm.querySelector('#taxWithheld').value = (0.02 * amount_paid).toFixed(2);
      }
    }

    purchaseHTMLForm.querySelector('#unit').addEventListener('change', updateAmount);
    purchaseHTMLForm.querySelector('#quantity').addEventListener('change', updateAmount);

    purchaseHTMLForm.querySelector('#amountPaid').addEventListener('change', function () {
      const payment_amount = Number(purchaseHTMLForm.querySelector('#amountPaid').value);
      const less = (0.98 * amount_paid - payment_amount).toFixed(2)
      purchaseHTMLForm.querySelector('#remark').value = (less < 5) ? 'Paid in full' : `To be paid: ${less}`; 
    });

    



    purchaseHTMLForm.parentNode.querySelector('#save_btn').addEventListener('click', async function (event) {
      event.stopPropagation();

      let supplierId;

      if (purchaseHTMLForm.querySelector('#supplierId_input').value == 'None') {

        const supplierValues = {
          supplierName: purchaseHTMLForm.querySelector('#newSupplier').value,
          contactInfo: '',
          address: '',
          taxInfo: '',
          LicenceNumber: '',
          remark: ''
        }
        const supText = await window.electronAPI.fetchData('add-suppliers-data', supplierValues);
        supplierId = JSON.parse(supText)[0].id;
      } else {
          const supplierPair = purchaseHTMLForm.querySelector('#supplierId_input').value.split(/\s+/);
          supplierId = supplierPair[supplierPair.length - 1];
       }


      const productValues = {
        name: purchaseHTMLForm.querySelector('#productId').value,
        description: purchaseHTMLForm.querySelector('#description').value,
        supplier_id: supplierId,
        purchase_price: purchaseHTMLForm.querySelector('#unit').value,
        saling_price: NaN,
        expiry_date: purchaseHTMLForm.querySelector('#expiryDate').value,
        remarks: purchaseHTMLForm.querySelector('#remark').value,
      };

      

      const productId = JSON.parse(productText)

      console.log('productId : ', productId);

      const formValues = {
        product_id: productId[0].id,
        supplier_id: supplierId,
        quantity: Number(purchaseHTMLForm.querySelector('#quantity').value),
        purchase_date: purchaseHTMLForm.querySelector('#purchaseDate').value,
        payment_method: purchaseHTMLForm.querySelector('#paymentMtd').value,
        amount_paid: Number(purchaseHTMLForm.querySelector('#amountPaid').value),
        tax_withheld: Number(purchaseHTMLForm.querySelector('#taxWithheld').value),
        remarks: purchaseHTMLForm.querySelector('#remark').value,
      };

      

      const purchaseObj = await window.electronAPI.fetchData('add-purchase-data', formValues);

      const purchaseId = JSON.parse(purchaseObj)[0].id;

      const stockData = {
        product_id: formValues.product_id,
        supplier_id: formValues.supplier_id,
        quantity: formValues.quantity,
        purchase_id: purchaseId,
        remarks: ''
      };

      const productText = await window.electronAPI.fetchData('add-products-data', productValues);

      const stockObj = await window.electronAPI.fetchData('add-stock-data', stockData);


    

      mainContainer.innerHTML = '';

      setTimeout(() => {
        transactionMgtMenu.click();
        purchaseBtn.click();
      }, 1000);
    });
  });
});

function updateSales() {
  addNewBtn.style.display = 'block';
  pageTitle.innerHTML = 'Sales Report';

  const productsObjectData = JSON.parse(localStorage.getItem('products-data'));
  const retailersObjectData = JSON.parse(localStorage.getItem('retailers-data'));
  const salesObjectData = JSON.parse(localStorage.getItem('sales-data'));


  const salesTableData = salesObjectData.map(sales => {
    const iD = sales.id;
    let itemName;
    let retailerName;
    for (const product of productsObjectData) {
      if (sales.product_id == product.id) {
        itemName = product.name;
      }
    }

    for (const retailer of retailersObjectData) {
      if (sales.retailer_id == retailer.id) {
        retailerName = retailer.name;
      }
    }
    return [sales.id, formatDate(sales.sale_date), itemName, retailerName,
    sales.quantity_sold, sales.payment_method, sales.amount_received.toLocaleString(), sales.remarks]
  });
  commonData.tableHeader = salesTableHeader;
  commonData.tableData = salesTableData;

  const salesHTMLtable = new CreateTableFromData(commonData);

  salesHTMLtable.renderTable(); 
}

async function registerSales() {
  addNewBtn.style.display = 'none';

  const productObjData = JSON.parse(localStorage.getItem('products-data'));
  const retailerObjData = JSON.parse(localStorage.getItem('retailers-data'));

  const stockObjData = JSON.parse(localStorage.getItem('stock-data'));

  const stockMap = new Map(stockObjData.map(stock => [stock.product_id, {
    quantity: stock.quantity, purchase_id: stock.purchase_id,
    supplier_id: stock.supplier_id, remarks: stock.remarks
  }]));

  const productMap = new Map(productObjData.map(product => [product.id, {
    quantity: stock.quantity, purchase_id: stock.purchase_id,
    supplier_id: stock.supplier_id, remarks: stock.remarks
  }]));

  // const productMap = new Map(productObjData.map(pro => [pro.id, pro.name]));



  const retailerNames = retailerObjData.map(obj => ({ name: obj.name, id: obj.id }));

  const productNames = productObjData.map(obj => {
    if (stockMap.get(parseInt(obj.id)) !== undefined) {
      if (parseInt(stockMap.get(parseInt(obj.id)).quantity) > 0) {
        return { name: obj.name, description: obj.description, quantity: stockMap.get(parseInt(obj.id)).quantity, id: obj.id };
      } else {
        return { name: obj.name, description: obj.description, quantity: 'Out of Stock', id: obj.id };
      }
    } else {
      return { name: obj.name, description: obj.description, quantity: 'Out of Stock', id: obj.id };
    }
  });


  const data_lists = {
    product: productNames,
    retailer: retailerNames
  }

  salesForm.showSalesForm(data_lists);

  let unit_price; let quantity; let amount_paid; let productId;

  const salesHTMLForm = document.getElementById('salesForm');

  pageTitle.innerHTML = 'Sales Registration Form';


  function updateAmount() {
    const proGroup = salesHTMLForm.querySelector('#productId_input').value.split(',');
    productId = proGroup[proGroup.length - 1].trim();
    for (const product of productObjData) {
      if (product.id == productId) {
        unit_price = parseFloat(product.saling_price);
      }
    }
    quantity = parseInt(salesHTMLForm.querySelector('#quantity').value);

    if (!isNaN(unit_price) && !isNaN(quantity)) {

      amount_paid = unit_price * quantity;

      salesHTMLForm.querySelector('#taxWithheld').value = (0.02 * amount_paid).toFixed(2);
      salesHTMLForm.querySelector('#unit').value = unit_price;
    }
  }

  salesHTMLForm.querySelector('#productId_input').addEventListener('change', updateAmount);

  salesHTMLForm.querySelector('#quantity').addEventListener('change', updateAmount);

  salesHTMLForm.querySelector('#taxWithheld').addEventListener('change', function () {
    const withheld = salesHTMLForm.querySelector('#taxWithheld').value;
    if (!isNaN(withheld)) {
      salesHTMLForm.querySelector('#fullAmount').value = amount_paid - parseFloat(withheld);
    }
  });

  salesHTMLForm.querySelector('#salesDate').value = new Date().toISOString().slice(0, 10);

  salesHTMLForm.querySelector('#amountReceived').addEventListener('change', function () {
    const pay_amount = Number(salesHTMLForm.querySelector('#amountReceived').value);
    const full_amount = Number(salesHTMLForm.querySelector('#fullAmount').value)
    const less = (full_amount - pay_amount).toFixed(2);

    salesHTMLForm.querySelector('#remark').value = (less < 5) ? 'Received in full' : `To Receive: ${less.toLocaleString()}`;
  });

  const saveBtn = salesHTMLForm.parentNode.querySelector('#save_btn');

  saveBtn.addEventListener('click', async function (event) {
    event.stopPropagation();

    let retailerId; let retailerName;

    if (salesHTMLForm.querySelector('#retailerId_input').value == 'None') {
      newRetailer = salesHTMLForm.querySelector('#newRetailer').value;
      const retailerValues = {
        retailerName: newRetailer,
        contactInfo: '',
        address: '',
        remark: ''
      }
      const retText = await window.electronAPI.fetchData('add-retailers-data', retailerValues);
      retailerId = JSON.parse(retText)[0].id;
    } else {
      const retailerPair = salesHTMLForm.querySelector('#retailerId_input').value.split(',');
      retailerId = retailerPair[retailerPair.length - 1];
    }



    const formValues = {
      product_id: productId,
      retailer_id: retailerId,
      quantity_sold: salesHTMLForm.querySelector('#quantity').value,
      sale_date: salesHTMLForm.querySelector('#salesDate').value,
      payment_method: salesHTMLForm.querySelector('#paymentMtd').value,
      amount_received: salesHTMLForm.querySelector('#amountReceived').value,
      tax_withheld: salesHTMLForm.querySelector('#taxWithheld').value,
      remarks: salesHTMLForm.querySelector('#remark').value,
    };

    const salesId = await window.electronAPI.fetchData('add-sales-data', formValues);

    const stockObjData = JSON.parse(localStorage.getItem('stock-data'));

    const stockMap = new Map(stockObjData.map(stock => [stock.product_id, {
      quantity: stock.quantity, purchase_id: stock.purchase_id,
      supplier_id: stock.supplier_id, remarks: stock.remarks
    }]));
    const id = parseInt(productId);

    const stockData = {
      id: id,
      product_id: id,
      supplier_id: stockMap.get(id).supplier_id,
      quantity: parseInt(stockMap.get(id).quantity) - parseInt(formValues.quantity_sold),
      purchase_id: parseInt(stockMap.get(id).purchase_id),
      remarks: stockMap.get(id).remarks
    }

    const product_id = await window.electronAPI.fetchData('modify-stock-data', stockData);

    mainContainer.innerHTML = '';
    transactionMgtMenu.click();
    setTimeout(() => {
      salesBtn.click();
    }, 1000);
  });
}

//========================utility functions====================
function formatDate(dateString) {
  // Parse the date string using Date.parse() for better compatibility
  const dateObject = new Date(dateString);

  // Define default formatting options
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