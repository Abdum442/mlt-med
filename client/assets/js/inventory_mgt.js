import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";
import { productForm } from './productForm.js';

const inventoryMgtMenu = document.getElementById('inventoryMgt');

const productBtn = document.getElementById('productBtn');
const stockMgtBtn = document.getElementById('stockBtn');
const ExpiryDateBtn = document.getElementById('expiryDateBtn');

const mainContainer = document.getElementById('mainContainer');
const addNewBtn = document.getElementById('add_new');

const pageTitle = document.querySelector('#recent_orders .cardHeader h2');

const productsTableHeader = ['ID', 'Name', 'Description', 'Selling Price',
  'Expiry Date', 'Remarks'];

let commonData = {
  tableId: "mainContainer",
  tableHeader: [],
  tableData: []
};

productBtn.addEventListener('click', function () {
  const productsRawData = localStorage.getItem('products-data');

  const productsObjData = JSON.parse(productsRawData);

  const productsTableData = productsObjData.map(obj => [obj.id, obj.name, obj.description, obj.saling_price,
    formatDate(obj.expiry_date), obj.remarks]);
  addNewBtn.style.display = 'block';
  pageTitle.innerHTML = 'Product List';

  commonData.tableHeader = productsTableHeader;
  commonData.tableData = productsTableData;

  const productsHTMLtable = new CreateTableFromData(commonData);

  productsHTMLtable.renderTable();

  clickable_dropdown_btn(mainContainer.querySelector('table'));

  addNewBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    addNewBtn.style.display = 'none';

    const suppliersRawData = localStorage.getItem('suppliers-data');

    const supplierObjData = JSON.parse(suppliersRawData);

    const supplierNames = supplierObjData.map(obj => ({id: obj.id, name: obj.name}));

    productForm.showProductForm(supplierNames);

    const productHTMLForm = document.getElementById('productForm');

    productHTMLForm.parentNode.querySelector('#modify_btn').style.display = 'none'

    pageTitle.innerHTML = 'Product Registration Form';

    productHTMLForm.parentNode.querySelector('#save_btn').addEventListener('click', async function (event) {
      event.stopPropagation();

      const supplierPair = productHTMLForm.querySelector('#supplierId_input').value.split(/\s+/);
      const supplierId = supplierPair[supplierPair.length - 1];

      const formValues = {
        name: productHTMLForm.querySelector('#productName').value,
        description: productHTMLForm.querySelector('#description').value,
        supplier_id: supplierId,
        purchase_price: productHTMLForm.querySelector('#purchasePrice').value,
        saling_price: productHTMLForm.querySelector('#SellingPrice').value,
        expiry_date: productHTMLForm.querySelector('#expiryDate').value,
        remarks: productHTMLForm.querySelector('#remark').value,
      };

      const rowRawData = await window.electronAPI.fetchData('add-products-data', formValues);

      // const res = JSON.parse(rowRawData);
      // rowList[0] = res[0].id;
      // supplierTableData.push(rowList);

      mainContainer.innerHTML = '';

      setTimeout(() => {
        inventoryMgtMenu.click();
        productBtn.click();
      }, 1000);
    });
  });

  mainContainer.querySelectorAll('table tbody tr').forEach(function (tr) {

    const rowData = {};

    for (const product of productsObjData) {
      const expDate = new Date(product.expiry_date);
      // console.log('date : ', expDate.toISOString().slice(0, 10));
      if (product.id == tr.cells[0].textContent) {
        rowData['id'] = product.id;
        rowData['name'] = product.name;
        rowData['description'] = product.description;
        rowData['purchase_price'] = product.purchase_price;
        rowData['saling_price'] = product.saling_price;
        rowData['expiry_date'] = expDate.toISOString().slice(0, 10);
        rowData['remarks'] = product.remarks;
        rowData['supplier_id'] = product.supplier_id;
      }
    }

    

    tr.querySelector(".drop-btn").addEventListener('click', function (event) {
      event.stopPropagation();

      const dropContent = tr.querySelector("td .drop-btn").nextElementSibling;

      dropContent.classList.add('show');



      const modifyBtn = tr.querySelector("td .modify");
      // console.log("modify btn: ", modifyBtn);

      const deleteBtn = dropContent.querySelector('.delete');

      modifyBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        mainContainer.style.display = 'none';

        console.log('rowData: ', rowData);

        addNewBtn.click();

        const productHTMLForm = mainContainer.querySelector('#productForm');
        // console.log(supplierForm)


        productHTMLForm.querySelector('[name="productName"]').value = rowData.name;
        productHTMLForm.querySelector('[name="description"]').value = rowData.description;
        productHTMLForm.querySelector('[name="purchasePrice"]').value = rowData.purchase_price;
        productHTMLForm.querySelector('[name="SellingPrice"]').value = rowData.saling_price;
        productHTMLForm.querySelector('#expiryDate').value = rowData.expiry_date;
        productHTMLForm.querySelector('[name="remark"]').value = rowData.remarks;
        productHTMLForm.querySelector('#supplierId_input').value = rowData.supplier_id;




        productHTMLForm.parentNode.querySelector('#save_btn').style.display = 'none';

        productHTMLForm.parentNode.querySelector('#modify_btn').style.display = 'block';

        mainContainer.style.display = 'block';

        productHTMLForm.parentNode.querySelector('#modify_btn').addEventListener('click', async function () {

        const supplierPair = productHTMLForm.querySelector('#supplierId_input').value.split(/\s+/);
        const supplierId = supplierPair[supplierPair.length - 1];

        const formValues = {
          id: rowData.id,
          name: productHTMLForm.querySelector('#productName').value,
          description: productHTMLForm.querySelector('#description').value,
          supplier_id: supplierId,
          purchase_price: productHTMLForm.querySelector('#purchasePrice').value,
          saling_price: productHTMLForm.querySelector('#SellingPrice').value,
          expiry_date: productHTMLForm.querySelector('#expiryDate').value,
          remarks: productHTMLForm.querySelector('#remark').value,
        };

        

          const id = await window.electronAPI.fetchData('modify-products-data', formValues);

          mainContainer.innerHTML = '';
          setTimeout(() => {
            inventoryMgtMenu.click();
            productBtn.click();
          }, 1000);
        });
      });

      deleteBtn.addEventListener('click', async function (event) {
        event.stopPropagation();

        const id = window.electronAPI.fetchData('delete-products-data', rowData);

        mainContainer.innerHTML = '';
        setTimeout(() => {
          inventoryMgtMenu.click()
          productBtn.click();
        }, 1000);
      });
    });
  });
});
const stockTableHeader = ['Item Name', 'Quantity', 'Purchase ID', 'Supplier', 'Remarks'];

stockMgtBtn.addEventListener('click', function () {
  pageTitle.innerHTML = 'Company Stock';
  mainContainer.innerHTML = '';

  const stockObjData = JSON.parse(localStorage.getItem('stock-data'));
  const productObjData = JSON.parse(localStorage.getItem('products-data'));

  const productMap = new Map(productObjData.map(prod => [prod.id, prod.name]));

  const stockTableData = stockObjData.map(obj => {
    const prodName = productMap.get(obj.product_id);
    return [prodName, obj.quantity, obj.purchase_id, obj.supplier_id, obj.remarks];
  });

  addNewBtn.style.display = 'block';

  commonData.tableHeader = stockTableHeader;
  commonData.tableData = stockTableData;

  const stockHTMLtable = new CreateTableFromData(commonData);

  stockHTMLtable.renderTable();


});

ExpiryDateBtn.addEventListener('click', trackExpiryDate);


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

function trackExpiryDate() {
  pageTitle.innerHTML = 'Tracking Expiry Date';
  const expiryDateTableHeader = ['ID', 'Item', 'Expiry Date', 'Status'];
  const productObjData = JSON.parse(localStorage.getItem('products-data'));

  const expiryDateTableData = productObjData.map(product => {
    return [product.id, product.name, product.expiry_date, ""];
  });

  commonData.tableHeader = expiryDateTableHeader;
  commonData.tableData = expiryDateTableData;

  const expiryDateTable = new CreateTableFromData(commonData);

  expiryDateTable.renderTable();

  mainContainer.querySelectorAll('table tbody tr').forEach(function (tr) {
    const expiry_date = new Date(tr.cells[2].textContent);
    const today = new Date();
    tr.cells[2].textContent = formatDate(expiry_date);

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