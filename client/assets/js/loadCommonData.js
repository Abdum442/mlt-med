const customerMgtMenu = document.getElementById('customerMgt');
const inventoryMgtMenu = document.getElementById('inventoryMgt');
const transactionMgtMenu = document.getElementById('transactionMgt');
const financialReportMgtMenu = document.getElementById('customerMgt');
const settingMenu = document.getElementById('setting');


const frequentData = async function () {
  const raw_users_data = await window.electronAPI.fetchData('fetch-users-data');
  localStorage.setItem('users-data', raw_users_data);

  const raw_suppliers_data = await window.electronAPI.fetchData('fetch-suppliers-data');
  localStorage.setItem('suppliers-data', raw_suppliers_data);

  const raw_retailers_data = await window.electronAPI.fetchData('fetch-retailers-data');
  localStorage.setItem('retailers-data', raw_retailers_data);

  const raw_products_data = await window.electronAPI.fetchData('fetch-products-data');
  localStorage.setItem('products-data', raw_products_data);

  const raw_stock_data = await window.electronAPI.fetchData('fetch-stock-data');
  localStorage.setItem('stock-data', raw_stock_data);

  const raw_sales_data = await window.electronAPI.fetchData('fetch-sales-data');
  localStorage.setItem('sales-data', raw_sales_data);

  const raw_purchase_data = await window.electronAPI.fetchData('fetch-purchase-data');
  localStorage.setItem('purchase-data', raw_purchase_data);

};

customerMgtMenu.addEventListener('click', frequentData);
inventoryMgtMenu.addEventListener('click', frequentData);
transactionMgtMenu.addEventListener('click', frequentData);
financialReportMgtMenu.addEventListener('click', frequentData);
settingMenu.addEventListener('click', frequentData);



