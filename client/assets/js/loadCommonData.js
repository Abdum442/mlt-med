const frequentData = async function () {
  const raw_users_data = await window.electronAPI.fetchData('fetch-users-data');
  localStorage.setItem('users-data', raw_users_data);

  const raw_suppliers_data = await window.electronAPI.fetchData('fetch-suppliers-data');
  localStorage.setItem('suppliers-data', raw_suppliers_data);

  const raw_retailers_data = await window.electronAPI.fetchData('fetch-retailers-data');
  localStorage.setItem('retailers-data', raw_retailers_data);

  const raw_products_data = await window.electronAPI.fetchData('fetch-products-data');
  localStorage.setItem('products-data', raw_products_data);
};

setInterval(() => {
  frequentData();
}, 1000);



