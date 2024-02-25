import { CreateTableFromData, clickable_dropdown_btn } from "./tableConstructor.js";
// import { purchaseForm } from './purchaseForm.js';
import { retailerForm } from './retailerForm.js';
import { supplierForm } from './supplierForm.js';


const customerMgt = document.getElementById('customerMgt');

const viewSupplierBtn = document.getElementById('viewSupplier');
const viewRetailerBtn = document.getElementById('viewRetailer');

const mainContainer = document.getElementById('mainContainer');
const addNewBtn = document.getElementById('add_new');

const pageTitle = document.querySelector('#recent_orders .cardHeader h2');

const supplierTableHeader = ['ID', 'Name', 'Contact Info', 'Address', 'Tin No.', 
                              'Licence No.', 'Remark'];
const retailerTableHeader = ['ID', 'Name', 'Contact Info', 'Address', 'Remark'];

let supplierTableData = [];
let retailerTableData = [];

let commonData = {
  tableId: "mainContainer",
  tableHeader: [],
  tableData: []
};


customerMgt.addEventListener('click', function () {

  window.electronAPI.sendToMain('fetch-suppliers-data');
  window.electronAPI.receiveFromMain('fetch-suppliers-data-response', (event, response) => {
    
    const supplierObjData = response;
    
    supplierTableData = supplierObjData.map(obj => [obj.id, obj.name, obj.contactinfo, obj.address, 
                                                    obj.taxinfo, obj.licencenumber, obj.remark]);
  });

  window.electronAPI.sendToMain('fetch-retailer-data');
  window.electronAPI.receiveFromMain('fetch-retailer-data-response', (event, response) => {

    const retailerObjData = response;

    // console.log("Data: ", response);

    retailerTableData = retailerObjData.map(obj => [obj.id, obj.name, obj.contact, obj.address, obj.remarks]);
  });
});


viewSupplierBtn.addEventListener('click', function (){

  
  addNewBtn.style.display = 'block';
  pageTitle.innerHTML = 'Supplier Companies';

  commonData.tableHeader = supplierTableHeader;
  commonData.tableData = supplierTableData;

  const supplierHTMLtable = new CreateTableFromData(commonData);

  supplierHTMLtable.renderTable();

  clickable_dropdown_btn(mainContainer.querySelector('table'));

  

  mainContainer.querySelectorAll('table tbody tr').forEach(function (tr) {

    const rowData = {};

    rowData['id'] = tr.cells[0].textContent;
    rowData['supplierName'] = tr.cells[1].textContent;
    rowData['contactInfo'] = tr.cells[2].textContent;
    rowData['address'] = tr.cells[3].textContent;
    rowData['taxInfo'] = tr.cells[4].textContent;
    rowData['licenceNumber'] = tr.cells[5].textContent;
    rowData['remark'] = tr.cells[6].textContent;

    
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

        addNewBtn.click();

        const supplierHTMLForm = mainContainer.querySelector('#supplierForm');
        // console.log(supplierForm)


        supplierHTMLForm.querySelector('[name="supplierName"]').value = rowData.supplierName;
        supplierHTMLForm.querySelector('[name="contactInfo"]').value = rowData.contactInfo;
        supplierHTMLForm.querySelector('[name="address"]').value = rowData.address;
        supplierHTMLForm.querySelector('[name="taxInfo"]').value = rowData.taxInfo;
        supplierHTMLForm.querySelector('[name="LicenceNumber"]').value = rowData.licenceNumber;
        supplierHTMLForm.querySelector('[name="remark"]').value = rowData.remark;

        

        supplierHTMLForm.parentNode.querySelector('#save_btn').style.display = 'none';

        supplierHTMLForm.parentNode.querySelector('#modify_btn').style.display = 'block';

        mainContainer.style.display = 'block';

        supplierHTMLForm.parentNode.querySelector('#modify_btn').addEventListener('click', function (event) {
          event.stopPropagation();
          const formData = new FormData(supplierHTMLForm);

          const formDataObject = {};
          const rowList = [rowData.id];

          formDataObject['id'] = rowData.id;

          formData.forEach((value, key) => {
            
            formDataObject[key] = value;
            rowList.push(value);

          });
          window.electronAPI.sendToMain('modify-supplier-data', formDataObject);

          window.electronAPI.receiveFromMain('modify-supplier-data-response', (event, responseData) => {

            
          });
          
          supplierTableData = modifyDataById(supplierTableData, rowList);
          console.log('rowList: ', supplierTableData);
          viewSupplierBtn.click();
        });
      });

      deleteBtn.addEventListener('click', function (event) {
        event.stopPropagation();

        const dataID = {id: rowData.id};
        window.electronAPI.sendToMain('delete-supplier-data', dataID);

        window.electronAPI.receiveFromMain('delete-supplier-data-response', (event, responseData) => {

          // console.log('Supplier modified: ', responseData);
        });
        console.log('id : ', rowData.id);
        supplierTableData = deleteDataById(supplierTableData, rowData.id);
        viewSupplierBtn.click();
      });
    });
  });

  addNewBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    addNewBtn.style.display = 'none';
    supplierForm.showSupplierForm();
    const supplierHTMLForm = document.getElementById('supplierForm');

    supplierHTMLForm.parentNode.querySelector('#modify_btn').style.display = 'none'

    pageTitle.innerHTML = 'Supplier Company Registration Form';

    supplierHTMLForm.parentNode.querySelector('#save_btn').addEventListener('click', function (event) {
      event.stopPropagation();
      const formData = new FormData(document.getElementById('supplierForm'));

      const formDataObject = {};
      const rowList = [0];
      formData.forEach((value, key) => {
        formDataObject[key] = value;
        rowList.push(value);
      });
      window.electronAPI.sendToMain('add-supplier-data', formDataObject);

      window.electronAPI.receiveFromMain('add-supplier-data-response', (event, responseData) => {
        console.log('Supplier added with Id: ', responseData[0].id);
        console.log('rowList[0]: ', rowList[0]);
        rowList[0] = responseData[0].id;
        supplierTableData.push(rowList);

        viewSupplierBtn.click();
      });
      
    });
  });

});


viewRetailerBtn.addEventListener('click', function () {
  addNewBtn.style.display = 'block';

  pageTitle.innerHTML = 'Retailer Customers';

  

    // console.log('Retailer Data: ', retailerTableData);


  commonData.tableHeader = retailerTableHeader;
  commonData.tableData = retailerTableData;

  const retailerHTMLtable = new CreateTableFromData(commonData);

  retailerHTMLtable.renderTable();

  clickable_dropdown_btn(mainContainer.querySelector('table'));

  mainContainer.querySelectorAll('table tbody tr').forEach(function (tr) {

      const rowData = {};

      rowData['id'] = tr.cells[0].textContent;
      rowData['retailerName'] = tr.cells[1].textContent;
      rowData['contactInfo'] = tr.cells[2].textContent;
      rowData['address'] = tr.cells[3].textContent;
      rowData['remark'] = tr.cells[4].textContent;


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

          addNewBtn.click();

          const retailerHTMLForm = mainContainer.querySelector('#retailerForm');
          // console.log(supplierForm)


          retailerHTMLForm.querySelector('[name="retailerName"]').value = rowData.retailerName;
          retailerHTMLForm.querySelector('[name="contactInfo"]').value = rowData.contactInfo;
          retailerHTMLForm.querySelector('[name="address"]').value = rowData.address;
          retailerHTMLForm.querySelector('[name="remark"]').value = rowData.remark;



          retailerHTMLForm.parentNode.querySelector('#save_btn').style.display = 'none';

          retailerHTMLForm.parentNode.querySelector('#modify_btn').style.display = 'block';

          mainContainer.style.display = 'block';

          retailerHTMLForm.parentNode.querySelector('#modify_btn').addEventListener('click', function () {

            const formData = new FormData(retailerHTMLForm);

            const formDataObject = {};
            const rowList = [rowData.id];

            formDataObject['id'] = rowData.id;

            formData.forEach((value, key) => {

              formDataObject[key] = value;
              rowList.push(value);
            });
            // console.log('Retailer ID: ', formDataObject)
            window.electronAPI.sendToMain('modify-retailer-data', formDataObject);

            window.electronAPI.receiveFromMain('modify-retailer-data-response', (event, responseData) => {

              
            });
            
            retailerTableData = modifyDataById(retailerTableData, rowList);
            viewRetailerBtn.click();
          });
        });

        deleteBtn.addEventListener('click', function (event) {
          event.stopPropagation();
          // data['id'] = rowData.id;
          window.electronAPI.sendToMain('delete-retailer-data', rowData);

          window.electronAPI.receiveFromMain('delete-retailer-data-response', (event, responseData) => {

            // console.log('Retailer modified: ', responseData);
          });
          
          retailerTableData = deleteDataById(retailerTableData, rowData.id);
          viewRetailerBtn.click();
        });
      });
    });
  addNewBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    addNewBtn.style.display = 'none';
    retailerForm.showRetailerForm();
    const retailerHTMLForm = document.getElementById('retailerForm');

    retailerHTMLForm.parentNode.querySelector('#modify_btn').style.display = 'none'

    pageTitle.innerHTML = 'Retailer Customer Registration Form';

    retailerHTMLForm.parentNode.querySelector('#save_btn').addEventListener('click', function (event) {
      event.stopPropagation();

      const formData = new FormData(document.getElementById('retailerForm'));

      // Convert form data to a plain JavaScript object
      const formDataObject = {};
      const rowList = [0];
      formData.forEach((value, key) => {
        formDataObject[key] = value;
        rowList.push(value);
      });
      window.electronAPI.sendToMain('add-retailer-data', formDataObject);

      window.electronAPI.receiveFromMain('add-retailer-data-response', (event, responseData) => {
        
        rowList[0] = responseData[0].id;
        console.log("rowList :", rowList)
        retailerTableData.push(rowList);
        viewRetailerBtn.click();
      });
      
    });
  });
});


function deleteDataById(data, idToDelete) {
  const filteredData = [];
  
  for (const list of data) {
    if (parseInt(list[0]) !== parseInt(idToDelete)) {
      filteredData.push(list);
    }
  }
  return filteredData;
}

function modifyDataById(data, listToInsert) {
  const filteredData = [];

  for (const list of data) {
    if (parseInt(list[0]) == parseInt(listToInsert[0])) {
      filteredData.push(listToInsert);
    } else {
      filteredData.push(list);
    }
  }
  return filteredData;
}