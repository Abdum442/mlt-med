import { CreateTableFromData, clickable_dropdown_btn } from "../assets/js/tableConstructor.js";
import { retailerTabs } from '../assets/js/retailerTabs.js';
import { retailerForm } from '../assets/js/addRetailerTab.js';
import { modRetailerForm } from '../assets/js/modifyRetailerModal.js';

const customerMgt = document.getElementById('customerMgt');

const detailContainer = document.querySelector('#detailed .recentOrders');
// detailContainer.innerHTML = '';

const retailerTableHeader = ['ID', 'Name', 'Contact Info', 'Address', 'TIN Number', 'Licence Number', 'Remark'];

let retailerTableData = [];

let commonData = {
  tableId: "mainContainer",
  tableHeader: [],
  tableData: []
};

const tabContainer = retailerTabs.createRetailerTabs();
// detailContainer.appendChild(tabContainer);

const addTab = tabContainer.querySelector('#add-tab');
const viewTab = tabContainer.querySelector('#view-tab');

const viewContent = tabContainer.querySelector('#view-content');
const addContent = tabContainer.querySelector('#add-content');
const formContainer = retailerForm.addRetailer();

addContent.appendChild(formContainer);

const modal = modRetailerForm.modifyRetailer();

// detailContainer.appendChild(modal);

const tableContainer = document.createElement('div');
tableContainer.id = 'retailer-table';


commonData.tableId = 'retailer-table';

viewContent.appendChild(tableContainer);

// renderSupplierTable();

const viewRetailerBtn = document.getElementById('viewRetailer');


const rowData = {};

viewRetailerBtn.addEventListener('click', renderRetailerTable);

modal.querySelector('.mod-retailer-modify').addEventListener('click', saveModification);

addContent.querySelector('.form-container .retailer-save').addEventListener('click', addRetailerData);

async function saveModification() {

  const formData = {};

  formData['id'] = rowData.id;
  formData['retailerName'] = modal.querySelector('[name="mod-retailerName"]').value;
  formData['contactInfo'] = modal.querySelector('[name="mod-retailerPhone"]').value;
  formData['address'] = modal.querySelector('[name="mod-retailerAddress"]').value;
  formData['taxInfo'] = modal.querySelector('[name="mod-retailerTIN"]').value;
  formData['licenceNumber'] = modal.querySelector('[name="mod-retailerLicence"]').value;
  formData['remark'] = modal.querySelector('[name="mod-retailerRemark"]').value;

  if (formData.retailerName === '') {
    alert('Specify Name of the customer');
    return;
  }
  modal.style.display = 'none';

  document.getElementById('modal-loader').style.display = 'block';
  const id = await window.electronAPI.fetchData('modify-retailers-data', formData);

  const raw_retailers_data = await window.electronAPI.fetchData('fetch-retailers-data');
  localStorage.setItem('retailers-data', raw_retailers_data);


  document.getElementById('modal-loader').style.display = 'none';

  viewRetailerBtn.click();
  viewTab.click();
} 

function renderRetailerTable () {
  detailContainer.innerHTML = '';
  detailContainer.appendChild(tabContainer);
  // addContent.appendChild(formContainer);
  detailContainer.appendChild(modal);



  const retailerRowData = localStorage.getItem('retailers-data');


  const retailerObjData = JSON.parse(retailerRowData);
  console.log(retailerObjData);
  retailerTableData = retailerObjData.map(obj => [obj.id, obj.name, obj.contact, obj.address, obj.tinnumber, obj.licencenumber, obj.remarks]);

  commonData.tableHeader = retailerTableHeader;
  commonData.tableData = retailerTableData;

  const retailerHTMLtable = new CreateTableFromData(commonData);

  retailerHTMLtable.renderTable();

  clickable_dropdown_btn(tableContainer.querySelector('table'));

  tableContainer.querySelectorAll('table tbody tr').forEach(function (tr) {

    tr.querySelector("td .drop-btn").addEventListener('click', function (event) {
      event.stopPropagation();

      rowData['id'] = tr.cells[0].textContent;
      rowData['retailerName'] = tr.cells[1].textContent;
      rowData['contactInfo'] = tr.cells[2].textContent;
      rowData['address'] = tr.cells[3].textContent;
      rowData['taxInfo'] = tr.cells[4].textContent;
      rowData['licenceNumber'] = tr.cells[5].textContent;
      rowData['remark'] = tr.cells[4].textContent;

      const dropContent = tr.querySelector("td .dropdown-btn .drop-content");

      dropContent.className += ' show';

      const modifyBtn = dropContent.querySelector(".modify");
      const deleteBtn = dropContent.querySelector('.delete');

      deleteBtn.style.display = 'none';

      modifyBtn.addEventListener('click', function (event) {
        event.stopPropagation();

        modal.querySelector('[name="mod-retailerName"]').value = rowData.retailerName;
        modal.querySelector('[name="mod-retailerPhone"]').value = rowData.contactInfo;
        modal.querySelector('[name="mod-retailerAddress"]').value = rowData.address;
        modal.querySelector('[name="mod-retailerTIN"]').value = rowData.taxInfo;
        modal.querySelector('[name="mod-retailerLicence"]').value = rowData.licenceNumber;
        modal.querySelector('[name="mod-retailerRemark"]').value = rowData.remark;

        modal.style.display = 'block';
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

      dropContent.className.replace(' show', '');
    });
  });
}

async function addRetailerData () {
  const formData = {};
  formData['retailerName'] = addContent.querySelector('[name="retailerName"]').value;
  formData['contactInfo'] = addContent.querySelector('[name="retailerPhone"]').value;
  formData['address'] = addContent.querySelector('[name="retailerAddress"]').value;
  formData['taxInfo'] = addContent.querySelector('[name="retailerTIN"]').value;
  formData['licenceNumber'] = addContent.querySelector('[name="retailerLicence"]').value;
  formData['remark'] = addContent.querySelector('[name="retailerRemark"]').value;

  clearAddForm();
  if (formData.retailerName === '') {
    alert('Specify Name of the customer');
    return;
  }

  document.getElementById('modal-loader').style.display = 'block';
  const rowRawData = await window.electronAPI.fetchData('add-retailers-data', formData);

  const raw_retailers_data = await window.electronAPI.fetchData('fetch-retailers-data');
  localStorage.setItem('retailers-data', raw_retailers_data);


  document.getElementById('modal-loader').style.display = 'none';

  viewRetailerBtn.click();
  viewTab.click();

  
}

function clearAddForm () {
  addContent.querySelector('[name="retailerName"]').value = '';
  addContent.querySelector('[name="retailerPhone"]').value = '';
  addContent.querySelector('[name="retailerAddress"]').value = '';
  addContent.querySelector('[name="retailerTIN"]').value = '';
  addContent.querySelector('[name="retailerLicence"]').value = '';
  addContent.querySelector('[name="retailerRemark"]').value = '';

}