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
    obj.expiry_date, obj.remarks]);
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

      // const formData = new FormData(productHTMLForm);

      // const formDataObject = {};
      // // const rowList = [0];
      // formData.forEach((value, key) => {
      //   formDataObject[key] = value;
      //   // rowList.push(value);
      // });
      console.log('formValues', formValues);

      const rowRawData = await window.electronAPI.fetchData('add-products-data', formValues);

      // const res = JSON.parse(rowRawData);
      // rowList[0] = res[0].id;
      // supplierTableData.push(rowList);

      mainContainer.innerHTML = '';

      setTimeout(() => {
        productBtn.click();
      }, 1000);
    });
  });

});
