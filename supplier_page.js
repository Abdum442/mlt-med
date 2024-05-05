import { supplierTabs } from './supplierTabs.js';
import { supplierForm } from './addSupplierTab.js';
import { modSupplierForm } from './modifySupplierModal.js';

const tabContainer = supplierTabs.createSupplierTabs();

document.body.appendChild(tabContainer);

const viewContent = tabContainer.querySelector('#view-content');
const addContent = tabContainer.querySelector('#add-content');



const formContainer = supplierForm.addSupplier();

addContent.appendChild(formContainer);

const modal = modSupplierForm.modifySupplier();

document.body.appendChild(modal);