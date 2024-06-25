const customerMgtMenu = document.getElementById('customerMgt');
const inventoryMgtMenu = document.getElementById('inventoryMgt');
const transactionMgtMenu = document.getElementById('transactionMgt');
const financialReportMgtMenu = document.getElementById('financialReportMgt');
const settingMenu = document.getElementById('setting');

const mainContainer = document.getElementById('mainContainer');

const modalLoader = document.getElementById('modal-loader');

const dashboardDetails = document.getElementById('dashboard-details');

// transactionMgtMenu.parentElement.addEventListener('click', function () {
//   alert('transaction menu is clicked');
// })
const user = false;
if (user){
  transactionMgtMenu.style.display = 'none';
}


const frequentData = async function () {
  modalLoader.style.display = 'block';
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

  const raw_expenses_data = await window.electronAPI.fetchData('fetch-expenses-data');
  localStorage.setItem('expenses-data', raw_expenses_data);

  const raw_loans_data = await window.electronAPI.fetchData('fetch-loans-data');
  localStorage.setItem('loans-data', raw_loans_data);

  const raw_debit_data = await window.electronAPI.fetchData('fetch-debit-data');
  localStorage.setItem('debit-data', raw_debit_data);

  const raw_sales_order_data = await window.electronAPI.fetchData('fetch-orders-data');
  localStorage.setItem('orders-data', raw_sales_order_data);
  modalLoader.style.display = 'none';
};

document.addEventListener("DOMContentLoaded", async () => {
  await frequentData();
});

customerMgtMenu.addEventListener('click', async () => {
  document.getElementById('detailed').style.display = 'block';
  dashboardDetails.style.display = 'none';
  await frequentData();
});
inventoryMgtMenu.addEventListener('click', async () => {
  document.getElementById('detailed').style.display = 'block';
  dashboardDetails.style.display = 'none';
  await frequentData();
});
transactionMgtMenu.addEventListener('click', async () => {
  document.getElementById('detailed').style.display = 'block';
  dashboardDetails.style.display = 'none';
  await frequentData();
});
financialReportMgtMenu.addEventListener('click', async () => {
  document.getElementById('detailed').style.display = 'block';
  dashboardDetails.style.display = 'none';
  await frequentData();
});
settingMenu.addEventListener('click', async () => {
  document.getElementById('detailed').style.display = 'block';
  dashboardDetails.style.display = 'none';
  await frequentData();
});



