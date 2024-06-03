import { CreateTableFromData, clickable_dropdown_btn } from "../assets/js/tableConstructor.js";
import { supplierTabs } from '../assets/js/supplierTabs.js';
import { supplierForm } from '../assets/js/addSupplierTab.js';
import { modSupplierForm } from '../assets/js/modifySupplierModal.js';


const customerMgt = document.getElementById('customerMgt');

const detailContainer = document.querySelector('#detailed .recentOrders');
// detailContainer.innerHTML = '';

const supplierTableHeader = ['ID', 'Name', 'Contact Info', 'Address', 'Tin No.',
  'Licence No.', 'Remark'];

let supplierTableData = [];

let commonData = {
  tableId: "mainContainer",
  tableHeader: [],
  tableData: []
};

const tabContainer = supplierTabs.createSupplierTabs();
// detailContainer.appendChild(tabContainer);

const addTab = tabContainer.querySelector('#add-tab');
const viewTab = tabContainer.querySelector('#view-tab');

const viewContent = tabContainer.querySelector('#view-content');
const addContent = tabContainer.querySelector('#add-content');
const formContainer = supplierForm.addSupplier();

addContent.appendChild(formContainer);

const modal = modSupplierForm.modifySupplier();

// detailContainer.appendChild(modal);

const tableContainer = document.createElement('div');
tableContainer.id = 'supplier-table';


commonData.tableId = 'supplier-table';

viewContent.appendChild(tableContainer);

// renderSupplierTable();

const viewSupplierBtn = document.getElementById('viewSupplier');


const rowData = {};

viewSupplierBtn.addEventListener('click', renderSupplierTable);

modal.querySelector('.mod-supplier-modify').addEventListener('click', saveModification);

addContent.querySelector('.form-container .supplier-save').addEventListener('click', addSupplierData);

async function saveModification() {

  const formData = {};

  formData['id'] = rowData.id;
  formData['supplierName'] = modal.querySelector('[name="mod-supplierName"]').value;
  formData['contactInfo'] = modal.querySelector('[name="mod-supplierPhone"]').value;
  formData['address'] = modal.querySelector('[name="mod-supplierAddress"]').value;
  formData['taxInfo'] = modal.querySelector('[name="mod-supplierTIN"]').value;
  formData['licenceNumber'] = modal.querySelector('[name="mod-supplierLicence"]').value;
  formData['remark'] = modal.querySelector('[name="mod-supplierRemark"]').value;



  const id = await window.electronAPI.fetchData('modify-suppliers-data', formData);

  modal.style.display = 'none';
  viewTab.click();
  
  customerMgt.click();
  viewSupplierBtn.click();
} 

function renderSupplierTable () {
  detailContainer.innerHTML = '';
  detailContainer.appendChild(tabContainer);
  // addContent.appendChild(formContainer);
  detailContainer.appendChild(modal);



  const suppliersRowData = localStorage.getItem('suppliers-data');

  const supplierObjData = JSON.parse(suppliersRowData);

  supplierTableData = supplierObjData.map(obj => [obj.id, obj.name, obj.contactinfo, obj.address,
  obj.taxinfo, obj.licencenumber, obj.remark]);
  commonData.tableHeader = supplierTableHeader;
  commonData.tableData = supplierTableData;

  const supplierHTMLtable = new CreateTableFromData(commonData);

  supplierHTMLtable.renderTable();

  clickable_dropdown_btn(tableContainer.querySelector('table'));

  tableContainer.querySelectorAll('table tbody tr').forEach(function (tr) {

    tr.querySelector("td .drop-btn").addEventListener('click', function (event) {
      event.stopPropagation();

      rowData['id'] = tr.cells[0].textContent;
      rowData['supplierName'] = tr.cells[1].textContent;
      rowData['contactInfo'] = tr.cells[2].textContent;
      rowData['address'] = tr.cells[3].textContent;
      rowData['taxInfo'] = tr.cells[4].textContent;
      rowData['licenceNumber'] = tr.cells[5].textContent;
      rowData['remark'] = tr.cells[6].textContent;

      const dropContent = tr.querySelector("td .dropdown-btn .drop-content");

      dropContent.className += ' show';

      const modifyBtn = dropContent.querySelector(".modify");
      const deleteBtn = dropContent.querySelector('.delete');

      deleteBtn.style.display = 'none';

      modifyBtn.addEventListener('click', function (event) {
        event.stopPropagation();

        modal.querySelector('[name="mod-supplierName"]').value = rowData.supplierName;
        modal.querySelector('[name="mod-supplierPhone"]').value = rowData.contactInfo;
        modal.querySelector('[name="mod-supplierAddress"]').value = rowData.address;
        modal.querySelector('[name="mod-supplierTIN"]').value = rowData.taxInfo;
        modal.querySelector('[name="mod-supplierLicence"]').value = rowData.licenceNumber;
        modal.querySelector('[name="mod-supplierRemark"]').value = rowData.remark;

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

async function addSupplierData () {
  const formData = {};
  formData['supplierName'] = addContent.querySelector('[name="supplierName"]').value;
  formData['contactInfo'] = addContent.querySelector('[name="supplierPhone"]').value;
  formData['address'] = addContent.querySelector('[name="supplierAddress"]').value;
  formData['taxInfo'] = addContent.querySelector('[name="supplierTIN"]').value;
  formData['licenceNumber'] = addContent.querySelector('[name="supplierLicence"]').value;
  formData['remark'] = addContent.querySelector('[name="supplierRemark"]').value;

  clearAddForm();
  document.getElementById('modal-loader').style.display = 'block';
  const rowRawData = await window.electronAPI.fetchData('add-suppliers-data', formData);

  const raw_suppliers_data = await window.electronAPI.fetchData('fetch-suppliers-data');
  localStorage.setItem('suppliers-data', raw_suppliers_data);


  document.getElementById('modal-loader').style.display = 'none';

  viewSupplierBtn.click();
  viewTab.click();
}

function clearAddForm () {
  addContent.querySelector('[name="supplierName"]').value = '';
  addContent.querySelector('[name="supplierPhone"]').value = '';
  addContent.querySelector('[name="supplierAddress"]').value = '';
  addContent.querySelector('[name="supplierTIN"]').value = '';
  addContent.querySelector('[name="supplierLicence"]').value = '';
  addContent.querySelector('[name="supplierRemark"]').value = '';

}