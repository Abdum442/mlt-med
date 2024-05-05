const dashboard = document.getElementById('dashboardMenu');

dashboard.addEventListener('click', function () {
  const inventoryContent = document.body.querySelector('.details .recentOrders');
  inventoryContent.innerHTML = '';

  const tabContainer = inventoryContainer();


  const productContent = tabContainer.querySelector('#product-content');
  const stockContent = tabContainer.querySelector('#stock-content');
  const expiryContent = tabContainer.querySelector('#expiry-content');



  inventoryContent.appendChild(tabContainer);

  manageTabEvents(tabContainer);
});






function manageTabs(tabId, contId) {
  const tab = document.getElementById(tabId);
  const tabCont = document.getElementById(contId);
  var i, tabLinks, tabContents;
  tabLinks = document.getElementsByClassName('tab-link');
  tabContents = document.getElementsByClassName('tab-content')
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove('active');
    tabContents[i].style.display = 'none';
  }
  tab.classList.add('active');
  tabCont.style.display = 'block';
}

function manageTabEvents(tab_cont) {
  const productTab = tab_cont.querySelector('#product');
  const stockTab = tab_cont.querySelector('#stock');
  const expiryTab = tab_cont.querySelector('#expiry');

  productTab.addEventListener('click', function () {
    manageTabs('product', 'product-content')
  });
  stockTab.addEventListener('click', function () {
    manageTabs('stock', 'stock-content')
  });
  expiryTab.addEventListener('click', function () {
    manageTabs('expiry', 'expiry-content')
  });

  productTab.click();
}

function inventoryContainer () {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.id = "inventory-container"

  tabContainer.innerHTML = `<div class="tab">
              <button class="tab-link" id="product">Products</button>
              <button class="tab-link" id="stock">Stock Level</button>
              <button class="tab-link" id="expiry"> Expiry Date Tracker</button>
            </div>
            <div class="tab-content" id="product-content">
              <h2>Product</h2>
            </div>
            <div class="tab-content" id="stock-content">
              <h2>Stock Level</h2>
            </div>
            <div class="tab-content" id="expiry-content">
              <h2>Expiry Date Tracker</h2>
            </div>`;
  return tabContainer;
}